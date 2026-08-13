---
# ────────────────────────────────────────────────────────────────
#  뉴스 글 틀 (NEWS POST SKELETON)
#  · 이 파일을 복사해서  _news/<slug>.md  로 저장하면 /news/<slug>/ 글이 생성됨
#  · 짧은 글(200~400단어)에 최적화 — 이미지 1장 + 몇 줄이면 완성됨
#  · «...» 를 채우고, 선택 항목은 비우거나 지워도 됨
# ────────────────────────────────────────────────────────────────
title: "«English headline»"          # 영문 제목 (필수)
title_kr: "«한글 제목»"                # 한글 제목 (선택)
date: 2026-01-01                      # 발행일 YYYY-MM-DD (필수)
region: global                        # global · australia · korea 중 하나 (필수) — 뉴스 지역 분류 탭
category: News                        # News · Exhibition · Event · Artist · Press · Announcement (필수)
image: /assets/images/news/«slug».jpg # 대표 이미지 1장 (필수) — assets/images/news/ 에 넣기
description: "«One-line summary for card & search.»"   # 선택 (없으면 본문서 자동 발췌)
description_kr: "«카드·검색용 한 줄 요약.»"              # 선택
featured: false                       # 목록 상단 Featured로 올릴지 (최신 featured 1건만 노출)
source_name: ""                       # (미술 뉴스일 때) 출처 매체명 — 예: "The Art Newspaper"
source_url: ""                        # (미술 뉴스일 때) 원문 링크 — 저작권 위해 요약+출처표기 원칙

# ── 관련 항목 연결 (선택, 있으면 양쪽에 상호 링크 자동 생성) ──
related_artists: []                   # 예: ["Min Hea Jung Soo"] — 작가 name 과 일치
related_exhibition: ""                # 예: "min-hea-jung-soo-solo" — 전시 파일 slug
related_artworks: []                  # 예: ["min-hea-jung-soo-work-1"] — 작품 slug

# ── 추가 이미지 갤러리 (선택) ──
gallery: []                           # 예: [/assets/images/news/a.jpg, /assets/images/news/b.jpg]
---
«영문 본문 — 200~400단어. 마크다운으로 자유롭게. 짧아도 됩니다.»

---

«한글 본문 — 위 영문 아래에 구분선과 함께 표시됩니다. (선택: 영문만 써도 됨)»
