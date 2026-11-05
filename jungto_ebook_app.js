/**
 * 『정토대전 (淨土大典)』 프로덕션 수준 eBook 통합 서비스 & 뷰어 엔진 (v1.0.3)
 * - 발행 정책: 종이책 미발행 · 100% 전자책(eBook) 단독 발행 (배송지 수집 불필요, 전자출판물 전용 ISBN 면세)
 * - 결제 정책: 가상계좌(송금) 단일 결제 (1회용 가상계좌 채번 -> 송금 입금완료 웹훅 -> 열람권 ACTIVE 자동 활성화)
 * - 디자인 시스템: 정토회 공식 홈페이지(https://www.jungto.org/) UI/UX 룩앤필 완벽 동기화
 */

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

const STORAGE_KEY = "JUNGTO_DAEJEON_PROD_POC_V3_EBOOK_VBANK_ONLY";

const VOLUME_CATALOG = [
  {
    id: "vol1",
    volNum: "제1권",
    title: "정토대전 제1권 경전편",
    hanja: "淨土大典 第一卷 經典篇",
    subtitle: "초기불교 근본경전과 대승불교 핵심경전 집성 (전자책 전용)",
    url: "pdfs/jungto_daejeon_vol1.pdf",
    badgeColor: "#519ea6",
    accentSub: "#36858c",
    version: "v1.0.1",
    errataCount: 2,
    keywords: ["연기법", "사성제", "팔정도", "반야심경", "금강경", "무주상보시"]
  },
  {
    id: "vol2",
    volNum: "제2권",
    title: "정토대전 제2권 사료편",
    hanja: "淨土大典 第二卷 史料篇",
    subtitle: "한국불교 중흥과 정토회 30년 수행·사회실천 사료 집대성 (전자책 전용)",
    url: "pdfs/jungto_daejeon_vol2.pdf",
    badgeColor: "#ee8545",
    accentSub: "#d1743b",
    version: "v1.0.1",
    errataCount: 1,
    keywords: ["만일결사", "천일결사", "용성조사", "JTS", "수자타아카데미", "소욕지족"]
  },
  {
    id: "vol3",
    volNum: "제3권",
    title: "정토대전 제3권 법문편",
    hanja: "淨土大典 第三卷 法門篇",
    subtitle: "즉문즉설과 수행 법문 · 삶 속에서 깨어나는 지혜의 문답 (전자책 전용)",
    url: "pdfs/jungto_daejeon_vol3.pdf",
    badgeColor: "#36858c",
    accentSub: "#28666c",
    version: "v1.0.1",
    errataCount: 1,
    keywords: ["즉문즉설", "법륜스님", "108배", "오체투지", "청춘콘서트", "마음공부"]
  },
  {
    id: "vol4",
    volNum: "제4권",
    title: "정토대전 제4권 해설·색인편",
    hanja: "淨土大典 第四卷 解說·索引篇",
    subtitle: "경전·사료·법문 종합 해제, 불교술어 사전 및 전권 통합 색인 (전자책 전용)",
    url: "pdfs/jungto_daejeon_vol4.pdf",
    badgeColor: "#d1743b",
    accentSub: "#b35e2a",
    version: "v1.0.1",
    errataCount: 1,
    keywords: ["삼법인", "육바라밀", "원효대사", "청약철회", "워터마크", "라이선스"]
  }
];

const EXTRA_PDFS = {
  preview: {
    id: "preview",
    volNum: "맛보기",
    title: "정토대전 제1권 경전편 [무료 맛보기 샘플]",
    hanja: "無料 豫習本 (제1장 수록)",
    url: "pdfs/jungto_daejeon_preview.pdf",
    version: "v1.0.1"
  },
  bubhoe69: {
    id: "bubhoe69",
    volNum: "대용량검증",
    title: "정토회 법회출석 시스템 설계서 (69p 실문서 테스트)",
    hanja: "69페이지 대용량 한글 PDF 스트레스 검증",
    url: "pdfs/jts_bubhoe_69p.pdf",
    version: "v1.0.0"
  },
  tracemonkey: {
    id: "tracemonkey",
    volNum: "영문검증",
    title: "Mozilla TraceMonkey PLDI 논문 (14p 영문/수식 검증)",
    hanja: "Mozilla PDF.js 공식 레퍼런스 문서",
    url: "pdfjs-test/web/compressed.tracemonkey-pldi-09.pdf",
    version: "v1.0.0"
  }
};

const ERRATA_LIST = [
  {
    id: "ER-2026-01",
    vol: "제1권 경전편",
    pageLabel: "쪽수 3 (PDF 5p)",
    before: "오취온(五取蘊)이 모두 고(苦)이니라 (초판 v1.0.0 오탈자: 오취온 → 오온)",
    after: "요약하건대 오취온(五取蘊)이 모두 괴로움이니라 (v1.0.1 정오표 반영 완료)",
    date: "2026-10-18",
    targetVol: "vol1",
    targetPage: 5
  },
  {
    id: "ER-2026-02",
    vol: "제1권 경전편",
    pageLabel: "쪽수 5 (PDF 7p)",
    before: "마음에 걸림이 없고(心無碍)",
    after: "마음에 걸림이 없고(心無罣礙) — 한자 병기 교정 완료",
    date: "2026-10-19",
    targetVol: "vol1",
    targetPage: 7
  },
  {
    id: "ER-2026-03",
    vol: "제2권 사료편",
    pageLabel: "쪽수 1 (PDF 3p)",
    before: "제1차 만일결사 입재(1992년)",
    after: "1993년 제1차 만일결사 입재 이래 — 연도 표기 정정",
    date: "2026-10-20",
    targetVol: "vol2",
    targetPage: 3
  },
  {
    id: "ER-2026-04",
    vol: "제3권 법문편",
    pageLabel: "쪽수 5 (PDF 7p)",
    before: "오체투지(五體投地) 예경법",
    after: "이마와 두 팔꿈치, 두 무릎이 바닥에 닿는 오체투지(五體投地) — 동작 주석 보강",
    date: "2026-10-21",
    targetVol: "vol3",
    targetPage: 7
  },
  {
    id: "ER-2026-05",
    vol: "제4권 해설·색인편",
    pageLabel: "쪽수 7 (PDF 9p)",
    before: "전자책 열람 후 7일 이내 단순변심 환불 가능",
    after: "최초 1회 이상 열람 개시(ReadingStart) 이후에는 단순 변심에 의한 청약철회 제한",
    date: "2026-10-22",
    targetVol: "vol4",
    targetPage: 9
  }
];

function getDefaultState() {
  return {
    currentView: "viewer", // 'store' | 'library' | 'viewer' | 'ops'
    member: {
      memberId: "M-2026-08912",
      dharmaName: "법경(法鏡)",
      realName: "김정토",
      branch: "서울제주지부 서초지회",
      grade: "정회원 (결사행자)",
      phone: "010-7788-1080",
      watermarkCode: "JT-7K4M",
      sessionIp: "211.45.108.24"
    },
    order: {
      orderId: "ORD-20261023-00108",
      editionType: "EBOOK_ONLY_SET", // 100% 전자책(eBook) 단독 발행 세트
      amount: 200000,
      payMethod: "VBANK", // 가상계좌(송금) 단일 결제
      vbankInfo: {
        bankName: "국민은행 (1회용 안심 가상계좌)",
        accountNo: "843290-01-991082",
        holder: "(재)정토회_김정토",
        depositorName: "김정토",
        expireAt: "2026-10-26 23:59:59"
      },
      refundAccount: {
        bankName: "국민은행",
        accountNo: "110-482-990182",
        holder: "김정토"
      },
      cashReceiptPhone: "010-7788-1080",
      status: "PAID_VERIFIED", // 'NONE' | 'PAYMENT_PENDING' | 'PAID_VERIFIED' | 'REFUNDED_CONFIRMED'
      paidAt: "2026-10-23 09:15:02",
      consents: {
        noRefundAfterOpen: true,
        drmAndWatermark: true,
        singleAccountLimit: true
      }
    },
    entitlement: {
      entitlementId: "ENT-2026-7K4M",
      status: "ACTIVE", // 'NONE' | 'PAYMENT_PENDING' | 'ACTIVE' | 'HOLD' | 'REVOKED'
      readingStarted: true,
      readingStartedAt: "2026-10-23 09:20:45",
      readingStartVol: "정토대전 제1권 경전편",
      activeDeviceCount: 2,
      maxDevices: 3,
      signedUrlTtlSec: 295
    },
    registeredDevices: [
      {
        deviceId: "DEV-2026-MAC01",
        deviceName: "MacBook Pro 16 (macOS · Chrome 130)",
        fpHash: "8f92a1c4e7b03d19a4f2c8b109d3e5a7f6c1b2d4e8a9c0f1b3d5e7a9c2f4b6d8",
        lastActiveAt: "2026-10-23 14:10",
        isCurrent: true
      },
      {
        deviceId: "DEV-2026-IPAD02",
        deviceName: "iPad Air 5 (iPadOS 17 · Mobile Safari)",
        fpHash: "3c41f9b8d2e6a07c5b91e4f8a2d6c0b7e3f1a9d5c2b8e4f0a6d2c8b4e0f6a2d4",
        lastActiveAt: "2026-10-23 11:05",
        isCurrent: false
      }
    ],
    progress: {
      vol1: { page: 3, total: 10, pageLabel: "1", scale: 1.35, updatedAt: "2026-10-23 14:10" },
      vol2: { page: 1, total: 10, pageLabel: "i", scale: 1.35, updatedAt: "미열람" },
      vol3: { page: 1, total: 10, pageLabel: "i", scale: 1.35, updatedAt: "미열람" },
      vol4: { page: 1, total: 10, pageLabel: "i", scale: 1.35, updatedAt: "미열람" }
    },
    bookmarks: [
      {
        id: "BM-101",
        volId: "vol1",
        volTitle: "제1권 경전편",
        page: 3,
        pageLabel: "1",
        type: "MEMO",
        quote: "이것이 있을 때 저것이 있고, 이것이 일어날 때 저것이 일어난다.",
        note: "아침 수행 때 도반과의 갈등을 돌아보며 연기법을 다시 새김.",
        version: "v1.0.1",
        createdAt: "2026-10-23 09:35"
      },
      {
        id: "BM-102",
        volId: "vol1",
        volTitle: "제1권 경전편",
        page: 7,
        pageLabel: "5",
        type: "BOOKMARK",
        quote: "마음에 걸림이 없고(心無罣礙) 두려움이 없어서",
        note: "반야심경 핵심 구절 책갈피",
        version: "v1.0.1",
        createdAt: "2026-10-23 10:02"
      }
    ],
    eventInbox: [
      {
        eventId: "PG_VBANK_20261023_0001",
        eventType: "VBANK_DEPOSIT_CONFIRMED (가상계좌 송금완료)",
        orderId: "ORD-20261023-00108",
        idempotencyResult: "PROCESSED (최초 입금 정상 반영)",
        processedAt: "2026-10-23 09:15:02"
      }
    ],
    auditLogs: [
      {
        auditId: "AUD-9001",
        actor: "SYSTEM (PG 가상계좌 웹훅)",
        action: "GRANT_ENTITLEMENT",
        target: "김정토 (법경 / JT-7K4M)",
        reason: "가상계좌(송금) 200,000원 입금 완료(PAID_VERIFIED)에 따른 전자책 전 4권 열람권 자동 부여",
        timestamp: "2026-10-23 09:15:03"
      },
      {
        auditId: "AUD-9002",
        actor: "MEMBER (김정토)",
        action: "RECORD_READING_START",
        target: "정토대전 제1권 경전편 (p.1)",
        reason: "최초 본문 열람 개시 동의 및 전자상거래법 청약철회 제한 시점 확정",
        timestamp: "2026-10-23 09:20:45"
      }
    ],
    viewerPrefs: {
      activeVolId: "vol1",
      spreadMode: "single",
      theme: "paper",
      sidebarOpen: true,
      sidebarTab: "toc",
      watermarkVisible: true,
      watermarkOpacity: 0.14,
      blurProtectEnabled: true,
      simulateInAppBrowser: false
    }
  };
}

