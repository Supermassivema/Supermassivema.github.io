---
# ────────────────────────────────────────────────────────────────
#  작가 프로필 틀 (ARTIST PROFILE SKELETON)
#  · 이 파일을 복사해서  _artists/<slug>.md  로 저장하면 작가 상세 페이지가 생성됨
#  · «...» 로 표시된 곳을 채우고, 모르면 빈 문자열("")로 두면 그 항목은 자동 생략됨
#  · 중요: 아래 name 값은 작품 파일(_artworks/*.md)의 artist 값과 "글자까지 정확히" 같아야
#         작가 페이지에 그 작품이 표시됨. (전시 연결 featured_artist 값도 동일)
# ────────────────────────────────────────────────────────────────
layout: artist
brand: gallery

# ── 표시 이름 ──
title: "«Artist Name» «작가명»"      # 브라우저 탭/제목 (영문 + 한글)
name: "«Artist Name»"                 # 영문 표기 — 작품/전시 연결의 기준 키 (정확히 일치 필요)
name_kr: "«작가명»"                    # 한글 표기 (없으면 "")
slug: "«artist-name»"                 # URL 슬러그 (소문자-하이픈). 페이지: /gallery/artists/<slug>/

# ── 분류/기본 정보 (모르면 "") ──
medium: "«Painting»"                  # 주 매체 (영문)
medium_kr: "«회화»"                    # 주 매체 (한글)
nationality: "«Korean»"               # 국적
location: "«Seoul, Korea»"            # 활동 지역
born: "«1970»"                        # 출생 연도
education: "«Hongik University, BFA»" # 학력 한 줄

# ── 대표 이미지 ──
featured_image: "/assets/images/work/«ArtistFolder»/profile.jpg"  # 프로필 사진 경로

# ── 링크 (없으면 "") ──
website: "«example.com»"              # 개인 웹사이트 (http 없이 도메인만)
instagram: "«@handle»"               # 인스타그램 핸들

# ── 요약/철학 (영문 + 한글 쌍) ──
description: "«한 문장 SEO 설명 — 검색결과에 노출되는 120~155자 요약»"
bio_short: "«2~3문장 영문 소개»"
bio_short_kr: "«2~3문장 한글 소개»"
philosophy: "«작가노트/작업 철학 영문»"
philosophy_kr: "«작가노트/작업 철학 한글»"

# ── 노출 ──
listed: true                          # 작가 목록(/gallery/artists/)에 표시 여부. false/생략 = 페이지는 있어도 목록에 안 뜸(비공개 초안)
featured: true                        # 홈 3×3 그리드 노출 여부 (상위 6명만). true/false
---

## Biography

«영문 전체 약력 — 문단으로. 학력·활동·소속 등.»

### Solo Exhibitions

- «2023 — Title, Venue, City»
- «...»

### Group Exhibitions

- «2022 — Title, Venue, City»
- «...»

## 작가 소개

«한글 전체 약력 — 문단으로.»

### 개인전

- «2023 — 전시명, 장소, 도시»
- «...»

### 그룹전

- «2022 — 전시명, 장소, 도시»
- «...»
