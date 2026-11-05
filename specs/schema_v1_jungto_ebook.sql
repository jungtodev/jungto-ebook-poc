-- =============================================================================
-- 『정토대전 (淨土大典)』 100% 전자책(eBook) · 가상계좌 · 금강(金剛) DRM 플랫폼
-- PostgreSQL 16 Production Database Schema (DDL v1.0.0)
-- =============================================================================
-- 확정 정책 반영:
--   1. 종이책 미발행 (100% 디지털 전자책 단독 발행 · 배송지 컬럼 일체 배제)
--   2. 전자출판물 단독 E-ISBN 부가가치세 0% 면세 (정가 200,000원, 세액 0원)
--   3. PG 1회용 가상계좌(무통장 송금) 단일 결제 (+72h 입금 기한 TTL)
--   4. 미열람 청약철회 대비 환불 반환계좌 사전 수집 (AES-256-GCM 암호화 저장)
--   5. 전자상거래법 제17조 제2항 제5호: 최초 1페이지 열람(reading_started_at) 단방향 잠금
--   6. 기기 핑거프린트(SHA-256) 기반 최대 3대 동시 등록 슬롯 제한 트리거
--   7. 전자상거래법 제6조: 5년 법정 보관 Append-Only 감사 로그 및 해시 체인 무결성
-- =============================================================================

BEGIN;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. ebook_orders : 전자책 주문 및 1회용 가상계좌 채번 원장
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ebook_orders (
    order_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_no            VARCHAR(32)  NOT NULL UNIQUE,               -- 예: JTS-2026-1023-8841
    user_id             UUID         NOT NULL,                      -- 정토회원 고유 식별자 (SSO)
    dharma_name         VARCHAR(64)  NOT NULL,                      -- 회원 법명/성명 (워터마크 각인용)
    product_code        VARCHAR(32)  NOT NULL DEFAULT 'JUNGTO_DAEJEON_4VOL_EBOOK',
    e_isbn              VARCHAR(32)  NOT NULL DEFAULT '979-11-98765-01-2',
    supply_amount       INTEGER      NOT NULL DEFAULT 200000 CHECK (supply_amount = 200000),
    vat_amount          INTEGER      NOT NULL DEFAULT 0      CHECK (vat_amount = 0), -- E-ISBN 면세 0원
    total_amount        INTEGER      NOT NULL DEFAULT 200000 CHECK (total_amount = 200000),

    -- 가상계좌(무통장 송금) 전용 컬럼
    vbank_bank_code     VARCHAR(10)  NOT NULL,                      -- 은행코드 (004 국민, 088 신한 등)
    vbank_bank_name     VARCHAR(32)  NOT NULL,
    vbank_account_no    VARCHAR(64)  NOT NULL,                      -- 1회용 가상계좌 번호
    vbank_holder_name   VARCHAR(64)  NOT NULL DEFAULT '재단법인정토회',
    vbank_expires_at    TIMESTAMPTZ  NOT NULL,                      -- 채번 후 +72시간 입금 만료 기한

    -- 미열람 청약철회 대비 환불 반환계좌 (AES-256-GCM 암호화 페이로드)
    refund_bank_code    VARCHAR(10)  NOT NULL,
    refund_holder_name  VARCHAR(64)  NOT NULL,
    refund_account_enc  BYTEA        NOT NULL,                      -- AES-256-GCM 암호문 (IV + Tag 포함)

    -- 국세청 면세(0%) 현금영수증 식별 정보
    cash_receipt_type   VARCHAR(16)  NOT NULL DEFAULT 'INCOME_DEDUCTION'
                        CHECK (cash_receipt_type IN ('NONE', 'INCOME_DEDUCTION', 'EXPENSE_PROOF')),
    cash_receipt_id_enc BYTEA,                                      -- 휴대폰번호/사업자번호 암호문
    cash_receipt_no     VARCHAR(64),                                -- 국세청 승인번호

    -- 법정 필수 동의 3종 타임스탬프
    agreed_digital_law_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),       -- 전상법 제17조 열람 개시 후 환불 제한 동의
    agreed_copyright_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),       -- 금강 DRM 워터마크 각인 동의
    agreed_privacy_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),       -- 환불계좌 수집 동의

    -- 주문 상태 머신
    status              VARCHAR(24)  NOT NULL DEFAULT 'AWAITING_DEPOSIT'
                        CHECK (status IN (
                            'AWAITING_DEPOSIT',
                            'PAID',
                            'EXPIRED',
                            'REFUND_REQUESTED',
                            'REFUNDED'
                        )),
    paid_at             TIMESTAMPTZ,
    refunded_at         TIMESTAMPTZ,
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ebook_orders_user_status ON ebook_orders (user_id, status);
CREATE INDEX idx_ebook_orders_vbank_expiry ON ebook_orders (status, vbank_expires_at)
    WHERE status = 'AWAITING_DEPOSIT';