let appState = loadState();
let pdfDoc = null;
let pageLabels = [];
let currentOutline = [];
let currentScale = 1.35;
let currentPage = 3;
let isRendering = false;
let pendingPage = null;
let lastSearchQuery = "";
let searchResults = [];
let pendingOpenVolId = null;
let localBlobUrl = null;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    const parsed = JSON.parse(raw);
    return Object.assign(getDefaultState(), parsed);
  } catch (e) {
    return getDefaultState();
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  } catch (e) {
    console.warn("State save warning:", e);
  }
}

function resetAllState() {
  localStorage.removeItem(STORAGE_KEY);
  appState = getDefaultState();
  saveState();
  showToast("초기 검수 상태(전자책 전용 + 가상계좌 송금 완료 상태)로 모든 데이터가 리셋되었습니다.");
  renderAllViews();
  loadVolumeInViewer(appState.viewerPrefs.activeVolId, true);
}

function formatNow() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function showToast(msg, type = "info") {
  const el = document.getElementById("globalToast");
  if (!el) return;
  el.textContent = msg;
  el.className = `fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] px-5 py-3 rounded-lg shadow-xl text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
    type === "error"
      ? "bg-[#d9534f] text-white border border-red-300"
      : type === "warn"
      ? "bg-[#ee8545] text-white border border-[#fde7da]"
      : "bg-[#36858c] text-white border border-[#519ea6]"
  }`;
  el.style.opacity = "1";
  el.style.pointerEvents = "auto";
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => {
    el.style.opacity = "0";
    el.style.pointerEvents = "none";
  }, 3200);
}

/* ==========================================================================
   VIEW NAVIGATION & TOP STATUS BAR (jungto.org GNB Active Style)
   ========================================================================== */
function switchView(viewName) {
  appState.currentView = viewName;
  saveState();
  ["store", "library", "viewer", "ops"].forEach((v) => {
    const sec = document.getElementById(`view-${v}`);
    const btn = document.getElementById(`nav-btn-${v}`);
    if (sec) sec.classList.toggle("hidden", v !== viewName);
    if (btn) {
      if (v === viewName) {
        btn.classList.add("jungto-gnb-active");
      } else {
        btn.classList.remove("jungto-gnb-active");
      }
    }
  });
  renderAllViews();
  if (viewName === "viewer" && !pdfDoc) {
    loadVolumeInViewer(appState.viewerPrefs.activeVolId, true);
  }
}

function renderAllViews() {
  renderTopStatusRibbon();
  renderStoreView();
  renderLibraryView();
  renderOpsView();
  applyViewerThemeAndPrefs();
}

function renderTopStatusRibbon() {
  const entBadge = document.getElementById("headerEntitlementBadge");
  const rsBadge = document.getElementById("headerReadingStartBadge");
  const ttlEl = document.getElementById("headerSignedUrlTtl");
  if (!entBadge) return;

  const st = appState.entitlement.status;
  const map = {
    ACTIVE: { text: "열람권 ACTIVE (정상)", cls: "bg-[#eef7f8] text-[#36858c] border-[#519ea6]" },
    PAYMENT_PENDING: { text: "가상계좌 송금대기", cls: "bg-[#fde7da] text-[#d1743b] border-[#ee8545]" },
    HOLD: { text: "CS 일시정지 (HOLD)", cls: "bg-amber-100 text-amber-800 border-amber-400" },
    REVOKED: { text: "환불/회수됨 (REVOKED)", cls: "bg-red-100 text-red-700 border-red-300" },
    NONE: { text: "미구매 상태", cls: "bg-gray-100 text-gray-600 border-gray-300" }
  };
  const info = map[st] || map.NONE;
  entBadge.className = `px-2.5 py-0.5 rounded-full text-xs font-bold border ${info.cls}`;
  entBadge.textContent = info.text;

  if (appState.entitlement.readingStarted) {
    rsBadge.className = "px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#fde7da] text-[#d1743b] border border-[#ee8545]/50";
    rsBadge.textContent = `열람개시 확정 (${appState.entitlement.readingStartedAt.slice(11, 16)}) · 단순변심 환불제한`;
  } else {
    rsBadge.className = "px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#eef7f8] text-[#36858c] border border-[#519ea6]/50";
    rsBadge.textContent = "미열람 (7일내 청약철회 가능)";
  }

  if (ttlEl) {
    const m = Math.floor(appState.entitlement.signedUrlTtlSec / 60);
    const s = String(appState.entitlement.signedUrlTtlSec % 60).padStart(2, "0");
    ttlEl.textContent = `Signed URL ${m}:${s}`;
  }
}

/* ==========================================================================
   VIEW 1: STOREFRONT & CHECKOUT (전자책 단독 발행 + 가상계좌 송금 단일 결제)
   ========================================================================== */
function renderStoreView() {
  const statusBox = document.getElementById("storeCurrentOrderSummary");
  if (!statusBox) return;

  const ord = appState.order;
  const ent = appState.entitlement;

  let badgeHtml = "";
  if (ord.status === "PAID_VERIFIED") {
    badgeHtml = `<span class="px-3.5 py-1 rounded-full bg-[#eef7f8] text-[#36858c] font-bold text-xs border border-[#519ea6]">가상계좌 송금완료 (PAID_VERIFIED) · eBook 전 4권 부여 확정</span>`;
  } else if (ord.status === "PAYMENT_PENDING") {
    badgeHtml = `<span class="px-3.5 py-1 rounded-full bg-[#fde7da] text-[#d1743b] font-bold text-xs border border-[#ee8545]">가상계좌 송금대기 (PAYMENT_PENDING)</span>`;
  } else if (ord.status === "REFUNDED_CONFIRMED") {
    badgeHtml = `<span class="px-3.5 py-1 rounded-full bg-red-50 text-red-700 font-bold text-xs border border-red-300">환불/취소 완료 (재신청 가능)</span>`;
  } else {
    badgeHtml = `<span class="px-3.5 py-1 rounded-full bg-gray-100 text-gray-700 font-bold text-xs">미신청 (가상계좌 채번 가능)</span>`;
  }

  statusBox.innerHTML = `
    <div class="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-[#ebe5e6]">
      <div>
        <div class="text-xs text-[#6d6d6d] font-medium">현재 로그인 회원 세션 (마이정토 통합인증 연동 · 종이책 미발행 / 100% 전자책 전용)</div>
        <div class="text-base font-bold text-[#333333] mt-0.5">
          ${appState.member.realName} 법우님 (법명: <span class="text-[#f26522]">${appState.member.dharmaName}</span> · ${appState.member.branch})
        </div>
      </div>
      ${badgeHtml}
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3.5 text-xs">
      <div class="bg-[#fbfbfb] p-3.5 rounded-lg border border-[#ebe5e6]">
        <div class="text-[#6d6d6d]">주문번호 / 단일 결제수단</div>
        <div class="font-bold text-[#333333] mt-1">${ord.orderId} (PG 1회용 가상계좌 송금)</div>
        <div class="text-[11px] text-[#6d6d6d] mt-0.5">${ord.vbankInfo.bankName} ${ord.vbankInfo.accountNo}</div>
      </div>
      <div class="bg-[#fbfbfb] p-3.5 rounded-lg border border-[#ebe5e6]">
        <div class="text-[#6d6d6d]">e북 열람권(Entitlement) 상태</div>
        <div class="font-bold text-[#36858c] mt-1">${ent.status} (워터마크 식별코드: ${appState.member.watermarkCode})</div>
        <div class="text-[11px] text-[#6d6d6d] mt-0.5">최대 등록 기기: ${ent.activeDeviceCount} / ${ent.maxDevices}대</div>
      </div>
      <div class="bg-[#fbfbfb] p-3.5 rounded-lg border border-[#ebe5e6]">
        <div class="text-[#6d6d6d]">열람 개시(ReadingStart) 시각</div>
        <div class="font-bold ${ent.readingStarted ? "text-[#d1743b]" : "text-[#36858c]"} mt-1">
          ${ent.readingStarted ? `${ent.readingStartedAt} (${ent.readingStartVol})` : "아직 본문 열람 전 (청약철회 가능)"}
        </div>
        <div class="text-[11px] text-[#6d6d6d] mt-0.5">미열람 환불계좌: ${ord.refundAccount?.bankName || "국민은행"} ${ord.refundAccount?.accountNo || "110-482-990182"}</div>
      </div>
    </div>
    ${
      ord.status === "PAYMENT_PENDING"
        ? `<div class="mt-3.5 p-4 rounded-lg bg-[#fde7da]/70 border-2 border-[#ee8545] text-xs text-[#333333] flex flex-wrap items-center justify-between gap-3">
            <div>
              <div class="font-extrabold text-sm text-[#d1743b]">🏦 [1회용 전용 가상계좌 채번 완료 · 송금 대기 중]</div>
              <div class="mt-1">
                입금은행: <strong>${ord.vbankInfo.bankName}</strong> |
                계좌번호: <span class="font-mono font-extrabold text-sm text-[#f26522] underline">${ord.vbankInfo.accountNo}</span> |
                입금액: <strong>200,000원</strong>
              </div>
              <div class="text-[11px] text-[#6d6d6d] mt-0.5">
                예금주: ${ord.vbankInfo.holder} · 입금자명: ${ord.vbankInfo.depositorName || appState.member.realName} · 입금기한: ${ord.vbankInfo.expireAt}
              </div>
            </div>
            <button onclick="simulatePgWebhook('PAID_VERIFIED')" class="px-4 py-2.5 rounded bg-[#f26522] hover:bg-[#d1743b] text-white font-extrabold shadow transition">
              ⚡ 은행 200,000원 송금 완료(PG 웹훅) 즉시 시뮬레이션
            </button>
          </div>`
        : ""
    }
  `;
}

function submitPurchaseOrder() {
  const c1 = document.getElementById("chkConsentRefund")?.checked;
  const c2 = document.getElementById("chkConsentDrm")?.checked;
  const c3 = document.getElementById("chkConsentSingle")?.checked;

  if (!c1 || !c2 || !c3) {
    showToast("전자상거래법 청약철회 제한 및 저작권 보호 필수 고지 3개 항목에 모두 동의해 주세요.", "error");
    return;
  }

  const selectedBank = document.getElementById("selectVbankName")?.value || "국민은행";
  const depositorName = document.getElementById("inputDepositorName")?.value?.trim() || appState.member.realName;
  const cashReceiptPhone = document.getElementById("inputCashReceiptPhone")?.value?.trim() || appState.member.phone;
  const refundBank = document.getElementById("selectRefundBank")?.value || "국민은행";
  const refundAccountNo = document.getElementById("inputRefundAccount")?.value?.trim() || "110-482-990182";

  const randomAcct = `${Math.floor(100000 + Math.random() * 899999)}-01-${Math.floor(100000 + Math.random() * 899999)}`;

  appState.order.payMethod = "VBANK";
  appState.order.orderId = "ORD-20261023-" + String(Math.floor(10000 + Math.random() * 89999));
  appState.order.vbankInfo = {
    bankName: `${selectedBank} (1회용 안심 가상계좌)`,
    accountNo: randomAcct,
    holder: `(재)정토회_${appState.member.realName}`,
    depositorName,
    expireAt: "2026-10-26 23:59:59"
  };
  appState.order.refundAccount = {
    bankName: refundBank,
    accountNo: refundAccountNo,
    holder: appState.member.realName
  };
  appState.order.cashReceiptPhone = cashReceiptPhone;

  // 가상계좌 채번 -> 입금 대기 (PAYMENT_PENDING)
  appState.order.status = "PAYMENT_PENDING";
  appState.entitlement.status = "PAYMENT_PENDING";
  appState.entitlement.readingStarted = false;
  appState.entitlement.readingStartedAt = "";

  appState.eventInbox.unshift({
    eventId: "PG_VBANK_ISSUED_" + Date.now(),
    eventType: `VBANK_ISSUED (${selectedBank} 가상계좌 채번)`,
    orderId: appState.order.orderId,
    idempotencyResult: "WAITING_DEPOSIT (송금 입금 전 열람 잠금)",
    processedAt: formatNow()
  });
  appState.auditLogs.unshift({
    auditId: "AUD-" + Math.floor(1000 + Math.random() * 9000),
    actor: "MEMBER (" + appState.member.realName + ")",
    action: "ORDER_VBANK_ISSUED",
    target: `${appState.order.orderId} (${selectedBank} ${randomAcct})`,
    reason: "1회용 가상계좌(송금) 채번 완료 · 송금 완료 웹훅 수신 전까지 e북 열람 잠금(PAYMENT_PENDING)",
    timestamp: formatNow()
  });

  saveState();
  renderAllViews();
  showToast(`${selectedBank} 1회용 가상계좌(${randomAcct})가 채번되었습니다! 송금 완료 전까지 내 서재 열람이 잠금 처리됩니다.`, "warn");
  switchView("library");
}

