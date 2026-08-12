# ART SPACE BYRON — 개선 검증 리포트

- 대상: https://www.artspacebyron.com.au (GitHub Pages / Jekyll)
- 검증: 프로덕션 빌드(`JEKYLL_ENV=production`, 114 HTML 페이지) + 로컬 서버(`127.0.0.1:4000`) + 라이브 curl + Lighthouse(헤드리스 Chrome) + 헤드리스 스크린샷
- 종합: SEO·구조화 데이터·alt·리다이렉트·sitemap **전부 양호**. 남은 이슈는 **① 모바일 성능(대용량 이미지) ② 320px 캡션 잘림 ③ 콘솔 JS 에러 1건 ④ 작품 상세(헤드리스) 메타 없음** 4가지.

---

## 1. Lighthouse (모바일 · 데스크톱, 4개 지표)

| 지표 | 모바일 | 데스크톱 |
|------|:---:|:---:|
| Performance | **62** ⚠️ | **93** ✓ |
| Accessibility | 81 | 82 |
| Best Practices | 96 | 96 |
| **SEO** | **100** ✓ | **100** ✓ |

핵심 지표: CLS **0**(레이아웃 시프트 없음, 우수) · 데스크톱 LCP **1.5s** · **모바일 LCP 9.5s(불량)** · FCP 모바일 4.9s / 데스크톱 1.1s · TBT 0ms.

**모바일 성능 저하 원인(개선 기회, 절감 큰 순):**
| 항목 | 예상 절감 |
|------|-----------|
| 이미지 적정 크기로 리사이즈 | **~8,265 KiB** (최대 원인) |
| 차세대 포맷(WebP/AVIF) | ~7,026 KiB |
| 렌더 차단 리소스 제거 | ~3,640 ms |
| 미사용 CSS 제거 | ~247 KiB |
| CSS 압축 | ~53 KiB |

- LCP 요소 = 히어로 `<h1 class="home-hero-artists">`(현재 전시 작가명). 렌더 차단 CSS + **원본 대용량 작품 이미지**가 모바일에서 LCP를 9.5s로 지연.
- ※ "텍스트 압축(gzip)" 항목은 로컬 서버 한계일 뿐, 라이브 GitHub Pages는 gzip 적용됨(§5에서 확인).

---

## 2. title / description 고유성 (114 페이지)

- **title: 전부 고유** ✓ (중복 0)
- **description: 주요 페이지 전부 고유** ✓ — 홈·/gallery/·exhibitions·artists·visit·collect·about·작가 6인 등
- **공유(중복) 11개** — 유틸/카페 페이지가 사이트 기본 문구 공유:
  `A premium contemporary art gallery and artisanal cafe in Inverell, NSW.`
  → /cafe/(about·coffee·menu·reserve·visit), /gallery/(account·artworks·collection·contact·news), /generated_artworks/
- **description 없음 85개** — **작품 상세 83개**(`/gallery/collection/*`) + /debug/ + /generated_artworks/
  - 원인: **작품 레이아웃(`artwork.html`)이 헤드리스**(`<head>` 없음) → title·description·canonical 부재. (구조화 데이터 JSON-LD는 body에 정상 주입됨 §6)

> 홈(`/`)은 title·description·canonical 모두 정상(분석 스크립트 오탐이었고 실제 존재 확인).

---

## 3. canonical · og:url · sitemap URL 형식

- **canonical == og:url : 전 페이지 일치** ✓ (불일치 0)
- **canonical 전부 `https://www.artspacebyron.com.au/…` (www + 트레일링 슬래시)** ✓
- **sitemap.xml : 112개 loc 전부 www + 슬래시 형식** ✓ (non-www 0, 형식 이상 0)
- 예외: 헤드리스 작품 상세 83개는 canonical 자체가 없음(§2 원인과 동일).

---

## 4. 리다이렉트 (라이브 curl 301 검증)

