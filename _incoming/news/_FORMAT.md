# 미술 뉴스 자료 형식 (클로드 코워크 → 공유폴더)

클로드 코워크는 **뉴스 1건당 마크다운 파일 1개**를 이 폴더(`_incoming/news/`)에 넣는다.
파일명: `<YYYY-MM-DD>-<영문-슬러그>.md`  (앞에 밑줄 `_` 금지)
아래 형식을 그대로 채운다. 채워지면 사이트 담당(Claude Code)이 체크해서
`_news/` 초안(`published: false`)으로 변환한다.

## 파일 형식 (이대로 복사해서 채우기)

```markdown
---
region: global                 # 필수: global | australia | korea
title: "English headline"      # 필수: 영문 제목
title_kr: "한글 제목"           # 필수: 한글 제목
date: 2026-08-13               # 필수: 뉴스 날짜 YYYY-MM-DD
description: "One-line English summary for the card."   # 필수: 카드/검색용 한 줄
description_kr: "카드·검색용 한 줄 한글 요약."           # 필수
source_name: "The Art Newspaper"      # 필수: 출처 매체명
source_url: "https://www.example.com/article"   # 필수: 원문 링크
image: ""                      # 선택: 자체 확보한(저작권 안전) 이미지 경로. 없으면 비움 → 지역색 배경 자동
featured: false                # 선택: 목록 최상단 대표기사로 올릴지
---
English summary in your OWN words — 3 to 5 sentences. Do NOT copy sentences from the source.

---

한글 요약 3~5문장. 원문을 그대로 옮기지 말고 직접 요약할 것.
```

## 규칙 (반드시)
1. **저작권**: 원문 문장·사진을 복사하지 말 것. 반드시 자기 문장 요약 + `source_url` 출처 표기.
2. **필수 필드**: region, title, title_kr, date, description(+_kr), source_name, source_url.
   하나라도 비면 담당이 반려한다.
3. **region 값**은 정확히 `global` / `australia` / `korea` 중 하나 (소문자).
4. **사실만**: 출처에 있는 날짜·이름·전시명만. 불확실하면 넣지 말 것.
5. 이미지가 있으면 `_incoming/news/` 에 함께 넣고 `image:` 에 파일명만 적어도 됨(담당이 경로 정리).

## 처리 결과 (담당이 함)
- 검증 통과 → `_news/<날짜>-<슬러그>.md` 로 `published: false` 붙여 생성.
- 원본은 `_incoming/news/_processed/` 로 이동(중복 방지).
- 사용자에게 "무엇을 초안으로 만들었는지" 보고 → 사용자가 승인 시 라이브 게시.