/* ==========================================================================
   VIEW 2: MY LIBRARY (내 서재 - 전 4권 세트 & ReadingStart 게이트 & 정오표)
   ========================================================================== */
function renderLibraryView() {
  const grid = document.getElementById("libraryVolumeGrid");
  const banner = document.getElementById("libraryEntitlementBanner");
  if (!grid || !banner) return;

  const ent = appState.entitlement;
  const ord = appState.order;

  if (ent.status === "ACTIVE") {
    banner.innerHTML = `
      <div class="p-5 rounded-xl bg-white border-2 border-[#519ea6] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2.5">
            <span class="px-3 py-0.5 rounded-full bg-[#519ea6] text-white text-xs font-bold">ACTIVE · 열람 가능</span>
            <span class="text-base font-bold text-[#333333]">『정토대전』 전 4권 디지털 전자책(eBook) 라이선스 (${appState.member.realName} / ${appState.member.dharmaName})</span>
          </div>
          <p class="text-xs text-[#6d6d6d] mt-1.5">
            워터마크 식별코드: <strong class="font-mono text-[#f26522]">${appState.member.watermarkCode}</strong> ·
            열람 개시(ReadingStart) 상태:
            <strong class="text-[#333333]">${ent.readingStarted ? `확정됨 (${ent.readingStartedAt} / ${ent.readingStartVol})` : "미열람 (최초 열람 시 청약철회 동의 모달 작동)"}</strong>
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="openErrataModal()" class="px-4 py-2.5 rounded bg-[#fbfbfb] hover:bg-[#f6f6f6] text-[#36858c] border border-[#519ea6] text-xs font-bold transition">
            📋 정오표 (v1.0.1) 확인 (${ERRATA_LIST.length}건)
          </button>
          <button onclick="openRefundCheckModal()" class="px-4 py-2.5 rounded bg-[#fde7da] hover:bg-[#fbd5be] text-[#d1743b] border border-[#ee8545] text-xs font-bold transition">
            ⚖️ 청약철회(환불) 가능여부 검증
          </button>
        </div>
      </div>
    `;
  } else {
    banner.innerHTML = `
      <div class="p-5 rounded-xl bg-[#fde7da]/50 border-2 border-[#ee8545] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2.5">
            <span class="px-3 py-0.5 rounded-full bg-[#ee8545] text-white text-xs font-bold">${ent.status} · 열람 제한됨</span>
            <span class="text-base font-bold text-[#333333]">현재 전자책 본문 열람 권한이 비활성화 상태입니다.</span>
          </div>
          <p class="text-xs text-[#6d6d6d] mt-1.5">
            ${
              ent.status === "PAYMENT_PENDING"
                ? `채번된 1회용 가상계좌(${ord.vbankInfo.bankName} ${ord.vbankInfo.accountNo} / 200,000원) 송금 입금 대기 중입니다. 우측 버튼으로 송금 완료 웹훅을 즉시 테스트할 수 있습니다.`
                : "환불 완료(REVOKED) 또는 CS 일시정지(HOLD) 상태입니다. 무료 맛보기 샘플만 열람 가능합니다."
            }
          </p>
        </div>
        <div class="flex items-center gap-2">
          ${
            ent.status === "PAYMENT_PENDING"
              ? `<button onclick="simulatePgWebhook('PAID_VERIFIED')" class="px-4 py-2.5 rounded bg-[#f26522] hover:bg-[#d1743b] text-white text-xs font-bold shadow transition">
                  ⚡ 가상계좌 200,000원 송금완료 웹훅 실행 (즉시 잠금해제)
                </button>`
              : `<button onclick="switchView('store')" class="px-4 py-2.5 rounded bg-[#f26522] hover:bg-[#d1743b] text-white text-xs font-bold transition">
                  🏦 스토어에서 가상계좌 다시 신청하기
                </button>`
          }
        </div>
      </div>
    `;
  }

  grid.innerHTML = VOLUME_CATALOG.map((vol) => {
    const prog = appState.progress[vol.id] || { page: 1, total: 10, pageLabel: "i", updatedAt: "미열람" };
    const pct = Math.min(100, Math.round((prog.page / (prog.total || 10)) * 100));
    const isLocked = ent.status !== "ACTIVE";
    const volBookmarks = appState.bookmarks.filter((b) => b.volId === vol.id).length;

    return `
      <div class="bg-white rounded-xl border border-[#ebe5e6] shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between">
        <div>
          <div class="p-4 text-white flex items-center justify-between" style="background:${vol.badgeColor}">
            <div>
              <span class="text-xs font-medium opacity-90">${vol.hanja}</span>
              <h3 class="text-lg font-bold mt-0.5">${vol.title}</h3>
            </div>
            <span class="px-2.5 py-1 rounded bg-black/20 text-xs font-mono font-bold">${vol.version}</span>
          </div>
          <div class="p-5">
            <p class="text-xs text-[#6d6d6d] leading-relaxed">${vol.subtitle}</p>
            <div class="flex flex-wrap gap-1.5 mt-3.5">
              ${vol.keywords
                .map(
                  (kw) =>
                    `<button onclick="openVolumeWithKeyword('${vol.id}', '${kw}')" class="px-2.5 py-1 rounded-full bg-[#f6f6f6] hover:bg-[#fde7da] text-[#6d6d6d] hover:text-[#d1743b] border border-[#e1e1e1] text-[11px] font-bold transition">#${kw}</button>`
                )
                .join("")}
            </div>
            <div class="mt-4 pt-3.5 border-t border-[#ebe5e6]">
              <div class="flex items-center justify-between text-xs text-[#6d6d6d] mb-1.5">
                <span>독서 진도율 (최근 열람: PDF ${prog.page}p / 표준 쪽수 ${prog.pageLabel})</span>
                <span class="font-bold text-[#f26522]">${pct}%</span>
              </div>
              <div class="w-full h-2 bg-[#ebebeb] rounded-full overflow-hidden">
                <div class="h-full bg-[#f26522] rounded-full transition-all" style="width:${pct}%"></div>
              </div>
              <div class="flex items-center justify-between text-[11px] text-[#9a9a9a] mt-2">
                <span>최근 동기화: ${prog.updatedAt}</span>
                <span>내 북마크/메모: <strong class="text-[#333333]">${volBookmarks}건</strong> · 정오표: <strong class="text-[#333333]">${vol.errataCount}건</strong></span>
              </div>
            </div>
          </div>
        </div>
        <div class="p-5 pt-0 flex gap-2">
          ${
            isLocked
              ? `<button onclick="showToast('현재 열람권 상태가 ${ent.status}이므로 본문을 열람할 수 없습니다.', 'error')" class="w-full py-3 rounded bg-[#ebebeb] text-[#9a9a9a] font-bold text-xs cursor-not-allowed">
                  🔒 열람 잠금 (${ent.status})
                </button>`
              : `<button onclick="requestOpenVolume('${vol.id}', ${prog.page})" class="flex-1 py-3 rounded bg-[#ee8545] hover:bg-[#d1743b] text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5">
                  📖 이어읽기 (PDF ${prog.page}p / 쪽수 ${prog.pageLabel})
                </button>
                <button onclick="requestOpenVolume('${vol.id}', 1)" class="px-3.5 py-3 rounded bg-[#f6f6f6] hover:bg-[#ebebeb] text-[#333333] font-bold text-xs border border-[#d6d6d6] transition">
                  처음부터
                </button>`
          }
        </div>
      </div>
    `;
  }).join("");

  renderDeviceGuardPanel();
}

function getActiveDevices() {
  if (!Array.isArray(appState.registeredDevices)) {
    appState.registeredDevices = getDefaultState().registeredDevices;
  }
  return appState.registeredDevices;
}

function renderDeviceGuardPanel() {
  const panel = document.getElementById("libraryDeviceGuardPanel");
  if (!panel) return;
  const devices = getActiveDevices();
  const maxDevices = appState.entitlement.maxDevices || 3;
  appState.entitlement.activeDeviceCount = devices.length;

  panel.innerHTML = `
    <div class="bg-white rounded-xl p-5 border border-[#ebe5e6] shadow-sm space-y-3">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full ${devices.length >= maxDevices ? "bg-[#fde7da] text-[#f26522]" : "bg-[#eef7f8] text-[#36858c]"} text-xs font-extrabold">
              ebook_registered_devices · ${devices.length} / ${maxDevices}대 등록됨
            </span>
            <h3 class="text-sm font-extrabold text-[#333333]">🔐 기기 핑거프린트 가드 (SHA-256 Device Slot Control)</h3>
          </div>
          <p class="text-xs text-[#6d6d6d] mt-1">
            계정 공유 방지를 위해 회원당 최대 3대 기기까지만 동시 등록됩니다. 4번째 기기 접속 시 <code>HTTP 403 DEVICE_LIMIT_EXCEEDED</code>가 발생하며 기존 기기를 원격 해제한 뒤 열람할 수 있습니다.
          </p>
        </div>
        <div class="flex items-center gap-2">
          ${
            devices.length < maxDevices
              ? `<button onclick="addThirdDeviceSim()" class="px-3.5 py-2 rounded bg-[#519ea6] hover:bg-[#36858c] text-white text-xs font-bold transition">
                  + 3번째 기기(Galaxy S24) 등록 시뮬레이션
                </button>`
              : ""
          }
          <button onclick="simulateFourthDeviceBlock()" class="px-3.5 py-2 rounded bg-[#ee8545] hover:bg-[#d1743b] text-white text-xs font-bold shadow-sm transition">
            🚨 4번째 미등록 기기 접속 테스트 (HTTP 403 차단 모달)
          </button>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
        ${devices
          .map(
            (d, idx) => `
          <div class="p-3.5 rounded-lg bg-[#fbfbfb] border border-[#ebe5e6] flex flex-col justify-between gap-2">
            <div>
              <div class="flex items-center justify-between">
                <span class="text-xs font-extrabold text-[#333333]">슬롯 #${idx + 1} · ${d.deviceName}</span>
                ${
                  d.isCurrent
                    ? `<span class="px-2 py-0.5 rounded bg-[#519ea6] text-white text-[10px] font-bold">현재 기기</span>`
                    : `<span class="px-2 py-0.5 rounded bg-[#ebebeb] text-[#6d6d6d] text-[10px] font-bold">활성</span>`
                }
              </div>
              <div class="text-[11px] font-mono text-[#6d6d6d] mt-1.5 truncate" title="SHA-256: ${d.fpHash}">
                FP(SHA-256): ${d.fpHash.slice(0, 20)}...
              </div>
              <div class="text-[11px] text-[#9a9a9a] mt-0.5">최근 열람: ${d.lastActiveAt}</div>
            </div>
            <button onclick="unbindDeviceSlot('${d.deviceId}')" class="w-full py-1.5 rounded bg-white hover:bg-[#fde7da] text-[#d1743b] border border-[#ee8545] text-[11px] font-bold transition">
              원격 슬롯 해제 (Unbind)
            </button>
          </div>`
          )
          .join("")}
      </div>
    </div>
  `;
}

function addThirdDeviceSim() {
  const devices = getActiveDevices();
  if (devices.length >= 3) {
    showToast("이미 최대 3대 기기 슬롯이 모두 사용 중입니다.", "warn");
    return;
  }
  const newDev = {
    deviceId: "DEV-2026-GAL03",
    deviceName: "Galaxy S24 Ultra (Android 15 · Chrome Mobile)",
    fpHash: "9a14e7c2b8d0f6a3e5c1b9d7f2a4c8e0b6d1f3a5c7e9b2d4f6a8c0e2b4d6f8a0",
    lastActiveAt: formatNow().slice(0, 16),
    isCurrent: false
  };
  devices.push(newDev);
  appState.entitlement.activeDeviceCount = devices.length;
  appState.auditLogs.unshift({
    auditId: "AUD-" + Math.floor(1000 + Math.random() * 9000),
    actor: `MEMBER (${appState.member.realName})`,
    action: "REGISTER_DEVICE_SLOT",
    target: `${newDev.deviceName} (${devices.length}/3대)`,
    reason: `신규 기기 핑거프린트(SHA-256: ${newDev.fpHash.slice(0, 12)}...) 슬롯 등록 완료`,
    timestamp: formatNow()
  });
  saveState();
  renderAllViews();
  showToast(`3번째 기기(${newDev.deviceName})가 슬롯에 등록되었습니다 (현재 3/3대 포화).`);
}

function unbindDeviceSlot(deviceId) {
  const devices = getActiveDevices();
  if (devices.length <= 1) {
    showToast("최소 1대의 현재 접속 기기는 유지되어야 합니다.", "warn");
    return;
  }
  const target = devices.find((d) => d.deviceId === deviceId);
  appState.registeredDevices = devices.filter((d) => d.deviceId !== deviceId);
  appState.entitlement.activeDeviceCount = appState.registeredDevices.length;
  appState.auditLogs.unshift({
    auditId: "AUD-" + Math.floor(1000 + Math.random() * 9000),
    actor: `MEMBER (${appState.member.realName})`,
    action: "UNBIND_DEVICE_SLOT",
    target: target ? target.deviceName : deviceId,
    reason: "회원 요청에 의한 등록 기기 원격 해제 및 Redis 뷰어 세션(sess:viewer) 즉시 폐기",
    timestamp: formatNow()
  });
  saveState();
  renderAllViews();
  showToast(`기기(${target?.deviceName || deviceId}) 슬롯이 원격 해제되어 가용 슬롯이 확보되었습니다.`);
}

function simulateFourthDeviceBlock() {
  const devices = getActiveDevices();
  while (devices.length < 3) {
    devices.push({
      deviceId: "DEV-2026-GAL0" + (devices.length + 1),
      deviceName: "Galaxy S24 Ultra (Android 15 · Chrome Mobile)",
      fpHash: "9a14e7c2b8d0f6a3e5c1b9d7f2a4c8e0b6d1f3a5c7e9b2d4f6a8c0e2b4d6f8a0",
      lastActiveAt: formatNow().slice(0, 16),
      isCurrent: false
    });
  }
  appState.entitlement.activeDeviceCount = devices.length;
  saveState();
  renderAllViews();

  const modal = document.getElementById("modalDeviceLimit");
  const body = document.getElementById("deviceLimitModalBody");
  if (!modal || !body) return;

  body.innerHTML = `
    <div class="space-y-3 text-xs">
      <div class="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-900 leading-relaxed">
        <strong>[차단 사유]</strong> 4번째 신규 기기(<strong>Windows 11 Desktop · Edge 130</strong> / FP: <code>f4e8c2a6b0d9...</code>)에서 열람 세션 발급을 요청하였으나,
        PostgreSQL <code>trg_enforce_max_3_devices</code> 제약 조건(최대 3대)에 의해 <strong>HTTP 403 DEVICE_LIMIT_EXCEEDED</strong>로 차단되었습니다.
      </div>
      <div class="font-bold text-[#333333]">현재 등록된 3대 기기 중 1대를 원격 해제하면 즉시 현재 기기로 전환하여 열람할 수 있습니다:</div>
      <div class="space-y-2">
        ${devices
          .map(
            (d, i) => `
          <div class="p-3 rounded-lg bg-[#fbfbfb] border border-[#ebe5e6] flex items-center justify-between gap-2">
            <div>
              <div class="font-bold text-[#333333]">슬롯 #${i + 1} · ${d.deviceName}</div>
              <div class="font-mono text-[11px] text-[#6d6d6d]">SHA-256: ${d.fpHash.slice(0, 28)}... | 최근열람: ${d.lastActiveAt}</div>
            </div>
            <button onclick="unbindAndReplaceWithFourthDevice('${d.deviceId}')"
              class="px-3 py-2 rounded bg-[#ee8545] hover:bg-[#d1743b] text-white font-bold text-xs shrink-0 transition">
              이 기기 해제 후 즉시 열람
            </button>
          </div>`
          )
          .join("")}
      </div>
    </div>
  `;
  modal.classList.remove("hidden");
}

function unbindAndReplaceWithFourthDevice(unbindId) {
  const devices = getActiveDevices();
  const removed = devices.find((d) => d.deviceId === unbindId);
  appState.registeredDevices = devices
    .filter((d) => d.deviceId !== unbindId)
    .map((d) => ({ ...d, isCurrent: false }));
  const fourthDev = {
    deviceId: "DEV-2026-WIN04",
    deviceName: "Windows 11 Desktop (Edge 130 · 신규 교체 기기)",
    fpHash: "f4e8c2a6b0d9e1f3a5c7b9d2e4f6a8c0b2d4e6f8a0c2e4b6d8f0a2c4e6b8d0f2",
    lastActiveAt: formatNow().slice(0, 16),
    isCurrent: true
  };
  appState.registeredDevices.push(fourthDev);
  appState.entitlement.activeDeviceCount = appState.registeredDevices.length;

  appState.auditLogs.unshift({
    auditId: "AUD-" + Math.floor(1000 + Math.random() * 9000),
    actor: `MEMBER (${appState.member.realName})`,
    action: "SWAP_DEVICE_SLOT_4TH",
    target: `${removed?.deviceName || unbindId} -> ${fourthDev.deviceName}`,
    reason: "4번째 기기 접속 차단(HTTP 403) 모달에서 기존 기기 원격 해제 후 신규 기기 슬롯 교체 완료",
    timestamp: formatNow()
  });

  document.getElementById("modalDeviceLimit")?.classList.add("hidden");
  saveState();
  renderAllViews();
  showToast(`기존 기기(${removed?.deviceName || unbindId})를 해제하고 신규 기기로 뷰어 세션을 발급했습니다!`);
  switchView("viewer");
}

function requestOpenVolume(volId, startPage = null) {
  if (volId !== "preview" && appState.entitlement.status !== "ACTIVE") {
    showToast(`열람 권한이 없습니다 (현재 상태: ${appState.entitlement.status}). 무료 맛보기 샘플만 열람 가능합니다.`, "error");
    return;
  }

  if (volId !== "preview" && !appState.entitlement.readingStarted) {
    pendingOpenVolId = { volId, startPage };
    const modal = document.getElementById("modalReadingStart");
    if (modal) modal.classList.remove("hidden");
    return;
  }

  if (startPage !== null && appState.progress[volId]) {
    appState.progress[volId].page = startPage;
  }
  appState.viewerPrefs.activeVolId = volId;
  saveState();
  switchView("viewer");
  loadVolumeInViewer(volId, true);
}

function confirmReadingStartConsent() {
  const chk = document.getElementById("chkReadingStartModalConsent");
  if (chk && !chk.checked) {
    showToast("최초 열람 개시(ReadingStart)에 따른 청약철회 제한 고지에 체크해 주세요.", "error");
    return;
  }
  const volObj = VOLUME_CATALOG.find((v) => v.id === (pendingOpenVolId?.volId || "vol1")) || VOLUME_CATALOG[0];
  appState.entitlement.readingStarted = true;
  appState.entitlement.readingStartedAt = formatNow();
  appState.entitlement.readingStartVol = volObj.title;

  appState.auditLogs.unshift({
    auditId: "AUD-" + Math.floor(1000 + Math.random() * 9000),
    actor: `MEMBER (${appState.member.realName})`,
    action: "RECORD_READING_START",
    target: `${volObj.title}`,
    reason: "최초 전자책 열람 개시 동의 완료 (전자상거래법 제17조 제2항에 의거 단순 변심 환불 제한 시점 확정)",
    timestamp: formatNow()
  });

  document.getElementById("modalReadingStart")?.classList.add("hidden");
  saveState();
  renderAllViews();
  showToast("최초 열람 개시(ReadingStart) 시각이 서버 감사 로그에 기록되었습니다.");

  const target = pendingOpenVolId || { volId: "vol1", startPage: 1 };
  pendingOpenVolId = null;
  requestOpenVolume(target.volId, target.startPage);
}

function openVolumeWithKeyword(volId, keyword) {
  if (appState.entitlement.status !== "ACTIVE") {
    showToast("가상계좌 송금 완료(ACTIVE) 상태에서 본문 키워드 점프가 가능합니다.", "warn");
    return;
  }
  appState.viewerPrefs.activeVolId = volId;
  appState.viewerPrefs.sidebarOpen = true;
  appState.viewerPrefs.sidebarTab = "search";
  saveState();
  switchView("viewer");
  loadVolumeInViewer(volId, true).then(() => {
    const searchInput = document.getElementById("viewerSearchInput");
    if (searchInput) {
      searchInput.value = keyword;
      executeInBookSearch(keyword);
    }
  });
}

/* ==========================================================================
   VIEW 3: PRODUCTION PDF.JS CUSTOM WEB VIEWER
   ========================================================================== */
function getVolumeDescriptor(volId) {
  return VOLUME_CATALOG.find((v) => v.id === volId) || EXTRA_PDFS[volId] || VOLUME_CATALOG[0];
}

async function loadVolumeInViewer(volId, restorePage = true) {
  if (volId !== "preview" && appState.entitlement.status !== "ACTIVE") {
    showToast("열람권이 비활성 상태이므로 무료 맛보기 샘플(preview)로 전환합니다.", "warn");
    volId = "preview";
  }

  appState.viewerPrefs.activeVolId = volId;
  saveState();

  const vol = getVolumeDescriptor(volId);
  const sel = document.getElementById("viewerVolumeSelector");
  if (sel && sel.value !== volId) sel.value = volId;

  const loadingOverlay = document.getElementById("viewerLoadingOverlay");
  if (loadingOverlay) loadingOverlay.classList.remove("hidden");

  try {
    const loadingTask = pdfjsLib.getDocument({
      url: localBlobUrl && volId === "local" ? localBlobUrl : vol.url,
      cMapUrl: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/",
      cMapPacked: true,
      standardFontDataUrl: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/standard_fonts/"
    });

    pdfDoc = await loadingTask.promise;

    try {
      const labels = await pdfDoc.getPageLabels();
      pageLabels = labels && labels.length === pdfDoc.numPages ? labels : [];
    } catch (e) {
      pageLabels = [];
    }

    try {
      currentOutline = (await pdfDoc.getOutline()) || [];
    } catch (e) {
      currentOutline = [];
    }

    const savedProg = appState.progress[volId];
    if (restorePage && savedProg && savedProg.page <= pdfDoc.numPages) {
      currentPage = savedProg.page;
      currentScale = savedProg.scale || 1.35;
    } else {
      currentPage = 1;
    }

    if (appState.progress[volId]) {
      appState.progress[volId].total = pdfDoc.numPages;
    }

    await renderCurrentSpread();
    await renderSidebarContent();

    if (loadingOverlay) loadingOverlay.classList.add("hidden");
  } catch (err) {
    console.error("PDF load error:", err);
    if (loadingOverlay) loadingOverlay.classList.add("hidden");
    showToast(`PDF 로딩 실패: ${err.message}`, "error");
  }
}

function getLogicalPageLabel(pageNum) {
  if (pageLabels && pageLabels[pageNum - 1]) {
    return pageLabels[pageNum - 1];
  }
  return String(pageNum);
}

async function renderCurrentSpread() {
  if (!pdfDoc) return;
  if (isRendering) {
    pendingPage = currentPage;
    return;
  }
  isRendering = true;

  const isDual = appState.viewerPrefs.spreadMode === "dual" && pdfDoc.numPages > 1;
  const secondPageWrapper = document.getElementById("pageContainerRight");

  await renderSinglePageToSlot(currentPage, "pdfCanvasLeft", "textLayerLeft", "pageBadgeLeft");

  if (isDual && currentPage + 1 <= pdfDoc.numPages) {
    if (secondPageWrapper) secondPageWrapper.classList.remove("hidden");
    await renderSinglePageToSlot(currentPage + 1, "pdfCanvasRight", "textLayerRight", "pageBadgeRight");
  } else {
    if (secondPageWrapper) secondPageWrapper.classList.add("hidden");
  }

  updateViewerToolbarStatus();
  updateWatermarkOverlay();
  saveReadingProgress();

  isRendering = false;
  if (pendingPage !== null) {
    const next = pendingPage;
    pendingPage = null;
    currentPage = next;
    renderCurrentSpread();
  }
}

async function renderSinglePageToSlot(pageNum, canvasId, textLayerId, badgeId) {
  const page = await pdfDoc.getPage(pageNum);
  const viewport = page.getViewport({ scale: currentScale });

  const outputScale = window.devicePixelRatio || 1;
  const canvas = document.getElementById(canvasId);
  const textLayerDiv = document.getElementById(textLayerId);
  if (!canvas || !textLayerDiv) return;

  const ctx = canvas.getContext("2d");
  canvas.width = Math.floor(viewport.width * outputScale);
  canvas.height = Math.floor(viewport.height * outputScale);
  canvas.style.width = Math.floor(viewport.width) + "px";
  canvas.style.height = Math.floor(viewport.height) + "px";

  const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;
  await page.render({ canvasContext: ctx, transform, viewport }).promise;

  textLayerDiv.innerHTML = "";
  textLayerDiv.style.width = Math.floor(viewport.width) + "px";
  textLayerDiv.style.height = Math.floor(viewport.height) + "px";
  textLayerDiv.style.setProperty("--scale-factor", viewport.scale);

  const textContent = await page.getTextContent();
  await pdfjsLib.renderTextLayer({
    textContentSource: textContent,
    container: textLayerDiv,
    viewport: viewport,
    textDivs: []
  }).promise;

  if (lastSearchQuery.trim().length > 0) {
    highlightMatchesInTextLayer(textLayerDiv, lastSearchQuery.trim());
  }

  const badge = document.getElementById(badgeId);
  if (badge) {
    const lbl = getLogicalPageLabel(pageNum);
    badge.textContent = `PDF ${pageNum} / ${pdfDoc.numPages}p (표준 쪽수: ${lbl})`;
  }
}

function highlightMatchesInTextLayer(container, keyword) {
  const spans = container.querySelectorAll("span");
  const lowerKw = keyword.toLowerCase();
  spans.forEach((sp) => {
    const txt = sp.textContent || "";
    if (txt.toLowerCase().includes(lowerKw)) {
      sp.style.backgroundColor = "rgba(242, 101, 34, 0.38)";
      sp.style.borderRadius = "3px";
      sp.style.boxShadow = "0 0 0 2px rgba(242, 101, 34, 0.75)";
    }
  });
}

function updateViewerToolbarStatus() {
  if (!pdfDoc) return;
  const pageInput = document.getElementById("viewerPageInput");
  const pageTotal = document.getElementById("viewerPageTotal");
  const labelBadge = document.getElementById("viewerLogicalLabelBadge");
  const zoomLabel = document.getElementById("viewerZoomPercent");
  const dpiBadge = document.getElementById("viewerDpiBadge");

  if (pageInput) pageInput.value = currentPage;
  if (pageTotal) pageTotal.textContent = `/ ${pdfDoc.numPages}`;
  if (labelBadge) {
    const lbl = getLogicalPageLabel(currentPage);
    labelBadge.textContent = `쪽수 ${lbl}`;
  }
  if (zoomLabel) zoomLabel.textContent = `${Math.round(currentScale * 100)}%`;
  if (dpiBadge) {
    const dpr = (window.devicePixelRatio || 1).toFixed(1);
    dpiBadge.textContent = `Retina ${dpr}x`;
  }

  // Update Geumgang DRM Live Telemetry Bar (HTTP 206 64KB Range & iOS 3-Page Sliding Window)
  const elHttp206 = document.getElementById("telemetryHttp206");
  const elWindow = document.getElementById("telemetrySlidingWindow");
  const elSlots = document.getElementById("telemetryDeviceSlots");
  const elHash = document.getElementById("telemetryForensicHash");

  const chunkIdx = Math.max(0, currentPage - 1);
  const startByte = chunkIdx * 65536;
  const totalBytes = 278966;
  const endByte = Math.min(startByte + 65535, totalBytes - 1);
  if (elHttp206) {
    elHttp206.textContent = `HTTP 206 Range: bytes=${startByte}-${endByte}/${totalBytes} (64KB Chunk #${chunkIdx})`;
  }
  if (elWindow) {
    const prevP = Math.max(1, currentPage - 1);
    const nextP = Math.min(pdfDoc.numPages, currentPage + 1);
    const activeWindow = Array.from(new Set([prevP, currentPage, nextP])).map((p) => `p.${p}`).join(", ");
    elWindow.textContent = `3-Page Window: [${activeWindow}] Active · Offscreen Canvas width=0 (iOS OOM 방어)`;
  }
  if (elSlots) {
    const devCount = getActiveDevices().length;
    elSlots.textContent = `기기슬롯: ${devCount}/${appState.entitlement.maxDevices || 3}대 활성`;
  }
  if (elHash) {
    const volId = appState.viewerPrefs.activeVolId || "vol1";
    elHash.textContent = `X-Forensic-WM: JTS-WM-SHA256(${appState.member.watermarkCode}:${volId}:p${currentPage})`;
  }
}

