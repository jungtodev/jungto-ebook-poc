#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
『정토대전 (淨土大典)』 프로덕션 검수용 4권 세트 + 무료 맛보기 샘플 PDF 생성기
- 벡터 한글/한자 폰트 임베딩 및 서브셋팅 (AppleMyungjo, Identity-H)
- PDF 내장 책갈피 목차 (PDF Outline / TOC) 완벽 지원
- PDF 논리 페이지 번호 (PageLabels: 서문 i, ii / 본문 1~10) 내장
- PDF.js TextLayer 본문 검색 및 하이라이트 검증용 다층 텍스트 구성
"""

import os
import shutil
import fitz  # PyMuPDF

OUT_DIR = "/Users/jeongseongchae/dev/jts/temp/pdfs"
FONT_MYUNGJO = "/System/Library/Fonts/Supplemental/AppleMyungjo.ttf"

os.makedirs(OUT_DIR, exist_ok=True)

VOLUMES = [
    {
        "id": "vol1",
        "filename": "jungto_daejeon_vol1.pdf",
        "vol_num": "제1권",
        "title_ko": "정토대전 제1권 경전편",
        "title_hanja": "淨土大典 第一卷 經典篇",
        "subtitle": "초기불교 근본경전과 대승불교 핵심경전 집성",
        "accent": (0.14, 0.36, 0.26),  # Deep Dharma Green
        "chapters": [
            {
                "title": "제1장 연기법과 중도 (緣起法과 中道)",
                "hanja_header": "此有故彼有 此生故彼生 · 이것이 있으므로 저것이 있다",
                "quotes": [
                    "비구들이여, 연기(緣起, Paṭiccasamuppāda)란 무엇인가? 이것이 있을 때 저것이 있고, 이것이 일어날 때 저것이 일어난다. 이것이 없을 때 저것이 없고, 이것이 멸할 때 저것이 멸한다.",
                    "가령 어떤 사람이 버터기름이 담긴 항아리를 깊은 호수 속으로 던진다면 항아리는 깨질 것이네. 깨진 항아리 조각과 파편은 밑으로 가라앉고 버터기름은 위로 떠올라 물과 분리되네. 이처럼 오랜 세월 계행과 배움과 내려놓음과 지혜로 닦인 마음은 위로 떠올라 해탈로 나아가네. (쌍윳따 니까야 SN 55.21)",
                    "양극단에 치우치지 아니하고 여래는 중도(中道, Majjhimā paṭipadā)로써 법을 설하나니, 눈을 뜨게 하고 지혜를 일으키며 고요함과 최상의 깨달음, 열반으로 인도하느니라."
                ],
                "commentary": [
                    "[정토해설] 초기불교의 핵심 사상인 연기법(緣起法)은 세상 모든 존재와 현상이 독자적 실체(自性, Svabhāva) 없이 상호 의존적 관계망 속에서 생멸함을 밝힌다. 정토행자는 일상 속 갈등이 일어날 때 상대방을 탓하기보다 내 마음의 집착(取)과 분별심을 먼저 살피는 수행의 준거로 삼는다.",
                    "[용어주석] ① 연기(緣起): 조건 지어져 함께 일어남. ② 중도(中道): 쾌락주의와 고행주의, 있음(有)과 없음(無)의 양극단을 떠난 바른 통찰의 길."
                ]
            },
            {
                "title": "제2장 사성제와 팔정도 (四聖諦와 八正道)",
                "hanja_header": "苦集滅道 四聖諦 · 괴로움의 통찰과 완전한 소멸의 길",
                "quotes": [
                    "비구들이여, 이것이 고성제(苦聖諦)이니라. 태어남도 괴로움이요, 늙음도 괴로움이요, 병듦도 괴로움이요, 죽음도 괴로움이다. 미워하는 것과 만나는 것도 괴로움이요, 사랑하는 것과 헤어지는 것도 괴로움이요, 구해도 얻지 못하는 것도 괴로움이다. 요약하건대 오취온(五取蘊)이 모두 괴로움이니라.",
                    "이 괴로움의 소멸로 인도하는 성스러운 여덟 가지 길(八正道)은 바른 견해(正見), 바른 사유(正思惟), 바른 말(正語), 바른 행위(正業), 바른 생계(正命), 바른 정진(正精進), 바른 알아차림(正念), 바른 삼매(正定)이니라."
                ],
                "commentary": [
                    "[정토해설] 붓다의 첫 설법인 초전법륜경(初轉法輪經)은 추상적인 형이상학이 아니라 지금 여기에서 겪는 인간 고(苦)의 원인과 해결책을 명확한 인과율로 제시한다. 법륜스님은 이를 '괴로움이 없는 사람, 자유로운 사람'으로 나아가는 실천적 치유 원리로 풀이한다.",
                    "[정오표 연동 검증] 본 문단은 2026년 10월 간행본(v1.0.1) 기준 교열이 완료된 표준 본문입니다."
                ]
            },
            {
                "title": "제3장 반야심경과 공의 지혜 (般若波羅蜜多心經)",
                "hanja_header": "觀自在菩薩 行深般若波羅蜜多時 照見五蘊皆空 度一切苦厄",
                "quotes": [
                    "관자재보살이 깊은 반야바라밀다를 행할 때, 오온이 모두 공(空)한 것임을 비추어 보고 온갖 괴로움과 재앙을 건너느니라. 사리자여, 물질(色)이 공(空)과 다르지 않고 공이 물질과 다르지 않으며, 물질이 곧 공이요 공이 곧 물질이니라. 느낌(受)·생각(想)·지어감(行)·의식(識) 또한 그러하니라.",
                    "사리자여, 이 모든 법의 공한 모양(空相)은 나지도 않고 멸하지도 않으며, 더럽지도 않고 깨끗하지도 않으며, 늘지도 않고 줄지도 않느니라. 그러므로 보살은 반야바라밀다에 의지하므로 마음에 걸림이 없고(心無罣礙), 걸림이 없으므로 두려움이 없어서 뒤바뀐 헛된 생각을 멀리 떠나 완전한 열반(究竟涅槃)에 들어가느니라."
                ],
                "commentary": [
                    "[정토해설] 대승불교의 정수를 담은 『마하반야바라밀다심경』은 초기불교의 무아(無我)·연기(緣起)를 '공(空, Śūnyatā)'으로 집약한다. 내 생각이 옳다는 아상(我相)을 내려놓을 때 비로소 마음에 걸림이 사라지고 진정한 자유를 얻게 된다.",
                    "[핵심 검색어] 반야심경, 관자재보살, 오온개공, 색즉시공, 심무가애, 구경열반, 정토대전"
                ]
            },
            {
                "title": "제4장 금강경과 무주상보시 (金剛般若波羅蜜經)",
                "hanja_header": "應無所住 而生其心 · 마땅히 머무는 바 없이 그 마음을 내라",
                "quotes": [
                    "수보리여, 보살마하살은 마땅히 이와 같이 청정한 마음을 내어야 하느니라. 빛깔(色)에 머물러 마음을 내지 말며, 소리·향기·맛·감촉·법(聲香味觸法)에 머물러 마음을 내지 말지니, 마땅히 머무는 바 없이 그 마음을 내어야 하느니라(應無所住 而生其心).",
                    "무릇 있는 바 모든 모양은 다 허망하니, 만약 모든 모양이 모양 아님을 보면 곧 여래를 보리라(凡所有相 皆是虛妄 若見諸相非相 卽見如來). 일체의 유위법(有爲法)은 꿈과 같고 환상과 같고 물거품과 같고 그림자와 같으며 이슬과 같고 또한 번개와 같으니 마땅히 이와 같이 관할지니라."
                ],
                "commentary": [
                    "[정토해설] 『금강경』은 수행자가 선행을 하거나 베풀 때조차 '내가 베풀었다'는 상(相)에 머물지 않는 무주상보시(無住相布施)를 강조한다. 정토회 활동가와 수행자가 세상 속에서 활발히 봉사하되 그 과보나 칭찬에 얽매이지 않는 수행적 태도의 근간이다.",
                    "[핵심 검색어] 금강경, 수보리, 응무소주 이생기심, 범소유상 개시허망, 무주상보시"
                ]
            }
        ]
    },
    {
        "id": "vol2",
        "filename": "jungto_daejeon_vol2.pdf",
        "vol_num": "제2권",
        "title_ko": "정토대전 제2권 사료편",
        "title_hanja": "淨土大典 第二卷 史料篇",
        "subtitle": "한국불교 중흥과 정토회 30년 수행·사회실천 사료 집대성",
        "accent": (0.18, 0.29, 0.48),  # Deep Indigo Blue
        "chapters": [
            {
                "title": "제1장 정토회 창립과 제1차 만일결사 (萬日結社)",
                "hanja_header": "맑은 마음 · 좋은 벗 · 깨끗한 땅을 향한 만일의 서원",
                "quotes": [
                    "우리는 지금 수행과 전법의 공동체 정토회를 일구어 가는 만일결사(萬日結社)의 길 위에 서 있습니다. 개인의 해탈과 사회적 정토 실현은 둘이 아니며(自利利他 圓融無礙), 매일 아침 경전을 독송하고 108배를 올리는 일상 수행이 곧 세상을 바꾸는 첫걸음입니다.",
                    "1993년 제1차 만일결사 입재 이래 3년 단위의 10차 천일결사를 회향하기까지, 수많은 정토행자들이 새벽 정진과 보시, 봉사의 현장에서 자신의 카르마(業)를 직면하고 자유로운 삶의 주인으로 거듭났습니다."
                ],
                "commentary": [
                    "[사료해설] 제2권 사료편은 신라 원효대사의 대중불교 정신과 고려 보조국사 지눌의 정혜결사(定慧結社), 근대 용성조사(龍城祖師)의 지성불교·생활불교 유훈을 계승한 정토회 창립 선언문 및 제1차 만일결사 원문을 수록하였다.",
                    "[사료 색인] 만일결사, 천일결사, 용성조사, 불교대중화, 정토행자 서원문"
                ]
            },
            {
                "title": "제2장 국제구호 JTS와 평화·환경 실천 사료",
                "hanja_header": "배고픈 사람은 먹여야 하고, 아픈 사람은 치료받아야 하며, 아이들은 배워야 한다",
                "quotes": [
                    "JTS(Join Together Society)의 구호 원칙은 단순하고 명확합니다. 첫째, 가장 절박한 곳을 먼저 돕는다. 둘째, 현지 주민이 자립할 수 있도록 함께 일한다. 셋째, 구호기금은 운영비로 쓰지 않고 전액 현장 구호에 사용한다.",
                    "인도 둥게스와리(Dhungeshwari) 수자타 아카데미 설립에서부터 필리핀 민다나오 원주민·모로족 평화 학교 건축, 로힝야 난민 구호, 한반도 평화와 인도적 지원에 이르기까지 보살행의 발자취를 기록하였다."
                ],
                "commentary": [
                    "[사료해설] 수행과 사회실천의 통일(修行과 實踐의 不二)을 실증한 국내외 활동 보고서, JTS 현장 일지, 에코붓다 환경 실천 지침서 원문을 연대기별로 정리하였다.",
                    "[사료 색인] JTS, 수자타아카데미, 둥게스와리, 민다나오, 에코붓다, 평화재단"
                ]
            },
            {
                "title": "제3장 온라인 정토법당과 전법 시스템의 대전환",
                "hanja_header": "시공간의 제약을 넘어 전 세계 어디서나 연결되는 온라인 수행 도량",
                "quotes": [
                    "코로나19 팬데믹을 계기로 정토회는 전국 오프라인 법당 중심의 운영에서 온라인 정토불교대학 및 전법활동가 체제로 역사적 전환을 이루었습니다. 공간 유지에 들던 에너지를 온전히 수행과 전법, 사회 실천으로 회향한 혁신 사료입니다.",
                    "마이정토(MyJungto) 통합 플랫폼과 온라인 모둠 활동은 국내뿐만 아니라 북미, 유럽, 아시아·태평양 국제지부 도반들이 실시간으로 법문을 듣고 마음나누기를 함께하는 글로벌 수행 공동체의 기반이 되었습니다."
                ],
                "commentary": [
                    "[사료해설] 제2차 만일결사 출범과 함께 정립된 온라인 수행 공동체 규약, 전법활동가 교육 과정, 국제지부 운영 기록을 담고 있다.",
                    "[사료 색인] 온라인정토불교대학, 전법활동가, 마이정토, 마음나누기, 제2차만일결사"
                ]
            },
            {
                "title": "제4장 정토회 헌장과 정토행자 생활규범 원문",
                "hanja_header": "수행자의 본분을 지키며 세상의 희망이 되는 정토행자의 길",
                "quotes": [
                    "정토행자는 적게 먹고 적게 입고 적게 쓰는 소욕지족(少欲知足)의 삶을 실천하며, 남에게 대접받으려 하기보다 먼저 베풀고 봉사하는 자세로 살아갑니다.",
                    "회의와 의사결정은 대중의 지혜를 모으는 화합승가(和合僧伽)의 정신에 따르며, 개인의 유불리가 아니라 법(法)과 정토의 원칙에 비추어 결정하고 기꺼이 따릅니다."
                ],
                "commentary": [
                    "[사료해설] 정토회 정관, 만일결사 회향문, 대의원회 주요 결의문 원문을 대조본 형태로 수록하였다.",
                    "[사료 색인] 소욕지족, 화합승가, 정토회헌장, 대의원회"
                ]
            }
        ]
    },
    {
        "id": "vol3",
        "filename": "jungto_daejeon_vol3.pdf",
        "vol_num": "제3권",
        "title_ko": "정토대전 제3권 법문편",
        "title_hanja": "淨土大典 第三卷 法門篇",
        "subtitle": "즉문즉설과 수행 법문 · 삶 속에서 깨어나는 지혜의 문답",
        "accent": (0.48, 0.28, 0.12),  # Warm Amber / Ochre
        "chapters": [
            {
                "title": "제1장 즉문즉설의 원리 (卽問卽說 · 지금 여기에서 깨닫다)",
                "hanja_header": "질문 속에 이미 답이 있고, 내 마음을 볼 때 괴로움이 사라진다",
                "quotes": [
                    "질문자께서 남편 때문에, 자식 때문에, 직장 상사 때문에 못 살겠다고 말씀하시지만, 가만히 들여다보면 상대방이 내 뜻대로 되어주지 않아서 화가 나는 것입니다. '내 뜻대로 되어야 한다'는 그 고집을 딱 한 발짝만 내려놓아 보세요.",
                    "법문(法門)이란 멀리 있는 경전 글귀를 외우는 것이 아닙니다. 지금 내 마음이 왜 답답한지, 내가 무엇을 움켜쥐고 놓지 못하는지를 있는 그대로 자각(自覺)하는 순간, 그 자리에서 즉시 자유로워지는 것이 즉문즉설입니다."
                ],
                "commentary": [
                    "[법문해설] 법륜스님의 즉문즉설은 소크라테스의 산파술과 선불교의 조사선 문답, 초기불교 붓다의 대기설법(對機說法)을 현대인의 일상 언어로 구현한 수행 교육법이다.",
                    "[핵심 검색어] 즉문즉설, 대기설법, 자각, 내려놓음, 법륜스님, 수행법문"
                ]
            },
            {
                "title": "제2장 가족과 인간관계의 갈등 해법 (부부·부모·자녀)",
                "hanja_header": "사랑이라는 이름의 집착을 넘어 서로를 온전한 인격체로 존중하기",
                "quotes": [
                    "성인이 된 자녀는 더 이상 내가 간섭하고 통제할 대상이 아니라 독립된 인격체입니다. 스무 살이 넘었으면 정을 딱 떼고 손님 대하듯 존중해 주어야 부모도 편하고 자식도 자기 인생을 책임질 수 있습니다.",
                    "부부 사이에 갈등이 생길 때 '내가 옳다'는 생각을 내려놓고 '당신 입장에서는 그럴 수도 있겠네요'라고 인정하는 것이 수행의 시작입니다. 상대를 고치려 하지 말고 나의 반응을 바꾸는 것이 해탈의 길입니다."
                ],
                "commentary": [
                    "[법문해설] 지난 30년간 국내외 3,000회 이상의 즉문즉설 강연에서 가장 빈번하게 제기된 가족·인간관계 문답 중 핵심 사례 120선을 주제별로 엄선하여 정리하였다.",
                    "[핵심 검색어] 부부갈등, 자녀교육, 정떼기, 내가옳다, 마음공부"
                ]
            },
            {
                "title": "제3장 매일 아침 수행문과 108배 명상 지침",
                "hanja_header": "몸을 낮추어 아만을 꺾고, 호흡을 살피며 지금 여기에 깨어 있기",
                "quotes": [
                    "저는 오늘 어떤 경계에 부딪히더라도 화내지 않고 미워하지 않으며, 남의 말에 귀 기울이고 내 고집을 내려놓는 수행자가 되겠습니다. 모든 것이 내 마음에서 비롯됨을 알아 남을 탓하지 않겠습니다.",
                    "절을 할 때는 이마와 두 팔꿈치, 두 무릎이 바닥에 닿는 오체투지(五體投地)로써 내 안의 교만과 아집을 남김없이 내려놓습니다. 백팔배의 한 배 한 배마다 지나간 과거의 후회도, 오지 않은 미래의 불안도 아닌 오직 지금 이 호흡에 깨어 있습니다."
                ],
                "commentary": [
                    "[법문해설] 천일결사 정진 수행문 전문, 108배 참회문, 명상 수련(깨달음의장·나눔의장·명상수련) 핵심 지도 법문을 수록하였다.",
                    "[핵심 검색어] 천일결사 수행문, 108배, 오체투지, 깨달음의장, 명상수련"
                ]
            },
            {
                "title": "제4장 청년과 미래 세대를 위한 희망 법문",
                "hanja_header": "실패는 넘어지는 것이 아니라 다시 일어서지 않는 것이다",
                "quotes": [
                    "청년 여러분, 한 번 해보고 안 된다고 좌절할 필요가 없습니다. 안 되면 '아, 이 방법으로는 안 되는구나' 하고 데이터를 하나 얻은 것입니다. 열 번 시도해서 아홉 번 안 되면 아홉 가지 안 되는 법을 배운 것이니 다시 열한 번째를 가볍게 시도하면 됩니다.",
                    "남과 비교해서 우월감을 갖거나 열등감을 갖는 노예의 삶을 살지 마세요. 다람쥐는 다람쥐대로 온전하고 토끼는 토끼대로 온전하듯, 나 자신 그대로 온전하고 존귀한 존재임을 자각할 때 진정한 주인의 삶이 시작됩니다."
                ],
                "commentary": [
                    "[법문해설] 청년 정토회 및 청춘콘서트 주요 문답, 진로·취업·연애·자존감 회복에 관한 실천적 지침을 담았다.",
                    "[핵심 검색어] 청춘콘서트, 실패와도전, 자존감, 주인의삶, 청년정토회"
                ]
            }
        ]
    },
    {
        "id": "vol4",
        "filename": "jungto_daejeon_vol4.pdf",
        "vol_num": "제4권",
        "title_ko": "정토대전 제4권 해설·색인편",
        "title_hanja": "淨土大典 第四卷 解說·索引篇",
        "subtitle": "경전·사료·법문 종합 해제, 불교술어 사전 및 전권 통합 색인",
        "accent": (0.32, 0.22, 0.44),  # Noble Royal Purple
        "chapters": [
            {
                "title": "제1장 정토대전 전 4권 종합 해제 및 편찬 일리(凡例)",
                "hanja_header": "정토대전(淨土大典) 편찬 원칙과 원전 대조 기준",
                "quotes": [
                    "『정토대전』 전 4권은 초기불교 빠알리 니까야(Pāli Nikāya)와 한역 아함경, 대승불교 반야·화엄·법화·정토 경전, 한국 선불교 어록 및 정토회 30년 사료와 법문을 하나의 일관된 수행 체계로 집대성한 정토회의 표준 경전 총서입니다.",
                    "전자책(eBook) 판본은 종이책 초판(v1.0.0) 및 개정 정오표(v1.0.1)의 조판 면수(pageLabel)와 1:1로 대응하도록 설계되어, 온·오프라인 법회 및 불교대학 수업에서 동일한 쪽수로 참조할 수 있습니다."
                ],
                "commentary": [
                    "[편찬위원회] 본 제4권은 제1권~제3권의 경전 출전 대조표, 빠알리어·산스크리트어·한자 원어 표기 원칙, 그리고 정오표(Errata) 이력 관리를 포함한다.",
                    "[핵심 검색어] 정토대전 편찬위원회, 범례, 빠알리 니까야, 쪽수 대조, 정오표"
                ]
            },
            {
                "title": "제2장 핵심 불교·정토 용어 정밀 해설 사전 (가~하)",
                "hanja_header": "수행자가 반드시 알아야 할 100대 핵심 법수(法數)와 술어",
                "quotes": [
                    "【삼법인 (三法印, Tilakkhaṇa)】 불교와 비불교를 가르는 세 가지 근본 진리의 도장. ① 제행무상(諸行無常: 모든 형성된 것은 변한다), ② 제법무아(諸法無我: 고정불변하는 독자적 실체는 없다), ③ 열반적정(涅槃寂靜: 탐·진·치가 소멸한 자리가 곧 고요한 열반이다).",
                    "【육바라밀 (六波羅蜜, Ṣaṭ-pāramitā)】 대승 보살이 피안(열반)으로 건너가기 위해 실천하는 여섯 가지 완성의 덕목. ① 보시(布施), ② 지계(持戒), ③ 인욕(忍辱), ④ 정진(精進), ⑤ 선정(禪定), ⑥ 지혜(般若)."
                ],
                "commentary": [
                    "[사전 활용법] 뷰어 우측 상단의 [본문 검색] 창에 한자 또는 한글 용어(예: 삼법인, 육바라밀, 연기법, 오온)를 입력하면 본 용어 사전과 제1권~제3권의 해당 본문 위치를 즉시 교차 탐색할 수 있습니다.",
                    "[핵심 검색어] 삼법인, 제행무상, 제법무아, 열반적정, 육바라밀, 보시, 반야"
                ]
            },
            {
                "title": "제3장 경전 출전 대조표 및 연표 (BC 6세기 ~ 2026년)",
                "hanja_header": "붓다의 성도(成道)에서 제2차 만일결사에 이르는 불교사 연표",
                "quotes": [
                    "• 기원전 6세기: 고타마 싯다르타 보리수 아래에서 성도(成道), 녹야원 초전법륜 및 45년간 전법 교화.",
                    "• 기원후 2세기: 용수(Nāgārjuna) 보살 『중론(中論)』 저술, 대승 공(空)·중도 사상 확립.",
                    "• 661년~686년: 신라 원효대사 일심(一心)·화쟁(和諍) 사상 및 대중 교화 실천.",
                    "• 1993년~2022년: 정토회 제1차 만일결사(10차 천일결사) 성만 회향 및 2023년 제2차 만일결사 입재."
                ],
                "commentary": [
                    "[연표 해설] 인도·중국·한국 불교사의 주요 분기점과 현대 참여불교(Engaged Buddhism) 및 정토회 사료를 입체적으로 연결하였다.",
                    "[핵심 검색어] 초전법륜, 용수보살, 중론, 원효대사, 화쟁사상, 참여불교"
                ]
            },
            {
                "title": "제4장 전권 통합 색인 및 디지털 판권·보안 안내",
                "hanja_header": "정토대전 e북(전자책) 이용 규약 및 저작권 보호 고지",
                "quotes": [
                    "본 『정토대전』 전자책(eBook)은 마이정토(MyJungto) 정식 구매 회원에게만 부여되는 1인 전용 열람 라이선스(Entitlement) 저작물입니다. 화면에는 구매 회원의 고유 식별코드(예: JT-7K4M)와 열람 일시가 동적 워터마크로 표시됩니다.",
                    "전자상거래 등에서의 소비자보호에 관한 법률 제17조 제2항 제5호 및 문화체육관광부 전자출판물 표준약관에 의거하여, 구매 후 전자책 뷰어를 최초 1회 이상 열람 개시(ReadingStart)한 이후에는 단순 변심에 의한 청약철회(환불)가 제한됩니다."
                ],
                "commentary": [
                    "[판권 정보] 발행처: 재단법인 정토회 출판국 | 디지털 플랫폼: 시스템국 마이정토 e북 서비스 | 판본: v1.0.1 (2026-10-23 정오표 반영본)",
                    "[핵심 검색어] 라이선스, 워터마크, 청약철회, ReadingStart, 전자상거래법, 정토회 출판국"
                ]
            }
        ]
    }
]


def draw_wrapped_text(page, text, x, y, max_width, fontsize, line_height, color=(0.15, 0.14, 0.13)):
    """Draw Korean/Hanja text wrapped cleanly to max_width using AppleMyungjo."""
    font = fitz.Font(fontfile=FONT_MYUNGJO)
    words = text.split(" ")
    lines = []
    current_line = ""
    for word in words:
        test_line = word if not current_line else current_line + " " + word
        if font.text_length(test_line, fontsize=fontsize) <= max_width:
            current_line = test_line
        else:
            if current_line:
                lines.append(current_line)
            # If a single token is wider than max_width, split character by character
            if font.text_length(word, fontsize=fontsize) > max_width:
                sub = ""
                for ch in word:
                    if font.text_length(sub + ch, fontsize=fontsize) <= max_width:
                        sub += ch
                    else:
                        lines.append(sub)
                        sub = ch
                current_line = sub
            else:
                current_line = word
    if current_line:
        lines.append(current_line)

    cur_y = y
    for line in lines:
        page.insert_text((x, cur_y), line, fontname="myungjo", fontsize=fontsize, color=color)
        cur_y += line_height
    return cur_y


def build_volume_pdf(vol, is_preview=False):
    doc = fitz.open()
    W, H = 440, 620  # Clean book ratio (approx A5+)
    accent = vol["accent"]
    toc = []

    # --- PAGE 1: COVER PAGE (Roman i) ---
    p_cover = doc.new_page(width=W, height=H)
    p_cover.insert_font(fontname="myungjo", fontfile=FONT_MYUNGJO)
    # Outer frame
    p_cover.draw_rect(fitz.Rect(24, 24, W - 24, H - 24), color=accent, width=2.0)
    p_cover.draw_rect(fitz.Rect(30, 30, W - 30, H - 30), color=accent, width=0.6)
    # Top banner
    p_cover.draw_rect(fitz.Rect(50, 70, W - 50, 118), color=accent, fill=accent)
    p_cover.insert_text((68, 99), "재단법인 정토회 표준 경전·사료·법문 총서", fontname="myungjo", fontsize=11.5, color=(1, 1, 1))

    # Main title
    p_cover.insert_text((60, 185), "정 토 대 전", fontname="myungjo", fontsize=34, color=accent)
    p_cover.insert_text((62, 222), vol["title_hanja"], fontname="myungjo", fontsize=15, color=(0.3, 0.28, 0.25))
    p_cover.draw_line(fitz.Point(60, 242), fitz.Point(W - 60, 242), color=accent, width=1.2)

    # Volume badge & subtitle
    badge_title = vol["title_ko"] + (" [무료 맛보기 샘플]" if is_preview else " [정식 전자책 v1.0.1]")
    p_cover.insert_text((60, 275), badge_title, fontname="myungjo", fontsize=13.5, color=(0.12, 0.12, 0.12))
    draw_wrapped_text(p_cover, vol["subtitle"], 60, 305, W - 120, fontsize=11, line_height=18, color=(0.35, 0.33, 0.30))

    # Box summary of chapters
    p_cover.draw_rect(fitz.Rect(55, 355, W - 55, 495), color=(0.78, 0.75, 0.70), fill=(0.98, 0.97, 0.95), width=0.7)
    p_cover.insert_text((72, 380), "수록 목차 안내 (Contents Overview)", fontname="myungjo", fontsize=10.5, color=accent)
    cy = 404
    for idx, ch in enumerate(vol["chapters"]):
        p_cover.insert_text((72, cy), f"• {ch['title']}", fontname="myungjo", fontsize=9.8, color=(0.2, 0.2, 0.2))
        cy += 21

    # Footer info
    p_cover.insert_text((60, H - 62), "발행처: 재단법인 정토회 출판국 · 시스템국 마이정토 eBook", fontname="myungjo", fontsize=9.5, color=(0.4, 0.4, 0.4))
    p_cover.insert_text((W - 80, H - 40), "- i -", fontname="myungjo", fontsize=9.5, color=(0.45, 0.45, 0.45))
    toc.append([1, f"표지 · {vol['title_ko']}", 1])

    # --- PAGE 2: PREFACE & EDITORIAL NOTES (Roman ii) ---
    p_pref = doc.new_page(width=W, height=H)
    p_pref.insert_font(fontname="myungjo", fontfile=FONT_MYUNGJO)
    p_pref.draw_line(fitz.Point(45, 48), fitz.Point(W - 45, 48), color=accent, width=0.8)
    p_pref.insert_text((45, 40), f"{vol['title_ko']} · 간행사 및 일러두기 (凡例)", fontname="myungjo", fontsize=9.2, color=accent)

    p_pref.insert_text((45, 85), "간 행 사 (刊行辭) · 일러두기", fontname="myungjo", fontsize=17, color=accent)
    y = 120
    preface_paragraphs = [
        "1. 『정토대전(淨土大典)』은 부처님의 근본 가르침과 대승 경전의 지혜, 그리고 정토회 30년 만일결사의 수행·전법·사회실천 사료를 집대성한 정토행자의 표준 지침서입니다.",
        "2. 본 디지털 전자책(eBook)은 고해상도 Retina/HiDPI 디스플레이에서도 한자(漢字)와 한글 본문이 인쇄본 수준으로 선명하게 렌더링되도록 백터 서체(AppleMyungjo Identity-H)를 내장하였습니다.",
        "3. 본문 내 주요 경전 구절과 용어는 좌측 [목차] 탭 및 상단 [본문 검색] 기능을 통해 즉시 탐색할 수 있으며, 회원이 작성한 [북마크]와 [개인 메모]는 권호별로 안전하게 보존됩니다.",
        "4. 서문 영역은 로마자 쪽수(i, ii)를, 본문 영역은 아라비아 숫자 쪽수(1, 2, 3...)를 사용하여 종이책 판본과 동일한 면수(PageLabel) 체계를 지원합니다."
    ]
    for para in preface_paragraphs:
        y = draw_wrapped_text(p_pref, para, 45, y, W - 90, fontsize=10.5, line_height=18.5)
        y += 12

    p_pref.draw_rect(fitz.Rect(45, y + 6, W - 45, y + 96), color=accent, fill=(0.96, 0.97, 0.96), width=0.7)
    p_pref.insert_text((60, y + 28), "【검수 확인용 핵심 검색 키워드 안내】", fontname="myungjo", fontsize=10.2, color=accent)
    draw_wrapped_text(
        p_pref,
        "상단 검색창에 '연기법', '사성제', '반야심경', '금강경', '만일결사', '즉문즉설', '삼법인', '청약철회', '정토행자' 등을 입력하여 페이지 점프와 본문 하이라이트를 즉시 테스트해 보세요.",
        60, y + 48, W - 120, fontsize=9.5, line_height=16.5, color=(0.2, 0.25, 0.22)
    )
    p_pref.insert_text((W // 2 - 14, H - 34), "- ii -", fontname="myungjo", fontsize=9.5, color=(0.45, 0.45, 0.45))
    toc.append([1, "간행사 및 일러두기 (凡例)", 2])

    # --- MAIN CHAPTER PAGES (Arabic 1, 2, ...) ---
    chapters_to_render = vol["chapters"][:1] if is_preview else vol["chapters"]
    arabic_page = 1

    for c_idx, ch in enumerate(chapters_to_render):
        # Each chapter gets 2 rich pages (Page A: Scripture/Primary Text, Page B: Commentary & Study Notes)
        # Page A: Primary Text
        pa = doc.new_page(width=W, height=H)
        pa.insert_font(fontname="myungjo", fontfile=FONT_MYUNGJO)
        pdf_page_num_a = len(doc)
        toc.append([1, ch["title"], pdf_page_num_a])
        toc.append([2, f"원문 및 경전 독송 ({ch['title'][:4]})", pdf_page_num_a])

        # Running header
        pa.draw_line(fitz.Point(45, 48), fitz.Point(W - 45, 48), color=accent, width=0.7)
        pa.insert_text((45, 40), f"{vol['title_ko']}  |  {ch['title']}", fontname="myungjo", fontsize=8.8, color=(0.4, 0.4, 0.4))

        # Chapter Banner
        pa.draw_rect(fitz.Rect(45, 62, W - 45, 114), color=accent, fill=(0.95, 0.96, 0.97), width=0.9)
        pa.insert_text((58, 84), ch["title"], fontname="myungjo", fontsize=14.5, color=accent)
        pa.insert_text((58, 103), ch["hanja_header"], fontname="myungjo", fontsize=9.8, color=(0.3, 0.3, 0.3))

        y = 140
        for q_idx, quote in enumerate(ch["quotes"], start=1):
            pa.insert_text((45, y), f"제{q_idx}절 경전·본문 (正文 {c_idx+1}-{q_idx})", fontname="myungjo", fontsize=11, color=accent)
            y += 20
            y = draw_wrapped_text(pa, quote, 52, y, W - 97, fontsize=10.8, line_height=19.5, color=(0.1, 0.1, 0.1))
            y += 16

        # Footer with printed Arabic page number
        pa.draw_line(fitz.Point(45, H - 52), fitz.Point(W - 45, H - 52), color=(0.82, 0.82, 0.82), width=0.5)
        pa.insert_text((45, H - 36), f"정토대전 {vol['vol_num']} (판본 v1.0.1)", fontname="myungjo", fontsize=8.5, color=(0.5, 0.5, 0.5))
        pa.insert_text((W - 85, H - 36), f"쪽수 {arabic_page}", fontname="myungjo", fontsize=9.5, color=accent)
        arabic_page += 1

        # Page B: Commentary & Practice Notes
        pb = doc.new_page(width=W, height=H)
        pb.insert_font(fontname="myungjo", fontfile=FONT_MYUNGJO)
        pdf_page_num_b = len(doc)
        toc.append([2, f"정토해설 및 수행 지침 ({ch['title'][:4]})", pdf_page_num_b])

        pb.draw_line(fitz.Point(45, 48), fitz.Point(W - 45, 48), color=accent, width=0.7)
        pb.insert_text((45, 40), f"{vol['title_ko']}  |  해설 및 수행 지침", fontname="myungjo", fontsize=8.8, color=(0.4, 0.4, 0.4))

        pb.insert_text((45, 80), f"■ {ch['title']} — 심층 해설 및 마음나누기", fontname="myungjo", fontsize=13, color=accent)
        y = 112
        for comm in ch["commentary"]:
            y = draw_wrapped_text(pb, comm, 45, y, W - 90, fontsize=10.5, line_height=19.0, color=(0.16, 0.16, 0.16))
            y += 16

        # Practice reflection box
        pb.draw_rect(fitz.Rect(45, y + 6, W - 45, y + 135), color=accent, fill=(0.98, 0.98, 0.96), width=0.8)
        pb.insert_text((60, y + 28), "【수행자 점검 및 마음나누기 질문】", fontname="myungjo", fontsize=10.5, color=accent)
        q1 = f"1. 오늘 독송한 '{ch['title']}'의 가르침을 내 일상 속 가족·도반과의 관계에 적용한다면 무엇을 먼저 내려놓아야 합니까?"
        q2 = "2. 뷰어 좌측 [북마크/메모] 탭을 열어 오늘 마음에 와닿은 구절과 나의 깨달음을 기록해 보십시오."
        ry = draw_wrapped_text(pb, q1, 60, y + 50, W - 120, fontsize=9.6, line_height=16.5, color=(0.25, 0.25, 0.25))
        draw_wrapped_text(pb, q2, 60, ry + 8, W - 120, fontsize=9.6, line_height=16.5, color=(0.25, 0.25, 0.25))

        if is_preview:
            pb.draw_rect(fitz.Rect(45, H - 125, W - 45, H - 65), color=(0.75, 0.25, 0.15), fill=(1.0, 0.96, 0.95), width=1.0)
            draw_wrapped_text(
                pb,
                "[무료 맛보기 샘플 안내] 무료 미리보기 본문은 제1장까지만 제공됩니다. 전 4권 전체 경전·사료·법문·색인 열람은 정식 구매 후 [내 서재]에서 이용하실 수 있습니다.",
                58, H - 106, W - 116, fontsize=9.2, line_height=15.0, color=(0.65, 0.15, 0.10)
            )

        pb.draw_line(fitz.Point(45, H - 52), fitz.Point(W - 45, H - 52), color=(0.82, 0.82, 0.82), width=0.5)
        pb.insert_text((45, H - 36), f"정토대전 {vol['vol_num']} (판본 v1.0.1)", fontname="myungjo", fontsize=8.5, color=(0.5, 0.5, 0.5))
        pb.insert_text((W - 85, H - 36), f"쪽수 {arabic_page}", fontname="myungjo", fontsize=9.5, color=accent)
        arabic_page += 1

    # Set TOC and PageLabels (Pages 0..1 -> Roman i, ii; Pages 2..N -> Arabic 1..N)
    doc.set_toc(toc)
    doc.set_page_labels([
        {"startpage": 0, "prefix": "", "style": "r", "firstpagenum": 1},
        {"startpage": 2, "prefix": "", "style": "D", "firstpagenum": 1},
    ])
    doc.set_metadata({
        "title": vol["title_ko"] + (" (맛보기 샘플)" if is_preview else ""),
        "author": "재단법인 정토회 정토대전 편찬위원회",
        "subject": vol["subtitle"],
        "keywords": "정토대전, 정토회, 법륜스님, 연기법, 사성제, 반야심경, 금강경, 만일결사, 즉문즉설",
        "creator": "MyJungto eBook Publishing System v1.0.1"
    })
    doc.subset_fonts()
    out_name = "jungto_daejeon_preview.pdf" if is_preview else vol["filename"]
    out_path = os.path.join(OUT_DIR, out_name)
    doc.save(out_path, garbage=4, deflate=True)
    doc.close()
    print(f"Generated: {out_path} ({os.path.getsize(out_path) // 1024} KB)")


if __name__ == "__main__":
    for v in VOLUMES:
        build_volume_pdf(v, is_preview=False)
    build_volume_pdf(VOLUMES[0], is_preview=True)

    # Also copy existing 69-page Korean Jungto PDF for heavy multi-page stress testing
    src_69p = "/Users/jeongseongchae/dev/jts/docs/jts_bubhoe_V1_20231204.pdf"
    if os.path.exists(src_69p):
        dst_69p = os.path.join(OUT_DIR, "jts_bubhoe_69p.pdf")
        shutil.copyfile(src_69p, dst_69p)
        print(f"Copied 69-page stress-test PDF: {dst_69p}")
