# 미술 뉴스 공유폴더 (`_incoming/news/`)

클로드 코워크 ↔ 사이트(Claude Code) 사이의 **뉴스 자료 전달 폴더**입니다.

## 흐름
1. **클로드 코워크**가 뉴스 1건 = 파일 1개를 `_FORMAT.md` 형식대로 이 폴더에 넣는다.
   (파일명 `<YYYY-MM-DD>-<영문슬러그>.md`, 이미지 있으면 같이)
2. **사이트 담당(Claude Code)** 이 이 폴더를 체크한다 → 검증 후
   `_news/` 에 **초안(`published: false`)** 으로 변환.
3. 원본은 `_processed/` 로 이동, 사용자에게 보고.
4. 사용자가 승인하면 `published: true` 로 바꿔 라이브 게시.

## 체크 실행 방법
- 사용자가 **"뉴스 체크해줘"** / `/news-update` 라고 하면 담당이 이 폴더를 스캔·변환.
- (선택) GitHub 계정 연결 후 월·수·금 클라우드 예약으로 자동 체크 가능.

## 이 폴더 위치 (공유용)
`C:\Users\KKL\OneDrive\Desktop\Claude\Supermassivema.github.io\_incoming\news\`
→ OneDrive 폴더이므로 클로드 코워크와 **공유** 설정하면 됩니다.

> 이 폴더는 Jekyll 빌드에서 제외됩니다(`_incoming/` exclude). 라이브 사이트엔 노출 안 됨.