function saveReadingProgress() {
  const volId = appState.viewerPrefs.activeVolId;
  if (!pdfDoc || !appState.progress[volId]) return;
  appState.progress[volId] = {
    page: currentPage,
    total: pdfDoc.numPages,
    pageLabel: getLogicalPageLabel(currentPage),
    scale: currentScale,
    updatedAt: formatNow().slice(5, 16)
  };
  saveState();
}

function changePage(delta) {
  if (!pdfDoc) return;
  const step = appState.viewerPrefs.spreadMode === "dual" ? delta * 2 : delta;
  const target = Math.max(1, Math.min(pdfDoc.numPages, currentPage + step));
  if (target === currentPage) return;
  currentPage = target;
  renderCurrentSpread();
  highlightActiveSidebarItem();
}

function jumpToPage(pageNum) {
  if (!pdfDoc) return;
  const target = Math.max(1, Math.min(pdfDoc.numPages, parseInt(pageNum, 10) || 1));
  currentPage = target;
  renderCurrentSpread();
  highlightActiveSidebarItem();
}

function changeZoom(delta) {
  currentScale = Math.min(3.0, Math.max(0.6, +(currentScale + delta).toFixed(2)));
  renderCurrentSpread();
}

async function fitViewerMode(mode) {
  if (!pdfDoc) return;
  const page = await pdfDoc.getPage(currentPage);
  const unscaled = page.getViewport({ scale: 1.0 });
  const scrollArea = document.getElementById("viewerCanvasScrollArea");
  if (!scrollArea) return;

  const isDual = appState.viewerPrefs.spreadMode === "dual";
  const availW = scrollArea.clientWidth - (isDual ? 96 : 64);
  const availH = scrollArea.clientHeight - 72;

  if (mode === "width") {
    const perPageW = isDual ? availW / 2 : availW;
    currentScale = Math.max(0.6, Math.min(2.6, +(perPageW / unscaled.width).toFixed(2)));
  } else {
    currentScale = Math.max(0.6, Math.min(2.4, +(availH / unscaled.height).toFixed(2)));
  }
  renderCurrentSpread();
}

