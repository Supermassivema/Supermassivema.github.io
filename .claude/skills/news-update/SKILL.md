---
name: news-update
description: Check the _incoming/news/ shared folder and convert dropped items into DRAFT news posts (published:false) for approval. Use when the user says "뉴스 체크해줘", "미술 뉴스 반영해줘", /news-update, or on the Mon/Wed/Fri schedule.
---

# 미술 뉴스 체크 · 변환 (공유폴더 → 초안)

**클로드 코워크**가 `_incoming/news/` 공유폴더에 넣어둔 뉴스 자료를 체크해서,
`_news/` 에 **초안(`published: false`)** 글로 변환한다. 라이브 게시는 사용자 승인 후에만.

## 입력 위치
- 공유폴더: `_incoming/news/`  (형식: `_incoming/news/_FORMAT.md` 참고)
  - 뉴스 1건 = 마크다운 파일 1개 (`<YYYY-MM-DD>-<slug>.md`)
  - 이미지가 함께 있을 수 있음
- 처리 완료본 보관: `_incoming/news/_processed/`

## 불변 규칙 (반드시 지킬 것)
1. **자동 라이브 게시 금지.** 변환된 모든 글은 `published: false`. 사용자가 검토 후
   `published: true` 로 바꿔야 노출된다.
2. **저작권**: 원문 복붙 금지. 자료의 요약문을 쓰되, 복사된 문장이 보이면 자기 표현으로 고친다.
   반드시 `source_name` + `source_url` 유지.
3. **필수 필드 검증**: region(global/australia/korea), title, title_kr, date,
   description, description_kr, source_name, source_url. 하나라도 없으면 **변환하지 말고 반려 보고**.
4. **날짜·이름·전시명**은 자료에 있는 그대로만. 지어내지 말 것.
5. **틀 준수**: `_templates/news-post.md` 필드 사용.

## 절차 (체크 실행 시)
1. **스캔**: `_incoming/news/` 안의 `.md` 파일 목록을 본다. **`_`(밑줄)로 시작하는 파일은 모두 제외**
   (`_FORMAT.md`, `README.md`, `_briefing-*.md` 등)하고 `_processed/` 폴더도 제외.
   `[TEST]` 등 명백한 테스트/비뉴스 콘텐츠도 변환하지 말고 건너뛴다. 처리할 게 없으면 "새 자료 없음" 보고 후 종료.
2. 각 파일마다:
   a. front matter 를 읽고 **필수 필드 검증**. 빠지면 그 파일은 건너뛰고 반려 사유 기록.
   b. `_news/<YYYY-MM-DD>-<slug>.md` 생성:
      - 자료의 front matter 그대로 + `category: News` + **`published: false`** 추가.
      - 본문(영문 요약 → `---` → 한글 요약) 복사. 복사문장 있으면 다듬기.
      - 이미지가 있으면 `assets/images/news/` 로 옮기고 `image:` 경로를 그에 맞게 수정.
        (이미지 없으면 `image:` 는 비워둠 → 레이아웃이 지역색 배경 자동 처리)
   c. 원본을 `_incoming/news/_processed/` 로 이동.
3. **가벼운 검증**: 생성한 각 파일의 **YAML front matter 파싱만** 확인한다
   (`ruby -ryaml -e 'YAML.load_file(ARGV[0])' <file>` 또는 `python3 -c "import yaml,sys;yaml.safe_load(open(sys.argv[1]).read().split('---')[1])" <file>`).
   **`bundle install` 이나 `jekyll build` 를 실행하지 말 것** — 클라우드 환경엔 젬이 없어 시간만 낭비된다.
   YAML 이 안 열리면 그 파일은 되돌리고 반려한다.
4. **커밋**: `published: false` 라 라이브 노출 안 되므로 main 에 커밋·푸시해도 안전.
   (원하면 `news/auto-<날짜>` 브랜치 + PR 로 승인받는 방식도 가능.)
5. **보고**: 만든 초안(제목·지역·출처)과 반려 항목을 사용자에게 보고, 승인 요청.

## 사용자 승인 후 게시
- 초안 파일에서 `published: false` → `published: true` 로 바꾸고 커밋·푸시하면 라이브.
- "그 뉴스 게시해줘" 라고 하면 담당이 플래그를 바꿔 반영.

## 지역 분류 (뉴스 레이아웃 탭)
- `global` (해외) · `australia` (호주) · `korea` (한국) — 뉴스 페이지에서 색상 배지·필터로 표시.
