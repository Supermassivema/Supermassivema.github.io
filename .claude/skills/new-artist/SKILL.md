---
name: new-artist
description: Process a dropped artist folder in _incoming/ into published artist + artwork pages using the saved templates. Use when the user says things like "«이름» 작가 자료 반영해줘", "새 작가 올려줘", or /new-artist «name».
---

# 새 작가 / 작품 자동 반영 절차

`_incoming/<ArtistName>/` 에 올라온 원본 자료를 읽어, `_templates/` 의 틀에 맞춰
작가 페이지와 작품 페이지를 생성한다. **틀을 벗어나지 말 것.**

## 입력 위치
- 자료 폴더: `_incoming/<ArtistName>/`
  - `info.md` — 채워진 정보 양식 (`_incoming/_form.md` 기반)
  - `profile.*` — 프로필 사진
  - 작품 이미지 여러 개 (파일명 순서 = 작품 순서)
- 틀: `_templates/artist-profile.md`, `_templates/artwork-item.md`

## 불변 규칙 (반드시 지킬 것)
1. **작품의 `artist:` = 작가의 `name:` 글자까지 정확히 동일.** 이게 틀리면 작가 페이지에 작품이 안 뜬다.
   (`_layouts/artist.html`: `site.artworks | where: "artist", page.name`)
2. 전시로 등록 시 전시 파일 `featured_artist:` 도 같은 `name:` 값.
3. 모르는 필드는 빈 문자열 `""` — 임의로 지어내지 말 것.
4. `slug` = 영문 이름 소문자-하이픈 (예: "Kim Young Hee" → `kim-young-hee`).

## 절차
1. **파악**: `info.md` 를 읽고, 폴더의 이미지 파일 목록을 확인한다. 작품 표(파일↔메타)를 매핑한다.
2. **이미지 정리**: 목적지 `assets/images/work/<ArtistFolder>/` (ArtistFolder = 이름에서 공백 제거 또는 기존 관례 따름) 를 만들고
   - 프로필 → `profile.jpg`
   - 작품 → `<slug>-work-001.jpg`, `-002` … (info.md 표의 순서대로)
   - 각 이미지에 대해 `.webp` 생성: sharp 사용 (max 1600px, quality 78). 기존 작가들과 동일 방식.
     · sharp 는 프로젝트 node_modules 에 설치돼 있음. 스크립트를 scratchpad 에 쓰고 `NODE_PATH` 를 프로젝트 node_modules 로 지정해 실행.
     · 경로 주의: node/python 의 `/tmp` 는 Windows `C:\tmp` 로 해석됨 → scratchpad 절대경로 사용.
3. **작가 파일 생성**: `_templates/artist-profile.md` 를 복사해 `_artists/<slug>.md` 로 저장하고 info.md 값으로 채운다.
   `featured_image` = 위 프로필 경로. 약력은 영문/한글 본문에 배치.
4. **작품 파일 생성**: 작품마다 `_templates/artwork-item.md` 를 복사해 `_artworks/<slug>-work-NNN.md` 로 저장.
   `artist` = 작가 `name` (정확히), `image` = 해당 작품 경로. 아는 메타만 채움.
5. **목록 노출 스위치**: 작가 목록(`gallery/artists.html`)은 `site.artists | where "listed", true` 로 자동 표시된다.
   · 목록에 **바로 공개**하려면 front matter 에 `listed: true`.
   · 아직 **비공개(초안)**로 두려면 `listed: false` 또는 생략 → 페이지는 생성되지만 목록엔 안 뜬다.
   · 사용자가 info.md 에서 공개 의사를 밝혔으면 `listed: true`, 애매하면 `listed: false` 로 두고 공개 여부를 한글로 물을 것.
   · 홈 3×3 그리드는 `where featured,true | limit:6` 로 자동 — `featured: true` 면 노출(단 상위 6명만).
6. **(선택) 전시 등록**: info.md 에서 전시 등록 = 예 이면 `_exhibitions/` 에 파일 생성
   (`featured_artist`, `start_date`, `end_date`, `status`). 기존 전시 파일 형식 참고.
7. **검증**: `JEKYLL_ENV=production bundle exec jekyll build` 후
   - `_site/gallery/artists/<slug>/index.html` 생성 확인
   - 작가 페이지에 작품 N개 모두 연결됐는지 (artist==name 매칭) 확인
   - 작가 목록 페이지(`_site/gallery/artists/index.html`)에 새 작가 노출 확인
   - 이미지 경로가 실제 파일과 일치하는지, alt 채워졌는지 확인
   - 링크 검사(scratchpad linkcheck.cjs) 로 깨진 링크 0 확인
8. **보고 & 승인**: 생성/수정 파일 목록과 검증 결과를 한글로 요약. **커밋/푸시는 사용자 확인 후 진행** (큰 변경이므로 한글로 승인 요청).

## 참고
- 사용자 작업 선호: 큰 변경·중요 사안만 한글로 승인 요청, 나머지는 진행.
- 반영 후 `_incoming/<ArtistName>/` 는 사용자가 지우거나 백업으로 남길 수 있음(자동 삭제하지 말 것).