function toggleSpreadMode() {
  appState.viewerPrefs.spreadMode = appState.viewerPrefs.spreadMode === "single" ? "dual" : "single";
  saveState();
  applyViewerThemeAndPrefs();
  renderCurrentSpread();
}

function setViewerTheme(themeName) {
  appState.viewerPrefs.theme = themeName;
  saveState();
  applyViewerThemeAndPrefs();
}

function applyViewerThemeAndPrefs() {
  const scrollArea = document.getElementById("viewerCanvasScrollArea");
  const spreadBtn = document.getElementById("btnToggleSpread");
  const inAppBanner = document.getElementById("inAppBrowserWarningBanner");

  if (scrollArea) {
    scrollArea.classList.remove("theme-paper", "theme-light", "theme-dark");
    scrollArea.classList.add(`theme-${appState.viewerPrefs.theme || "paper"}`);
  }

  ["paper", "light", "dark"].forEach((t) => {
    const b = document.getElementById(`btnTheme-${t}`);
    if (b) {
      b.classList.toggle("ring-2", appState.viewerPrefs.theme === t);
      b.classList.toggle("ring-[#f26522]", appState.viewerPrefs.theme === t);
    }
  });

  if (spreadBtn) {
    spreadBtn.textContent =
      appState.viewerPrefs.spreadMode === "dual" ? "📖 양면 펼쳐보기" : "📄 단면 보기";
  }

  if (inAppBanner) {
    inAppBanner.classList.toggle("hidden", !appState.viewerPrefs.simulateInAppBrowser);
  }

  const sidebar = document.getElementById("viewerSidebar");
  if (sidebar) {
    sidebar.classList.toggle("hidden", !appState.viewerPrefs.sidebarOpen);
  }

  updateWatermarkOverlay();
}

function toggleViewerSidebar() {
  appState.viewerPrefs.sidebarOpen = !appState.viewerPrefs.sidebarOpen;
  saveState();
  applyViewerThemeAndPrefs();
}

function switchSidebarTab(tabName) {
  appState.viewerPrefs.sidebarTab = tabName;
  saveState();
  ["toc", "thumbs", "bookmarks", "search"].forEach((t) => {
    const panel = document.getElementById(`sidebarPanel-${t}`);
    const tabBtn = document.getElementById(`sidebarTabBtn-${t}`);
    if (panel) panel.classList.toggle("hidden", t !== tabName);
    if (tabBtn) {
      if (t === tabName) {
        tabBtn.className = "py-2 rounded bg-[#f26522] text-white font-bold shadow-sm transition";
      } else {
        tabBtn.className = "py-2 rounded text-[#6d6d6d] hover:text-[#333333] hover:bg-[#ebebeb] transition";
      }
    }
  });
  renderSidebarContent();
}

async function renderSidebarContent() {
  if (!pdfDoc) return;
  const tab = appState.viewerPrefs.sidebarTab;
  if (tab === "toc") await renderOutlineList();
  if (tab === "thumbs") await renderThumbnailsList();
  if (tab === "bookmarks") renderBookmarksList();
}

async function renderOutlineList() {
  const container = document.getElementById("sidebarPanel-toc");
  if (!container || !pdfDoc) return;

  if (!currentOutline || currentOutline.length === 0) {
    let html = `<div class="text-xs text-[#9a9a9a] mb-2 px-1">자동 생성된 페이지 색인 (${pdfDoc.numPages}p)</div>`;
    for (let i = 1; i <= pdfDoc.numPages; i++) {
      html += `
        <button onclick="jumpToPage(${i})" class="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-[#f6f6f6] flex items-center justify-between ${
        currentPage === i ? "bg-[#fde7da]/70 text-[#f26522] font-bold" : "text-[#333333]"
      }">
          <span>페이지 ${i}</span>
          <span class="font-mono text-[11px] text-[#6d6d6d]">쪽수 ${getLogicalPageLabel(i)}</span>
        </button>`;
    }
    container.innerHTML = html;
    return;
  }

  let html = `<div class="text-[11px] text-[#6d6d6d] font-bold mb-2 px-1">PDF 내장 계층형 목차 (Outline)</div>`;
  for (const item of currentOutline) {
    let destPage = 1;
    try {
      let dest = item.dest;
      if (typeof dest === "string") dest = await pdfDoc.getDestination(dest);
      if (Array.isArray(dest) && dest[0]) {
        const idx = await pdfDoc.getPageIndex(dest[0]);
        destPage = idx + 1;
      }
    } catch (e) {}

    html += `
      <div class="mb-1">
        <button onclick="jumpToPage(${destPage})" class="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-[#f6f6f6] transition flex items-center justify-between gap-2 ${
      currentPage === destPage ? "bg-[#fde7da] text-[#d1743b] font-bold border border-[#ee8545]/50" : "text-[#333333]"
    }">
          <span class="truncate">${item.title}</span>
          <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#f6f6f6] text-[#6d6d6d] border border-[#e1e1e1] shrink-0">쪽 ${getLogicalPageLabel(destPage)}</span>
        </button>
        ${
          item.items && item.items.length
            ? `<div class="pl-3.5 mt-0.5 space-y-0.5 border-l-2 border-[#ebe5e6] ml-3">
                ${item.items
                  .map(
                    (sub, sIdx) => `
                  <button onclick="jumpToPage(${destPage + sIdx})" class="w-full text-left px-2.5 py-1.5 rounded text-[11px] text-[#6d6d6d] hover:text-[#f26522] hover:bg-[#fbfbfb] block truncate">
                    └ ${sub.title}
                  </button>`
                  )
                  .join("")}
              </div>`
            : ""
        }
      </div>
    `;
  }
  container.innerHTML = html;
}