| 테스트 | 결과 |
|--------|------|
| `http(s)://artspacebyron.com.au/` (non-www) | **301 → https://www.artspacebyron.com.au/** ✓ |
| `…/gallery/artists` (슬래시 없음) | **301 → …/gallery/artists/** ✓ |
| `http://www.artspacebyron.com.au/` (http) | ⚠️ **200** (https로 미리다이렉트) |

- non-www→www, 슬래시 정규화 모두 정상 301.
- **경미**: http(비암호화) www 접속이 https로 강제 업그레이드되지 않음(200). GitHub Pages 저장소 설정의 **"Enforce HTTPS"** 확인 권장.

---

## 5. sitemap.xml 응답

- 라이브: **HTTP 200 · Content-Type `application/xml`** ✓
- 첫 바이트 `3c 3f 78 6d` = `<?xm` → **정상 텍스트 XML(바이너리 아님)** ✓
- `<loc>` 112개, `file` 판정 = `XML 1.0 document, ASCII text` ✓
- 과거 진단의 "바이너리 응답" 이슈 **해소 확인**.

---

## 6. JSON-LD (스키마별 · 필수 필드)

- **파싱 오류 0** (전 블록 유효 JSON) ✓

| @type | 개수 | 필수 필드 |
|-------|:---:|------|
| ArtGallery (전역) | 111 | name·address·telephone·openingHoursSpecification·geo·url **완비** ✓ |
| BreadcrumbList | 110 | itemListElement 완비, position 순차 ✓ (`Home > Collection > …`) |
| VisualArtwork | 83 | name·creator·image **완비** ✓ |
| WebPage (seo-tag) | 17 | — |
| BlogPosting (seo-tag) | 10 | — |
| Person | 6 | name·jobTitle·url **완비** ✓ |
| ExhibitionEvent | 4 | name·startDate·location **완비**(startDate+location 누락 0) ✓ |
| WebSite | 1 | name·url **완비** ✓ |

- Google Rich Results 대상(Breadcrumb·Event) 필수 필드 이상 없음.

---

## 7. alt 없는 `<img>` 전수 검사

- 빌드 산출물 전체 스캔: **`<img>` 1,731개 중 alt 누락 0개** ✓✓
- 장식용은 `alt=""`로 명시, 작품/작가/전시 이미지는 서술형 alt(작가·작품·연도·재료 등) 적용.

---

## 8. 반응형 레이아웃 (320 / 768 / 1440px, 헤드리스 스크린샷)

| 폭 | 판정 | 비고 |
|---|:---:|------|
| **1440px** | ✓ 우수 | 풀 내비(Exhibitions·Artists·로고·Collect·Visit·계정), 캡션 1줄 중앙정렬, 잘림 없음 |
| **768px** | ✓ 양호 | 로고·햄버거·계정 흰색, 캡션 정상 줄바꿈("Min Hea Jung / Soo"), 잘림 없음 |
| **320px** | ⚠️ **깨짐** | **히어로 캡션 텍스트 과대 → 잘림**: 작가명 "Min Hea Ju… / Soo" 어색한 줄바꿈, 날짜 "…AUGUST 2[026]" 우측 잘림 |

- 원인: `.home-hero-artists` `font-size: clamp(2.4rem, 6vw, 4.3rem)`의 **최소값(2.4rem≈38px)이 320px에 과대**. 모바일 최소 크기 하향 필요.

---

## 9. 콘솔 에러 · 경고

- **에러 1건 (전 gallery-page 페이지 공통)**:
  ```
  TypeError: Cannot read properties of null (reading 'addEventListener')
  → _layouts/gallery-page.html 검색 스크립트
    const btn = document.getElementById('navSearchBtn');
    btn.addEventListener('click', …);   // navSearchBtn 미존재 시 null → throw
  ```
  - `navSearchBtn`(및 관련 검색 오버레이 요소)이 없는 페이지에서 null 참조로 예외 발생 → Best Practices 감점(96) 원인.
  - **수정**: `if (btn) { … }` null 가드 추가.

---

## 개선 권장 (우선순위)

1. **[높음] 모바일 이미지 최적화** — 작품/히어로 이미지 리사이즈 + WebP 제공 (LCP 9.5s→개선, 성능 62→상승). `sharp`(이미 설치됨)로 반응형/차세대 포맷 생성 가능.
2. **[중] 콘솔 JS 에러 수정** — `navSearchBtn` null 가드 (1줄).
3. **[중] 320px 캡션 잘림** — `.home-hero-artists` 모바일 폰트 하향(예: `clamp(1.6rem, 8vw, 4.3rem)`).
4. **[중] 작품 상세(83) 메타 부재** — `artwork.html`에 `<title>`·description·canonical 추가(헤드리스 → 정상 문서화).
5. **[낮음] 유틸/카페 11페이지 개별 description**, **http→https 강제(Enforce HTTPS 설정)**.

---

## 수정 결과 (2026-08-11, 전부 수정 완료 · 커밋 `59169ae`)

| 이슈 | 조치 | 재검증 |
|------|------|--------|
| #1 모바일 이미지 | 히어로·작가 featured 이미지 **WebP 리사이즈**(1600px, q78) 생성 + `<picture>` 적용 | 원본 **11.1MB→1.7MB(85%↓)**, Lighthouse "properly size images" **8,265→482 KiB** ✓ |
| #2 콘솔 JS 에러 | 검색 스크립트에 `if(!btn…) return` null 가드 | 콘솔 에러 **1→0**, Best Practices **96→100** ✓ |
| #3 320px 캡션 잘림 | 작가명 폰트 `clamp(2.4rem…)→clamp(1.4rem, 6.5vw, 4.3rem)` | Lighthouse 360px 모바일 렌더 **정상 줄바꿈·잘림 없음** ✓ |
| #4 작품 상세 메타 부재 | `artwork.html`을 정상 `<!doctype>` 문서로 래핑(title·description·canonical·charset·viewport·og) | 83개 작품 페이지에 **title/description/canonical 생성** ✓ |

## 2차 수정 — 성능·접근성 (커밋 `f86a111`)

| 항목 | 조치 | 결과 |
|------|------|------|
| 렌더 차단 폰트 | `eastern-minimal.css`의 render-blocking `@import` 제거 → head에서 **비동기 `<link media=print onload>`** 로드(+noscript, display=swap) | **FCP 6.0s→3.9s**, 렌더차단 3.6s→**1.34s** |
| 접근성 — 버튼 이름 | chat 토글 버튼 `aria-label="Open chat"` | ✓ |
| 접근성 — 색 대비 | "View All" 링크·작가 medium 텍스트 `#999/#888 → #666` | ✓ |
| 접근성 — 터치 타깃 | 히어로 "Scroll ↓"에 `padding` 추가(탭 영역 확대) | ✓ |
| 접근성 — 헤딩 순서 | 푸터 라벨 `<h4> → <p>` | ✓ |

**최종 모바일 Lighthouse**: Performance **67** · **Accessibility 93**(82→93, +11) · **Best Practices 100** · **SEO 100** (FCP 4.9s→3.9s, LCP 9.5s→7.1s).

> 남은 성능 여지: 렌더 차단 **Firebase SDK(≈1.3s)** + 코어 CSS. Firebase 지연은 인라인 초기화 스크립트와 얽혀 있어 신중한 리팩터 필요(별도 작업). 크리티컬 CSS 인라인/지연도 추가 가능.
> 잔여 경미: 유틸/카페 11페이지 공통 description, `http://www→https` 강제(저장소 Enforce HTTPS 설정).

---
*생성: 프로덕션 빌드 + Lighthouse 12 + 헤드리스 Chrome. 이 리포트는 리포지토리에 커밋하지 않았습니다(로컬 전용).*