-- -----------------------------------------------------------------------------
-- 2. ebook_payment_webhooks : PG 입금/환불 통보 웹훅 멱등성(Idempotency) 원장
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ebook_payment_webhooks (
    webhook_id          BIGSERIAL PRIMARY KEY,
    order_id            UUID         NOT NULL REFERENCES ebook_orders(order_id) ON DELETE RESTRICT,
    pg_tx_id            VARCHAR(100) NOT NULL UNIQUE,               -- DB 레벨 멱등성 보장 (이중 입금 처리 원천 차단)
    pg_provider         VARCHAR(32)  NOT NULL DEFAULT 'TOSS_PAYMENTS',
    event_type          VARCHAR(32)  NOT NULL
                        CHECK (event_type IN ('VBANK_ISSUED', 'DEPOSIT_COMPLETED', 'VBANK_EXPIRED', 'REFUND_TRANSFER_DONE')),
    deposit_amount      INTEGER      NOT NULL,
    hmac_signature      VARCHAR(128) NOT NULL,                      -- X-PG-Signature 헤더 원본
    hmac_verified       BOOLEAN      NOT NULL DEFAULT TRUE CHECK (hmac_verified = TRUE),
    raw_payload         JSONB        NOT NULL,
    processed_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ebook_webhooks_order_id ON ebook_payment_webhooks (order_id);

-- -----------------------------------------------------------------------------
-- 3. ebook_entitlements : 전자책 열람 판권 및 법정 청약철회 잠금(ReadingStart) 원장
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ebook_entitlements (
    entitlement_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id            UUID         NOT NULL UNIQUE REFERENCES ebook_orders(order_id) ON DELETE RESTRICT,
    user_id             UUID         NOT NULL,
    edition_version     VARCHAR(16)  NOT NULL DEFAULT 'v1.0.0',     -- S3 릴리즈 버전 매핑
    status              VARCHAR(16)  NOT NULL DEFAULT 'ACTIVE'
                        CHECK (status IN ('ACTIVE', 'REVOKED', 'SUSPENDED')),

    -- 전자상거래법 제17조 제2항 제5호 핵심 판정 기준 컬럼
    -- NULL = 미열람 (7일 이내 전액 환불 가능)
    -- NOT NULL = 1페이지 이상 열람 개시 (온라인 자동 환불 영구 잠금 -> HTTP 409 Conflict)
    reading_started_at  TIMESTAMPTZ,
    first_read_volume   SMALLINT     CHECK (first_read_volume BETWEEN 1 AND 4),
    first_read_ip       INET,
    first_read_device_id UUID,

    granted_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    revoked_at          TIMESTAMPTZ,
    revoke_reason       VARCHAR(255)
);

CREATE INDEX idx_ebook_entitlements_user_active ON ebook_entitlements (user_id, status);

-- 단방향(One-Way) 잠금 보호 트리거: 한 번 기록된 reading_started_at은 절대 NULL로 되돌릴 수 없음
CREATE OR REPLACE FUNCTION fn_lock_reading_started_at()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.reading_started_at IS NOT NULL AND NEW.reading_started_at IS DISTINCT FROM OLD.reading_started_at THEN
        RAISE EXCEPTION 'LAW_VIOLATION: reading_started_at is immutable once set (old=%).', OLD.reading_started_at;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_lock_reading_started_at
BEFORE UPDATE ON ebook_entitlements
FOR EACH ROW EXECUTE FUNCTION fn_lock_reading_started_at();

-- -----------------------------------------------------------------------------
-- 4. ebook_registered_devices : 기기 핑거프린트(Max 3대) 슬롯 제어 테이블
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ebook_registered_devices (
    device_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entitlement_id      UUID         NOT NULL REFERENCES ebook_entitlements(entitlement_id) ON DELETE CASCADE,
    user_id             UUID         NOT NULL,
    device_fp_hash      CHAR(64)     NOT NULL,                      -- SHA-256(Canvas + WebGL + Audio + UA)
    device_name         VARCHAR(100) NOT NULL,                      -- 예: iPad Air 5 (Safari 17)
    os_family           VARCHAR(32)  NOT NULL,                      -- iOS / macOS / Windows / Android
    browser_family      VARCHAR(32)  NOT NULL,
    is_active           BOOLEAN      NOT NULL DEFAULT TRUE,
    last_active_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    registered_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    unbound_at          TIMESTAMPTZ,
    UNIQUE (entitlement_id, device_fp_hash)
);

CREATE INDEX idx_ebook_devices_entitlement_active ON ebook_registered_devices (entitlement_id, is_active)
    WHERE is_active = TRUE;

-- 최대 3대 활성 기기 제한 강제 트리거
CREATE OR REPLACE FUNCTION fn_enforce_max_3_devices()
RETURNS TRIGGER AS $$
DECLARE
    v_active_count INTEGER;
BEGIN
    IF NEW.is_active = TRUE THEN
        SELECT COUNT(*) INTO v_active_count
          FROM ebook_registered_devices
         WHERE entitlement_id = NEW.entitlement_id
           AND is_active = TRUE
           AND device_id IS DISTINCT FROM NEW.device_id;

        IF v_active_count >= 3 THEN
            RAISE EXCEPTION 'DEVICE_LIMIT_EXCEEDED: Maximum 3 active devices allowed per entitlement (entitlement_id=%).', NEW.entitlement_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_enforce_max_3_devices
BEFORE INSERT OR UPDATE ON ebook_registered_devices
FOR EACH ROW EXECUTE FUNCTION fn_enforce_max_3_devices();

-- -----------------------------------------------------------------------------
-- 5. ebook_reading_progress : 권별(1~4권) 이어보기·북마크·뷰어 환경 동기화
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ebook_reading_progress (
    progress_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entitlement_id      UUID         NOT NULL REFERENCES ebook_entitlements(entitlement_id) ON DELETE CASCADE,
    volume_no           SMALLINT     NOT NULL CHECK (volume_no BETWEEN 1 AND 4),
    current_page        INTEGER      NOT NULL DEFAULT 1 CHECK (current_page >= 1),
    scroll_ratio        NUMERIC(5,4) NOT NULL DEFAULT 0.0000 CHECK (scroll_ratio BETWEEN 0 AND 1),
    bookmarks_json      JSONB        NOT NULL DEFAULT '[]'::jsonb,
    highlights_json     JSONB        NOT NULL DEFAULT '[]'::jsonb,
    font_scale          SMALLINT     NOT NULL DEFAULT 100 CHECK (font_scale BETWEEN 80 AND 200),
    theme_mode          VARCHAR(16)  NOT NULL DEFAULT 'PAPER'
                        CHECK (theme_mode IN ('PAPER', 'WHITE', 'DARK')),
    updated_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    UNIQUE (entitlement_id, volume_no)
);

-- -----------------------------------------------------------------------------
-- 6. ebook_audit_logs : 전자상거래법 5년 보관 불변(Append-Only) 감사 및 포렌식 원장
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ebook_audit_logs (
    log_id              BIGSERIAL PRIMARY KEY,
    actor_id            UUID         NOT NULL,
    actor_role          VARCHAR(16)  NOT NULL CHECK (actor_role IN ('MEMBER', 'ADMIN', 'CS_OPERATOR', 'PG_WEBHOOK', 'SYSTEM')),
    order_id            UUID,
    entitlement_id      UUID,
    event_type          VARCHAR(48)  NOT NULL,                      -- VBANK_ISSUED, WEBHOOK_PAID, READING_START_LOCKED, REFUND_BLOCKED_409 등
    reason_text         TEXT         NOT NULL,
    forensic_wm_hash    CHAR(64),                                   -- JTS-WM-SHA256 포렌식 워터마크 해시
    ip_address          INET         NOT NULL,
    user_agent          TEXT,
    prev_log_hash       CHAR(64)     NOT NULL,                      -- 직전 로그 해시 (위변조 검증 체인)
    curr_log_hash       CHAR(64)     NOT NULL,                      -- SHA-256(prev_log_hash || event_type || created_at || reason_text)
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ebook_audit_order ON ebook_audit_logs (order_id, created_at DESC);
CREATE INDEX idx_ebook_audit_wm_hash ON ebook_audit_logs (forensic_wm_hash) WHERE forensic_wm_hash IS NOT NULL;

-- Append-Only 강제 트리거: 감사 로그는 UPDATE 또는 DELETE가 절대 불가능함 (전자상거래법 제6조 5년 보존)
CREATE OR REPLACE FUNCTION fn_prevent_audit_log_mutation()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'IMMUTABLE_AUDIT_LOG: ebook_audit_logs is append-only. UPDATE and DELETE are strictly prohibited.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_audit_log_mutation
BEFORE UPDATE OR DELETE ON ebook_audit_logs
FOR EACH ROW EXECUTE FUNCTION fn_prevent_audit_log_mutation();

COMMIT;