async function renderThumbnailsList() {
  const container = document.getElementById("sidebarPanel-thumbs");
  if (!container || !pdfDoc) return;

  const maxThumbs = Math.min(pdfDoc.numPages, 24);
  container.innerHTML = `<div class="text-[11px] text-[#6d6d6d] font-bold mb-2 px-1">페이지 미니맵 (1 ~ ${maxThumbs}p)</div><div id="thumbGridInner" class="grid grid-cols-2 gap-2.5"></div>`;
  const grid = document.getElementById("thumbGridInner");
  if (!grid) return;

  for (let i = 1; i <= maxThumbs; i++) {
    const card = document.createElement("div");
    card.className = `cursor-pointer rounded-lg p-1.5 border transition text-center ${
      currentPage === i
        ? "border-[#f26522] bg-[#fde7da]/40 ring-1 ring-[#f26522]"
        : "border-[#e1e1e1] bg-[#fbfbfb] hover:border-[#519ea6]"
    }`;
    card.onclick = () => jumpToPage(i);

    const cnv = document.createElement("canvas");
    cnv.className = "mx-auto rounded shadow-sm bg-white max-w-full h-auto";
    const lbl = document.createElement("div");
    lbl.className = "text-[10px] text-[#333333] mt-1 font-mono font-semibold";
    lbl.textContent = `${i}p (쪽 ${getLogicalPageLabel(i)})`;

    card.appendChild(cnv);
    card.appendChild(lbl);
    grid.appendChild(card);

    pdfDoc.getPage(i).then((page) => {
      const vp = page.getViewport({ scale: 0.24 });
      cnv.width = vp.width;
      cnv.height = vp.height;
      page.render({ canvasContext: cnv.getContext("2d"), viewport: vp });
    });
  }
}

function renderBookmarksList() {
  const container = document.getElementById("sidebarPanel-bookmarks");
  if (!container) return;

  const activeVol = getVolumeDescriptor(appState.viewerPrefs.activeVolId);
  const items = appState.bookmarks.filter((b) => b.volId === appState.viewerPrefs.activeVolId);

  container.innerHTML = `
    <div class="p-3 rounded-xl bg-[#fbfbfb] border border-[#ebe5e6] mb-3">
      <div class="text-xs font-bold text-[#36858c] mb-1.5">📌 현재 페이지(${currentPage}p / 쪽 ${getLogicalPageLabel(currentPage)}) 기록 추가</div>
      <textarea id="newBookmarkNote" rows="2" placeholder="마음에 와닿은 경전 구절이나 수행 메모를 남겨보세요..." class="w-full rounded border border-[#d6d6d6] bg-white p-2 text-xs text-[#333333] focus:outline-none focus:border-[#519ea6]"></textarea>
      <div class="flex gap-1.5 mt-2">
        <button onclick="addBookmarkOrMemo('BOOKMARK')" class="flex-1 py-1.5 rounded bg-[#519ea6] hover:bg-[#36858c] text-white text-xs font-bold transition">
          🔖 빠른 북마크
        </button>
        <button onclick="addBookmarkOrMemo('MEMO')" class="flex-1 py-1.5 rounded bg-[#ee8545] hover:bg-[#d1743b] text-white text-xs font-bold transition">
          ✍️ 메모 저장
        </button>
      </div>
    </div>
    <div class="text-[11px] text-[#6d6d6d] font-bold mb-2 px-1">${activeVol.volNum} 저장된 북마크·메모 (${items.length}건)</div>
    <div class="space-y-2">
      ${
        items.length === 0
          ? `<div class="text-xs text-[#9a9a9a] text-center py-6">저장된 북마크나 메모가 없습니다.</div>`
          : items
              .map(
                (bm) => `
          <div class="p-3 rounded-xl bg-[#fbfbfb] border border-[#ebe5e6] hover:border-[#519ea6] transition">
            <div class="flex items-center justify-between">
              <button onclick="jumpToPage(${bm.page})" class="text-xs font-bold text-[#f26522] hover:underline">
                ${bm.type === "MEMO" ? "✍️ 수행메모" : "🔖 책갈피"} · PDF ${bm.page}p (쪽수 ${bm.pageLabel})
              </button>
              <button onclick="deleteBookmark('${bm.id}')" class="text-[11px] text-[#9a9a9a] hover:text-red-600">삭제</button>
            </div>
            ${bm.quote ? `<div class="text-[11px] text-[#6d6d6d] italic mt-1 border-l-2 border-[#519ea6] pl-2">"${bm.quote}"</div>` : ""}
            <div class="text-xs text-[#333333] mt-1.5 leading-snug">${bm.note}</div>
            <div class="text-[10px] text-[#9a9a9a] mt-1 font-mono">${bm.createdAt} · 판본 ${bm.version}</div>
          </div>`
              )
              .join("")
      }
    </div>
  `;
}

function addBookmarkOrMemo(type) {
  const noteInput = document.getElementById("newBookmarkNote");
  const noteText = noteInput?.value?.trim() || (type === "BOOKMARK" ? `${currentPage}페이지 책갈피` : "");
  if (type === "MEMO" && !noteText) {
    showToast("메모 내용을 입력해 주세요.", "warn");
    return;
  }
  const selectedText = window.getSelection()?.toString()?.trim().slice(0, 80) || "";
  const vol = getVolumeDescriptor(appState.viewerPrefs.activeVolId);

  appState.bookmarks.unshift({
    id: "BM-" + Date.now(),
    volId: appState.viewerPrefs.activeVolId,
    volTitle: vol.volNum,
    page: currentPage,
    pageLabel: getLogicalPageLabel(currentPage),
    type,
    quote: selectedText,
    note: noteText,
    version: vol.version || "v1.0.1",
    createdAt: formatNow().slice(0, 16)
  });
  if (noteInput) noteInput.value = "";
  saveState();
  renderBookmarksList();
  showToast(`${vol.volNum} ${currentPage}페이지에 ${type === "MEMO" ? "수행 메모" : "북마크"}가 저장되었습니다.`);
}

function deleteBookmark(id) {
  appState.bookmarks = appState.bookmarks.filter((b) => b.id !== id);
  saveState();
  renderBookmarksList();
  showToast("기록이 삭제되었습니다.");
}

function highlightActiveSidebarItem() {
  if (appState.viewerPrefs.sidebarTab === "toc") renderOutlineList();
  if (appState.viewerPrefs.sidebarTab === "thumbs") renderThumbnailsList();
}

/* ==========================================================================
   IN-VOLUME FULL-TEXT SEARCH & HIGHLIGHT
   ========================================================================== */
async function executeInBookSearch(queryOverride = null) {
  if (!pdfDoc) return;
  const input = document.getElementById("viewerSearchInput");
  const query = (queryOverride !== null ? queryOverride : input?.value || "").trim();
  lastSearchQuery = query;

  appState.viewerPrefs.sidebarOpen = true;
  switchSidebarTab("search");

  const resultsBox = document.getElementById("sidebarSearchResults");
  if (!resultsBox) return;

  if (!query) {
    resultsBox.innerHTML = `<div class="text-xs text-[#6d6d6d] py-4 text-center">검색어를 입력하면 현재 권호 전체 페이지를 즉시 탐색합니다.</div>`;
    renderCurrentSpread();
    return;
  }

  resultsBox.innerHTML = `<div class="text-xs text-[#f26522] font-bold py-4 text-center animate-pulse">🔍 '${query}' 본문 전체 탐색 중...</div>`;
  searchResults = [];
  const lowerQ = query.toLowerCase();

  for (let p = 1; p <= pdfDoc.numPages; p++) {
    const page = await pdfDoc.getPage(p);
    const tc = await page.getTextContent();
    const fullStr = tc.items.map((it) => it.str).join(" ");
    const idx = fullStr.toLowerCase().indexOf(lowerQ);
    if (idx !== -1) {
      const start = Math.max(0, idx - 28);
      const end = Math.min(fullStr.length, idx + query.length + 45);
      const snippet = (start > 0 ? "..." : "") + fullStr.slice(start, end) + (end < fullStr.length ? "..." : "");
      searchResults.push({
        page: p,
        pageLabel: getLogicalPageLabel(p),
        snippet
      });
    }
  }

  if (searchResults.length === 0) {
    resultsBox.innerHTML = `<div class="p-4 rounded-xl bg-[#fbfbfb] border border-[#ebe5e6] text-xs text-[#6d6d6d] text-center">'<strong>${query}</strong>'에 대한 본문 일치 결과가 없습니다.</div>`;
    renderCurrentSpread();
    return;
  }

  resultsBox.innerHTML = `
    <div class="text-xs text-[#36858c] font-bold mb-2 px-1">총 ${searchResults.length}개 페이지에서 '${query}' 발견</div>
    <div class="space-y-2">
      ${searchResults
        .map(
          (r) => `
        <button onclick="jumpToPage(${r.page})" class="w-full text-left p-3 rounded-xl bg-[#fbfbfb] hover:bg-[#fde7da]/40 border border-[#ebe5e6] hover:border-[#ee8545] transition block">
          <div class="flex items-center justify-between text-xs font-bold text-[#f26522] mb-1">
            <span>PDF ${r.page}페이지</span>
            <span class="font-mono text-[11px] bg-white border border-[#e1e1e1] text-[#6d6d6d] px-2 py-0.5 rounded">표준 쪽수 ${r.pageLabel}</span>
          </div>
          <div class="text-xs text-[#333333] leading-relaxed">${r.snippet.replace(
            new RegExp(query, "gi"),
            (m) => `<mark class="bg-[#fde7da] text-[#d1743b] font-bold px-1 rounded">${m}</mark>`
          )}</div>
        </button>`
        )
        .join("")}
    </div>
  `;

  currentPage = searchResults[0].page;
  await renderCurrentSpread();
}

/* ==========================================================================
   DYNAMIC WATERMARK & SECURITY CONTROLS
   ========================================================================== */
function updateWatermarkOverlay() {
  const wm = document.getElementById("dynamicWatermarkOverlay");
  if (!wm) return;

  if (!appState.viewerPrefs.watermarkVisible) {
    wm.innerHTML = "";
    return;
  }

  const stamp = `${appState.member.realName}(${appState.member.dharmaName}) · ${appState.member.watermarkCode} · ${formatNow().slice(0, 16)}`;
  const op = appState.viewerPrefs.watermarkOpacity || 0.14;

  let cells = "";
  for (let i = 0; i < 6; i++) {
    cells += `
      <div class="select-none pointer-events-none font-mono text-xs md:text-sm font-bold tracking-wider text-stone-700 text-center whitespace-nowrap"
           style="opacity:${op}; transform: rotate(-24deg);">
        정토대전 eBook · ${stamp}<br/>무단 복제·캡처·유포 금지 (${appState.member.sessionIp})
      </div>
    `;
  }
  wm.innerHTML = cells;
}

