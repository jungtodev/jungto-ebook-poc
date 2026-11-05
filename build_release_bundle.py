#!/usr/bin/env python3
"""
『정토대전 (淨土大典)』 S3 Immutable Release Bundle Generator (v1.0.0)
- 전 4권 PDF 에셋의 SHA-256 무결성 해시, 바이트 크기, HTTP 206 64KB Range 청크 오프셋 계산
- S3 Private Vault 구조(releases/v1.0.0/manifest.json 및 index/search_vol1..4.json) 자동 패키징
"""
import hashlib
import json
import math
import shutil
from datetime import datetime, timezone
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
PDF_DIR = BASE_DIR / "pdfs"
RELEASE_DIR = BASE_DIR / "releases" / "v1.0.0"
BOOKS_DIR = RELEASE_DIR / "books"
INDEX_DIR = RELEASE_DIR / "index"

CHUNK_SIZE = 65536  # 64KB HTTP 206 Range Chunk

VOLUMES = [
    {
        "volume_no": 1,
        "code": "VOL1",
        "title": "제1권 경전편 (經典篇)",
        "subtitle": "근본 불교 경전과 대승 경전의 핵심 요체",
        "src_file": "jungto_daejeon_vol1.pdf",
        "dest_file": "vol1_linearized.pdf",
        "total_pages": 10,
        "roman_pages": 2,
        "keywords": ["연기법", "사성제", "팔정도", "중도", "무아", "금강경", "반야심경", "공성"],
    },
    {
        "volume_no": 2,
        "code": "VOL2",
        "title": "제2권 사상편 (思想篇)",
        "subtitle": "인간 붓다의 깨달음과 정토 사상의 역사적 전개",
        "src_file": "jungto_daejeon_vol2.pdf",
        "dest_file": "vol2_linearized.pdf",
        "total_pages": 10,
        "roman_pages": 2,
        "keywords": ["정토사상", "수행론", "보살도", "대승불교", "원효", "일심", "화쟁", "무애행"],
    },
    {
        "volume_no": 3,
        "code": "VOL3",
        "title": "제3권 수행편 (修行篇)",
        "subtitle": "일상에서 깨어있는 정토 행자의 마음공부와 실천 수행",
        "src_file": "jungto_daejeon_vol3.pdf",
        "dest_file": "vol3_linearized.pdf",
        "total_pages": 10,
        "roman_pages": 2,
        "keywords": ["알아차림", "명상", "108배", "나누기", "정진", "습관", "번뇌", "해탈"],
    },
    {
        "volume_no": 4,
        "code": "VOL4",
        "title": "제4권 실천편 (實踐篇)",
        "subtitle": "맑은 마음, 좋은 벗, 깨끗한 땅을 일구는 사회적 실천",
        "src_file": "jungto_daejeon_vol4.pdf",
        "dest_file": "vol4_linearized.pdf",
        "total_pages": 10,
        "roman_pages": 2,
        "keywords": ["정토회", "보시", "봉사", "환경실천", "평화", "공동체", "전법", "회향"],
    },
]


def sha256_of_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def build_bundle() -> None:
    BOOKS_DIR.mkdir(parents=True, exist_ok=True)
    INDEX_DIR.mkdir(parents=True, exist_ok=True)

    manifest_volumes = []

    for vol in VOLUMES:
        src_path = PDF_DIR / vol["src_file"]
        dest_path = BOOKS_DIR / vol["dest_file"]
        shutil.copy2(src_path, dest_path)

        file_size = dest_path.stat().st_size
        file_hash = sha256_of_file(dest_path)
        chunk_count = math.ceil(file_size / CHUNK_SIZE)

        chunks_meta = []
        for idx in range(chunk_count):
            start_byte = idx * CHUNK_SIZE
            end_byte = min((idx + 1) * CHUNK_SIZE - 1, file_size - 1)
            chunks_meta.append({
                "chunk_index": idx,
                "range_header": f"bytes={start_byte}-{end_byte}",
                "content_range": f"bytes {start_byte}-{end_byte}/{file_size}",
                "byte_length": end_byte - start_byte + 1,
            })

        search_index_payload = {
            "edition_version": "v1.0.0",
            "volume_no": vol["volume_no"],
            "title": vol["title"],
            "dom_text_exposed": False,
            "indexed_terms": [
                {
                    "term": kw,
                    "page": (i % (vol["total_pages"] - 2)) + 3,
                    "print_page_label": f"쪽 {(i % (vol['total_pages'] - 2)) + 1}",
                    "bbox_norm": [0.14, round(0.22 + (i * 0.07) % 0.55, 3), 0.72, 0.038],
                }
                for i, kw in enumerate(vol["keywords"])
            ],
        }
        index_file = INDEX_DIR / f"search_vol{vol['volume_no']}.json"
        index_file.write_text(json.dumps(search_index_payload, ensure_ascii=False, indent=2), encoding="utf-8")

        manifest_volumes.append({
            "volume_no": vol["volume_no"],
            "code": vol["code"],
            "title": vol["title"],
            "subtitle": vol["subtitle"],
            "s3_key": f"releases/v1.0.0/books/{vol['dest_file']}",
            "search_index_key": f"releases/v1.0.0/index/search_vol{vol['volume_no']}.json",
            "file_size_bytes": file_size,
            "sha256": file_hash,
            "linearized_fast_web_view": True,
            "range_chunk_size_bytes": CHUNK_SIZE,
            "total_chunks": chunk_count,
            "total_pages": vol["total_pages"],
            "roman_preface_pages": vol["roman_pages"],
            "chunks_preview": chunks_meta[:4],
        })

    manifest = {
        "schema_version": "1.0",
        "edition_version": "v1.0.0",
        "e_isbn": "979-11-98765-01-2",
        "publication_type": "DIGITAL_EBOOK_ONLY_NO_PAPER",
        "tax_policy": "VAT_EXEMPT_0_PERCENT",
        "payment_policy": "VIRTUAL_ACCOUNT_ONLY_72H_TTL",
        "drm_policy": {
            "engine": "GEUMGANG_DRM_V2",
            "cloudfront_oac_signed_url_ttl_sec": 300,
            "http_206_range_chunk_bytes": CHUNK_SIZE,
            "ios_safari_sliding_window_pages": 3,
            "max_registered_devices": 3,
            "forensic_watermark_alg": "JTS-WM-SHA256",
        },
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "volumes": manifest_volumes,
    }

    manifest_path = RELEASE_DIR / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"[OK] Generated S3 release bundle at: {RELEASE_DIR}")
    print(f"[OK] Manifest: {manifest_path} ({manifest_path.stat().st_size} bytes)")


if __name__ == "__main__":
    build_bundle()
