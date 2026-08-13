---
name: news-update
description: Curate global/Australia/Korea art news into DRAFT news posts (published:false) for approval. Use when the user says "뉴스 업데이트", "미술 뉴스 올려줘", /news-update, or when run on the Mon/Wed/Fri schedule.
---

# 미술 뉴스 자동 큐레이션 (초안 생성)

전 세계 · 호주 · 한국 현대미술 뉴스를 웹에서 찾아, **저작권 안전한 요약 + 출처 링크**로
`_news/` 에 **초안(`published: false`)** 글을 만든다. 라이브 게시는 사용자가 승인(플래그 변경)해야만 된다.

## 불변 규칙 (반드시 지킬 것)
1. **자동 라이브 게시 금지.** 모든 새 글은 반드시 `published: false` 로 만든다. 사용자가 검토 후
   `published: true` 로 바꿔야 사이트에 노출된다.
2. **저작권**: 원문을 복붙하지 말 것. 자기 문장으로 **요약**(3~5문장)하고 `source_name` + `source_url` 로
   원문 출처를 반드시 표기한다. 사진은 원문에서 가져오지 말고, 이미지가 없으면 `image` 를 비우거나
   기존 플레이스홀더(`/assets/images/news/placeholder.jpg`)를 쓴다.
3. **사실 확인**: 날짜·이름·전시명은 출처에 있는 그대로만. 불확실하면 쓰지 말 것.
4. **틀 준수**: `_templates/news-post.md` 의 front matter 필드를 그대로 사용.

## 지역 로테이션 (주 3회)
- **월요일 → `region: global`** (해외 주요 미술계 뉴스: 비엔날레, 미술관, 경매, 주요 작가)
- **수요일 → `region: australia`** (호주 미술: 갤러리, 수상, 지역/NSW 소식 우대)
- **금요일 → `region: korea`** (한국 미술: 작가, 전시, K-아트 국제 진출)

## 절차
1. **검색**: 해당 요일 지역의 최근 7일 내 미술 뉴스를 WebSearch 로 2~4건 찾는다.
   신뢰 매체 우선 (예: The Art Newspaper, Artnet, ArtAsiaPacific, The Guardian Art, 국내 주요 매체 등).
2. **선별**: 갤러리 톤(동시대 미술, 한국·호주 연결)에 맞는 **1건** 을 고른다. (하루 1건이 기본)
3. **작성**: `_news/<YYYY-MM-DD>-<slug>.md` 생성. 아래 형식:
   - `title` (영문), `title_kr` (한글), `date` (오늘), `region`, `category: News`
   - `description` / `description_kr` (한 줄 요약)
   - `source_name`, `source_url`
   - `image`: 확실한 자체 이미지 없으면 비워둠 (레이아웃이 처리)
   - `published: false`   ← **필수**
   - 본문: 영문 요약 3~5문장 → `---` → 한글 요약 3~5문장
4. **커밋**: `git checkout -b news/auto-<날짜>` (또는 main 에 published:false 로) 후 커밋·푸시.
   > `published: false` 라 라이브엔 안 뜨므로 main 커밋도 안전. 브랜치/PR 방식이 더 좋으면 그렇게.
5. **알림**: 무엇을 만들었는지(제목·지역·출처·초안 경로) 사용자에게 보고하고 승인 요청.

## 사용자 승인 후 게시 방법 (안내용)
- 초안 파일에서 `published: false` → `published: true` 로 바꾸고 커밋·푸시하면 라이브 노출.
- 이미지가 필요하면 `assets/images/news/` 에 넣고 `image:` 경로만 채우면 됨.

## 수동 실행
- `/news-update` 또는 "미술 뉴스 올려줘" → 오늘 요일 기준 지역으로 위 절차 실행.
- 특정 지역 지정 가능: "글로벌 미술 뉴스 초안 만들어줘" → `region: global`.