function toggleWatermarkVisibility() {
  appState.viewerPrefs.watermarkVisible = !appState.viewerPrefs.watermarkVisible;
  saveState();
  updateWatermarkOverlay();
  showToast(
    appState.viewerPrefs.watermarkVisible
      ? "동적 보안 워터마크(JT-7K4M)가 활성화되었습니다."
      : "검수 비교를 위해 워터마크를 일시 숨김 처리했습니다.",
    "info"
  );
}

function toggleInAppBrowserSim() {
  appState.viewerPrefs.simulateInAppBrowser = !appState.viewerPrefs.simulateInAppBrowser;
  saveState();
  applyViewerThemeAndPrefs();
}

/* ==========================================================================
   VIEW 4: OPERATIONS & CS ADMIN CONSOLE (/ops - 가상계좌 송금 & 전자책 전용)
   ========================================================================== */
function renderOpsView() {
  const inboxBody = document.getElementById("opsEventInboxTableBody");
  const auditBody = document.getElementById("opsAuditLogTableBody");
  const memberCard = document.getElementById("opsMemberEntitlementCard");
  if (!inboxBody || !auditBody || !memberCard) return;

  const ent = appState.entitlement;
  const ord = appState.order;

  memberCard.innerHTML = `
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
      <div class="p-4 rounded-xl bg-white border border-[#ebe5e6] shadow-sm">
        <div class="text-[#6d6d6d]">회원명 / 법명 / 소속</div>
        <div class="font-bold text-sm text-[#333333] mt-1">${appState.member.realName} (<span class="text-[#f26522]">${appState.member.dharmaName}</span>)</div>
        <div class="text-[11px] text-[#9a9a9a] mt-0.5">${appState.member.branch}</div>
      </div>
      <div class="p-4 rounded-xl bg-white border border-[#ebe5e6] shadow-sm">
        <div class="text-[#6d6d6d]">가상계좌 송금 상태</div>
        <div class="font-bold text-sm text-[#d1743b] mt-1">${ord.status}</div>
        <div class="text-[11px] text-[#9a9a9a] mt-0.5">${ord.vbankInfo.bankName} ${ord.vbankInfo.accountNo}</div>
      </div>
      <div class="p-4 rounded-xl bg-white border border-[#ebe5e6] shadow-sm">
        <div class="text-[#6d6d6d]">eBook 열람권(Entitlement)</div>
        <div class="font-bold text-sm text-[#36858c] mt-1">${ent.status}</div>
        <div class="text-[11px] text-[#9a9a9a] mt-0.5">워터마크 코드: <span class="font-mono font-bold text-[#333333]">${appState.member.watermarkCode}</span></div>
      </div>
      <div class="p-4 rounded-xl bg-white border border-[#ebe5e6] shadow-sm">
        <div class="text-[#6d6d6d]">최초 열람(ReadingStart)</div>
        <div class="font-bold text-sm ${ent.readingStarted ? "text-[#d1743b]" : "text-[#36858c]"} mt-1">
          ${ent.readingStarted ? "열람개시 확정 (환불제한)" : "미열람 (환불가능)"}
        </div>
        <div class="text-[11px] text-[#9a9a9a] mt-0.5">${ent.readingStartedAt || "-"}</div>
      </div>
    </div>
  `;

  const dbPanel = document.getElementById("opsDatabaseStatePanel");
  if (dbPanel) {
    const devCount = getActiveDevices().length;
    dbPanel.innerHTML = `
      <div class="bg-white rounded-xl p-5 border border-[#ebe5e6] shadow-sm space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span class="px-2 py-0.5 rounded bg-[#eef7f8] text-[#36858c] text-[11px] font-extrabold">ZONE 4 · Physical Data Layer</span>
            <h2 class="text-sm font-extrabold text-[#333333] mt-0.5">🗄️ PostgreSQL 16 (6-Table ACID) & Redis 7 In-Memory Guard 실시간 상태</h2>
          </div>
          <div class="flex flex-wrap gap-2 text-xs">
            <a href="releases/v1.0.0/manifest.json" target="_blank" class="px-3 py-1.5 rounded bg-[#fbfbfb] hover:bg-[#f6f6f6] text-[#36858c] border border-[#519ea6] font-bold">
              📦 S3 Release Manifest (v1.0.0) ↗
            </a>
            <a href="jungto_ebook_system_architecture.png" target="_blank" class="px-3 py-1.5 rounded bg-[#fde7da] hover:bg-[#fbd5be] text-[#d1743b] border border-[#ee8545] font-bold">
              🖼️ Excalidraw 전체 구성도 (PNG) ↗
            </a>
          </div>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5 text-[11px]">
          <div class="p-3 rounded-lg bg-[#eff6ff] border border-blue-200">
            <div class="font-extrabold text-blue-900">1. ebook_orders</div>
            <div class="font-mono text-blue-700 mt-1">${ord.orderId}</div>
            <div class="text-slate-600 mt-0.5">상태: <strong>${ord.status}</strong> (+72h TTL)</div>
          </div>
          <div class="p-3 rounded-lg bg-[#fff7ed] border border-orange-200">
            <div class="font-extrabold text-orange-900">2. payment_webhooks</div>
            <div class="font-mono text-orange-700 mt-1">${appState.eventInbox.length}건 수신</div>
            <div class="text-slate-600 mt-0.5">UNIQUE(pg_tx_id) 멱등</div>
          </div>
          <div class="p-3 rounded-lg bg-[#fffbeb] border border-amber-200">
            <div class="font-extrabold text-amber-900">3. entitlements</div>
            <div class="font-mono text-amber-800 mt-1">${ent.entitlementId}</div>
            <div class="text-slate-600 mt-0.5">ReadingStart: <strong>${ent.readingStarted ? "LOCKED" : "NULL"}</strong></div>
          </div>
          <div class="p-3 rounded-lg bg-[#f5f3ff] border border-purple-200">
            <div class="font-extrabold text-purple-900">4. registered_devices</div>
            <div class="font-mono text-purple-700 mt-1">${devCount} / ${ent.maxDevices || 3}대 활성</div>
            <div class="text-slate-600 mt-0.5">SHA-256 FP 슬롯 제어</div>
          </div>
          <div class="p-3 rounded-lg bg-[#ecfdf5] border border-emerald-200">
            <div class="font-extrabold text-emerald-900">5. reading_progress</div>
            <div class="font-mono text-emerald-700 mt-1">전 4권 + 북마크 ${appState.bookmarks.length}건</div>
            <div class="text-slate-600 mt-0.5">JSONB 실시간 동기화</div>
          </div>
          <div class="p-3 rounded-lg bg-[#fef2f2] border border-red-200">
            <div class="font-extrabold text-red-900">6. ebook_audit_logs</div>
            <div class="font-mono text-red-700 mt-1">${appState.auditLogs.length}건 기록됨</div>
            <div class="text-slate-600 mt-0.5">전상법 5년 Append-Only</div>
          </div>
          <div class="p-3 rounded-lg bg-[#1e293b] text-[#22c55e] border border-slate-700">
            <div class="font-extrabold text-white">Redis 7 Keyspace</div>
            <div class="font-mono mt-1">lock:webhook (30s)</div>
            <div class="font-mono text-[10px] text-emerald-300 mt-0.5">sess:viewer (${ent.signedUrlTtlSec}s)</div>
          </div>
        </div>
      </div>
    `;
  }

  inboxBody.innerHTML = appState.eventInbox
    .map(
      (ev) => `
    <tr class="border-b border-[#ebe5e6] hover:bg-[#fbfbfb]">
      <td class="py-2.5 px-3 font-mono font-bold text-[#d1743b]">${ev.eventId}</td>
      <td class="py-2.5 px-3 font-semibold text-[#333333]">${ev.eventType}</td>
      <td class="py-2.5 px-3 font-mono text-[#6d6d6d]">${ev.orderId}</td>
      <td class="py-2.5 px-3">
        <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
          ev.idempotencyResult.includes("DUPLICATE")
            ? "bg-[#fde7da] text-[#d1743b] border border-[#ee8545]"
            : "bg-[#eef7f8] text-[#36858c] border border-[#519ea6]"
        }">${ev.idempotencyResult}</span>
      </td>
      <td class="py-2.5 px-3 font-mono text-[#9a9a9a]">${ev.processedAt}</td>
    </tr>`
    )
    .join("");

  auditBody.innerHTML = appState.auditLogs
    .map(
      (log) => `
    <tr class="border-b border-[#ebe5e6] hover:bg-[#fbfbfb]">
      <td class="py-2.5 px-3 font-mono text-[#6d6d6d]">${log.auditId}</td>
      <td class="py-2.5 px-3 font-bold text-[#36858c]">${log.actor}</td>
      <td class="py-2.5 px-3 font-mono font-bold text-[#f26522]">${log.action}</td>
      <td class="py-2.5 px-3 text-[#333333]">${log.reason}</td>
      <td class="py-2.5 px-3 font-mono text-[#9a9a9a]">${log.timestamp}</td>
    </tr>`
    )
    .join("");
}

function simulatePgWebhook(type) {
  if (type === "DUPLICATE_TEST") {
    const dupId = appState.eventInbox[0]?.eventId || "PG_VBANK_20261023_0001";
    appState.eventInbox.unshift({
      eventId: dupId,
      eventType: "DUPLICATE_VBANK_WEBHOOK_RETRY",
      orderId: appState.order.orderId,
      idempotencyResult: "IGNORED_DUPLICATE (EventInbox 멱등성 차단 완료)",
      processedAt: formatNow()
    });
    saveState();
    renderAllViews();
    showToast(`중복 가상계좌 입금 웹훅(${dupId})이 EventInbox 멱등성 키 검증으로 안전하게 무시(No-op)되었습니다.`);
    return;
  }

  if (type === "PAID_VERIFIED") {
    appState.order.status = "PAID_VERIFIED";
    appState.order.paidAt = formatNow();
    appState.entitlement.status = "ACTIVE";
    appState.eventInbox.unshift({
      eventId: "PG_VBANK_PAID_" + Math.floor(1000 + Math.random() * 9000),
      eventType: "VBANK_DEPOSIT_CONFIRMED (가상계좌 200,000원 송금완료)",
      orderId: appState.order.orderId,
      idempotencyResult: "PROCESSED (열람권 ACTIVE 자동 전환)",
      processedAt: formatNow()
    });
    appState.auditLogs.unshift({
      auditId: "AUD-" + Math.floor(1000 + Math.random() * 9000),
      actor: "SYSTEM (PG 가상계좌 웹훅)",
      action: "ACTIVATE_ENTITLEMENT",
      target: appState.order.orderId,
      reason: "1회용 가상계좌 200,000원 송금 입금 확인 웹훅 수신 -> e북 전 4권 열람권 즉시 활성화",
      timestamp: formatNow()
    });
    saveState();
    renderAllViews();
    showToast("가상계좌 200,000원 송금 완료 웹훅이 처리되어 전 4권 e북 열람권이 즉시 ACTIVE로 전환되었습니다!");
  } else if (type === "REFUNDED_CONFIRMED") {
    appState.order.status = "REFUNDED_CONFIRMED";
    appState.entitlement.status = "REVOKED";
    appState.eventInbox.unshift({
      eventId: "PG_VBANK_REFUND_" + Math.floor(1000 + Math.random() * 9000),
      eventType: "VBANK_REFUND_TRANSFERRED (환불계좌 송금반환 완료)",
      orderId: appState.order.orderId,
      idempotencyResult: "PROCESSED (열람권 REVOKED 즉시 회수)",
      processedAt: formatNow()
    });
    appState.auditLogs.unshift({
      auditId: "AUD-" + Math.floor(1000 + Math.random() * 9000),
      actor: "SYSTEM (PG 환불 웹훅)",
      action: "REVOKE_ENTITLEMENT",
      target: appState.order.orderId,
      reason: `등록된 환불계좌(${appState.order.refundAccount?.bankName || "국민은행"} ${appState.order.refundAccount?.accountNo || ""})로 환불 이체 완료 -> 열람권 즉시 회수`,
      timestamp: formatNow()
    });
    saveState();
    renderAllViews();
    showToast("환불 계좌 반환 및 PG 웹훅이 반영되어 회원의 e북 열람권이 즉시 회수(REVOKED)되었습니다.", "warn");
  }
}

