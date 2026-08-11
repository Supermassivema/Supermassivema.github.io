---
# ────────────────────────────────────────────────────────────────
#  작품 틀 (ARTWORK SKELETON)
#  · 작품 1점당 파일 1개.  _artworks/<slug>-work-001.md  형식으로 저장
#  · artist 값은 반드시 해당 작가 _artists/<slug>.md 의 name 값과 "정확히" 일치
#  · 모르는 값은 "" 로 두면 페이지에서 자동 생략됨
# ────────────────────────────────────────────────────────────────
layout: artwork
artist: "«Artist Name»"               # 작가 name 과 정확히 일치 (이 값으로 작가↔작품 연결)

title: "«작품 제목»"                    # 없으면 "" (Untitled 처리)
year: "«2024»"                         # 제작 연도
medium: "«Oil on canvas»"             # 재료/기법
dimensions: "«116.8 x 91.0 cm»"       # 크기
image: "/assets/images/work/«ArtistFolder»/«artist»-work-001.jpg"  # 작품 이미지 경로

status: "available"                    # available / sold / reserved / not-for-sale
price: "Contact for price"             # 가격 또는 "Contact for price"
description: "«작품 설명 (선택)»"

featured: true                         # 대표작 노출 여부
---
