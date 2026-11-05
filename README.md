# 『정토대전 (淨土大典)』 100% 전자책 · 가상계좌 · 금강(金剛) DRM 통합 PoC 및 아키텍처 허브

- **실시간 배포 웹 URL (GitHub Pages)**: https://jungtodev.github.io/jungto-ebook-poc/
- **4-Layer 인터랙티브 아키텍처 도면**: https://jungtodev.github.io/jungto-ebook-poc/jungto_ebook_architecture_diagram.html
- **Excalidraw 전체 시스템 구성도 (PNG)**: https://jungtodev.github.io/jungto-ebook-poc/jungto_ebook_system_architecture.png
- **S3 불변 릴리즈 매니페스트 (`v1.0.0`)**: https://jungtodev.github.io/jungto-ebook-poc/releases/v1.0.0/manifest.json

---

## 1. 실시간 웹 검수 바로가기 (Live Web Links)

| 구분 | 웹 접속 URL (클릭 시 즉시 실행) | 주요 포함 기능 |
| :--- | :--- | :--- |
| **1. 통합 PoC 메인 웹앱** | https://jungtodev.github.io/jungto-ebook-poc/jungto_ebook_viewer_poc.html | ① 정토대전 구매·가상계좌 채번 신청 / ② 내 서재 (전 4권 · 청약철회 판정 · 기기 3대 슬롯 가드 · 정오표) / ③ `PDF.js` 금강 DRM 고해상도 웹 뷰어 / ④ 시스템국 운영·CS 콘솔 (`/ops`) |
| **2. 4-Layer 아키텍처 도면** | https://jungtodev.github.io/jungto-ebook-poc/jungto_ebook_architecture_diagram.html | ① 논리 아키텍처 / ② AWS 클라우드 배포 토폴로지 / ③ 가상계좌·환불 상태 머신 / ④ PostgreSQL 6-Table 물리 스키마 (SVG 도면) |
| **3. Excalidraw 전체 구성도** | https://jungtodev.github.io/jungto-ebook-poc/jungto_ebook_system_architecture.png | Multi-Zoom 4-Zone 전체 시스템 구성도 및 `HTTP 206` · `ReadingStart` · `S3 Tree` 기술 증적 포함 |
| **4. S3 릴리즈 매니페스트** | https://jungtodev.github.io/jungto-ebook-poc/releases/v1.0.0/manifest.json | 전 4권 SHA-256 무결성 해시, 64KB Range 청크 메타데이터, E-ISBN 면세 정책 정의 |

---

## 2. 문서 및 엔지니어링 명세 (Documentation & Specs)

- **종합 문서 허브 인덱스**: [docs/README.md](./docs/README.md)
- **01. 요구사항 및 현업협의**: [docs/01_요구사항_및_현업협의.md](./docs/01_요구사항_및_현업협의.md)
- **02. 기획 및 솔루션비교**: [docs/02_기획_및_솔루션비교.md](./docs/02_기획_및_솔루션비교.md)
- **03. 개발 및 기술아키텍처**: [docs/03_개발_및_기술아키텍처.md](./docs/03_개발_및_기술아키텍처.md)
- **04. 운영 및 CS매뉴얼**: [docs/04_운영_및_CS매뉴얼.md](./docs/04_운영_및_CS매뉴얼.md)
- **05. 프로덕션 PoC 검수 및 최종보고서**: [docs/05_프로덕션_PoC_검수_및_최종보고서.md](./docs/05_프로덕션_PoC_검수_및_최종보고서.md)
- **06. PoC 아키텍처 및 직군별 해설서**: [docs/06_PoC_아키텍처_및_직군별_기획_운영_개발_해설서.md](./docs/06_PoC_아키텍처_및_직군별_기획_운영_개발_해설서.md)
- **07. 기획자 및 현업부서용 A to Z 가이드**: [docs/07_기획자_및_현업부서용_전자책_발간_운영_종료_AtoZ_가이드.md](./docs/07_기획자_및_현업부서용_전자책_발간_운영_종료_AtoZ_가이드.md)
- **08. 현업부서 필수확인 및 의사결정 질문서**: [docs/08_현업부서_필수확인_및_의사결정_질문서_비기술전용.md](./docs/08_현업부서_필수확인_및_의사결정_질문서_비기술전용.md)
- **09. 재정회계팀 전용 세무·수납·정산·환불 검토서**: [docs/09_재정회계팀_전용_세무_수납_정산_환불_검토서_초안.md](./docs/09_재정회계팀_전용_세무_수납_정산_환불_검토서_초안.md)
- **10. 법무개인정보팀 전용 저작권·약관·청약철회 검토서**: [docs/10_법무개인정보팀_전용_저작권_약관_청약철회_법령_검토서_초안.md](./docs/10_법무개인정보팀_전용_저작권_약관_청약철회_법령_검토서_초안.md)
- **PostgreSQL 16 6-Table 프로덕션 DDL**: [specs/schema_v1_jungto_ebook.sql](./specs/schema_v1_jungto_ebook.sql)
- **OpenAPI 3.1.0 REST API 표준 계약서**: [specs/openapi_v1_jungto_ebook.yaml](./specs/openapi_v1_jungto_ebook.yaml)