function executeCsEntitlementChange(newStatus) {
  const reasonInput = document.getElementById("csAuditReasonInput");
  const reason = reasonInput?.value?.trim() || "";
  if (reason.length < 5) {
    showToast("운영 감사 로그(AuditEvent) 보존을 위해 처리 사유를 5자 이상 반드시 입력해야 합니다.", "error");
    return;
  }

  const prev = appState.entitlement.status;
  appState.entitlement.status = newStatus;
  if (newStatus === "RESET_READING_START") {
    appState.entitlement.status = "ACTIVE";
    appState.entitlement.readingStarted = false;
    appState.entitlement.readingStartedAt = "";
  }

  appState.auditLogs.unshift({
    auditId: "AUD-" + Math.floor(1000 + Math.random() * 9000),
    actor: "CS_ADMIN (법회팀/출판국 담당자)",
    action: `MANUAL_${newStatus} (이전: ${prev})`,
    target: `${appState.member.realName} (${appState.member.watermarkCode})`,
    reason,
    timestamp: formatNow()
  });

  if (reasonInput) reasonInput.value = "";
  saveState();
  renderAllViews();
  showToast(`CS 수동 권한 조정이 반영되고 AuditEvent 감사 로그에 영구 기록되었습니다.`);
}

function traceWatermarkCode() {
  const input = document.getElementById("opsWatermarkSearchInput");
  const resultBox = document.getElementById("opsWatermarkTraceResult");
  if (!input || !resultBox) return;
  const code = input.value.trim().toUpperCase();

  if (code === appState.member.watermarkCode || code === "JT-7K4M") {
    resultBox.innerHTML = `
      <div class="p-3.5 rounded-xl bg-[#eef7f8] border border-[#519ea6] text-xs text-[#333333] mt-2">
        <div class="font-bold text-[#36858c]">✅ 워터마크 식별코드 [${appState.member.watermarkCode}] 역추적 일치!</div>
        <div class="mt-1">• 회원번호: ${appState.member.memberId} | 성명: <strong>${appState.member.realName}</strong> (법명: ${appState.member.dharmaName})</div>
        <div>• 소속지회: ${appState.member.branch} | 주문번호: ${appState.order.orderId}</div>
        <div>• 최근 열람 접속 IP: <span class="font-mono font-bold">${appState.member.sessionIp}</span> | 열람권 상태: <strong class="text-[#f26522]">${appState.entitlement.status}</strong></div>
      </div>
    `;
  } else {
    resultBox.innerHTML = `
      <div class="p-3.5 rounded-xl bg-red-50 border border-red-300 text-xs text-red-800 mt-2">
        ❌ 입력하신 워터마크 코드(${code || "미입력"})와 일치하는 활성 열람 세션이 없습니다. (검수 기본 코드: <strong>JT-7K4M</strong>)
      </div>
    `;
  }
}

function exportSettlementCsv() {
  const ord = appState.order;
  const ent = appState.entitlement;
  const m = appState.member;
  const headers = [
    "주문번호",
    "송금상태",
    "회원ID",
    "성명",
    "법명",
    "소속지회",
    "채번가상계좌은행",
    "가상계좌번호",
    "송금액(면세)",
    "입금확인일시",
    "열람권상태",
    "최초열람개시(ReadingStart)",
    "환불반환계좌"
  ];
  const row = [
    ord.orderId,
    ord.status,
    m.memberId,
    m.realName,
    m.dharmaName,
    m.branch,
    `"${ord.vbankInfo.bankName}"`,
    ord.vbankInfo.accountNo,
    ord.amount,
    ord.paidAt,
    ent.status,
    ent.readingStarted ? ent.readingStartedAt : "미열람",
    `"${ord.refundAccount?.bankName || "국민은행"} ${ord.refundAccount?.accountNo || ""}"`
  ];
  const csvContent = "\uFEFF" + headers.join(",") + "\n" + row.join(",") + "\n";
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `정토대전_eBook_가상계좌송금정산원장_${formatNow().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);

  appState.auditLogs.unshift({
    auditId: "AUD-" + Math.floor(1000 + Math.random() * 9000),
    actor: "OPS_ADMIN (재정/출판 정산담당)",
    action: "EXPORT_VBANK_SETTLEMENT_CSV",
    target: "정토대전 eBook 가상계좌 송금·정산 원장 (1건)",
    reason: "재정팀 가상계좌 입금 대사 및 전자책 면세 정산용 CSV 다운로드",
    timestamp: formatNow()
  });
  saveState();
  renderOpsView();
  showToast("가상계좌(송금) 입금 대사 및 정산 원장 CSV 파일 다운로드가 완료되었습니다.");
}

/* ==========================================================================
   MODALS: ERRATA (정오표) & REFUND VERIFICATION (청약철회 검증)
   ========================================================================== */
function openErrataModal() {
  const modal = document.getElementById("modalErrata");
  const tbody = document.getElementById("errataModalBody");
  if (!modal || !tbody) return;

  tbody.innerHTML = ERRATA_LIST.map(
    (er) => `
    <tr class="border-b border-[#ebe5e6] hover:bg-[#fbfbfb]">
      <td class="py-2.5 px-3 font-mono text-xs font-bold text-[#6d6d6d]">${er.id}</td>
      <td class="py-2.5 px-3 text-xs font-bold text-[#36858c]">${er.vol}<br/><span class="text-[11px] font-normal text-[#9a9a9a]">${er.pageLabel}</span></td>
      <td class="py-2.5 px-3 text-xs text-red-600 line-through">${er.before}</td>
      <td class="py-2.5 px-3 text-xs text-[#333333] font-bold">${er.after}</td>
      <td class="py-2.5 px-3 text-right">
        <button onclick="jumpFromErrata('${er.targetVol}', ${er.targetPage})" class="px-3 py-1.5 rounded bg-[#ee8545] hover:bg-[#d1743b] text-white text-[11px] font-bold transition">
          해당 본문 열기
        </button>
      </div>
    </tr>`
  ).join("");
  modal.classList.remove("hidden");
}

function jumpFromErrata(volId, pageNum) {
  document.getElementById("modalErrata")?.classList.add("hidden");
  requestOpenVolume(volId, pageNum);
}

function openRefundCheckModal() {
  const modal = document.getElementById("modalRefundCheck");
  const body = document.getElementById("refundCheckModalBody");
  if (!modal || !body) return;

  const ent = appState.entitlement;
  const ord = appState.order;
  if (ent.readingStarted) {
    body.innerHTML = `
      <div class="p-4 rounded-xl bg-[#fde7da]/50 border border-[#ee8545] text-[#333333]">
        <div class="text-base font-bold text-[#d1743b] flex items-center gap-2">
          🚫 온라인 자동 청약철회(단순 변심 환불) 불가 판정
        </div>
        <p class="text-xs mt-2 leading-relaxed">
          회원님께서는 <strong>${ent.readingStartedAt}</strong>에 <strong>[${ent.readingStartVol}]</strong> 전자책 본문을 최초 열람 개시(<code>ReadingStart = true</code>)하셨습니다.
        </p>
        <p class="text-xs mt-2 leading-relaxed text-[#6d6d6d]">
          「전자상거래 등에서의 소비자보호에 관한 법률」 제17조 제2항 제5호에 따라 디지털 전자책(eBook)의 열람이 개시된 이후에는 온라인 단순 변심 환불이 제한됩니다. (단, 파일 결함이나 오송금 등 예외 사유는 시스템국 CS 콘솔에서 수동 심사로 처리 가능)
        </p>
      </div>
    `;
  } else {
    body.innerHTML = `
      <div class="p-4 rounded-xl bg-[#eef7f8] border border-[#519ea6] text-[#333333]">
        <div class="text-base font-bold text-[#36858c]">
          ✅ 미열람 상태 확인 (` + "`ReadingStart = false`" + `) · 등록 환불계좌로 즉시 반환 가능!
        </div>
        <p class="text-xs mt-2 leading-relaxed">
          가상계좌 송금 후 아직 『정토대전』 전자책 본문을 열람하지 않으셨으므로, 신청 시 등록하신 환불계좌(<strong>${ord.refundAccount?.bankName || "국민은행"} ${ord.refundAccount?.accountNo || "110-482-990182"}</strong>)로 200,000원 전액 환불 및 열람권 회수(REVOKED)가 가능합니다.
        </p>
        <button onclick="simulatePgWebhook('REFUNDED_CONFIRMED'); document.getElementById('modalRefundCheck').classList.add('hidden');"
                class="mt-3 px-4 py-2.5 rounded bg-[#f26522] hover:bg-[#d1743b] text-white text-xs font-bold shadow transition">
          즉시 청약철회(환불계좌 송금 반환) 실행 및 열람권 회수
        </button>
      </div>
    `;
  }
  modal.classList.remove("hidden");
}

/* ==========================================================================
   INITIALIZATION, SECURITY LISTENERS & SIGNED URL TTL TIMER
   ========================================================================== */
window.addEventListener("DOMContentLoaded", () => {
  const volSelect = document.getElementById("viewerVolumeSelector");
  if (volSelect) {
    volSelect.addEventListener("change", (e) => {
      const targetId = e.target.value;
      if (targetId !== "preview" && appState.entitlement.status !== "ACTIVE") {
        showToast("열람권이 비활성 상태입니다. 무료 맛보기 샘플만 열람할 수 있습니다.", "error");
        volSelect.value = "preview";
        return;
      }
      loadVolumeInViewer(targetId, false);
    });
  }

  const localInput = document.getElementById("localPdfUploadInput");
  if (localInput) {
    localInput.addEventListener("change", (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (localBlobUrl) URL.revokeObjectURL(localBlobUrl);
      localBlobUrl = URL.createObjectURL(file);
      EXTRA_PDFS.local = {
        id: "local",
        volNum: "로컬문서",
        title: file.name,
        url: localBlobUrl,
        version: "로컬검수"
      };
      loadVolumeInViewer("local", false);
      showToast(`로컬 PDF 파일(${file.name})을 고해상도 뷰어에 로드했습니다.`);
    });
  }

  document.addEventListener("contextmenu", (e) => {
    if (appState.currentView === "viewer") {
      e.preventDefault();
      showToast("보안 정책: 『정토대전』 저작권 보호를 위해 우클릭 메뉴가 제한됩니다.", "warn");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (appState.currentView !== "viewer") return;
    if ((e.ctrlKey || e.metaKey) && ["s", "p", "u"].includes(e.key.toLowerCase())) {
      e.preventDefault();
      showToast("보안 정책: 전자책 원본 저장(Ctrl+S) 및 인쇄(Ctrl+P)가 차단되어 있습니다.", "error");
      return;
    }
    if (document.activeElement && ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) {
      return;
    }
    if (e.key === "ArrowRight") changePage(1);
    if (e.key === "ArrowLeft") changePage(-1);
    if (e.key === "+" || e.key === "=") changeZoom(0.15);
    if (e.key === "-") changeZoom(-0.15);
  });

  window.addEventListener("blur", () => {
    if (appState.currentView === "viewer" && appState.viewerPrefs.blurProtectEnabled) {
      document.getElementById("privacyBlurShield")?.classList.remove("hidden");
    }
  });
  window.addEventListener("focus", () => {
    document.getElementById("privacyBlurShield")?.classList.add("hidden");
  });

  setInterval(() => {
    if (appState.entitlement.status === "ACTIVE") {
      appState.entitlement.signedUrlTtlSec -= 1;
      if (appState.entitlement.signedUrlTtlSec <= 30) {
        appState.entitlement.signedUrlTtlSec = 300;
        showToast("CloudFront Signed URL 단기 서명 토큰(TTL 5분)이 백그라운드에서 자동 갱신되었습니다.");
      }
      renderTopStatusRibbon();
    }
  }, 1000);

  switchView(appState.currentView || "viewer");
  loadVolumeInViewer(appState.viewerPrefs.activeVolId || "vol1", true);
});
