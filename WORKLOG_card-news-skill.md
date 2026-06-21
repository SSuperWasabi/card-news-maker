# One Prompt a Day — Card News 스킬 작업 로그 (최종본)

> 최종 갱신: 2026-06-02 · Leo(레오) ↔ Jason(@ssuperwasabi)
> 목적: 전체 작업 + 어느 장비에서든 이어 디벨롭하기 위한 인수인계
> 상태: **세션 2 완료** — 카드/이미지 비율 모델 전면 개편(기본 1:1 + 자동 비율 + Fit 무크롭),
>        브라우저 메이커(`card-news-maker.html`)까지 동일 적용, 전 과정 헤드리스 검증 통과·Jason 확인 완료
> (이전: **세션 1** — 스킬 구축 + 첫 실전 덱 제작 + 다운로드/비율 버그 2건 해결·검증)

---

## 0. 한눈에 보기

1pd 포스트 → **StudioBlank 스타일 카드뉴스** 자동 제작 Agent Skill **`card-news`** 완성.
세션 1에서 1080×1080(크롭) 기반으로 18장 덱을 뽑았고, 세션 2에서 **카드 비율을 입력 이미지에
맞춰 자동 조정 + 이미지를 안 자르고(Fit) 채우는** 방식으로 전면 개편. 브라우저 메이커까지 동일 적용.

---

## 세션 2 (2026-06-02) — 비율 모델 전면 개편 + 메이커 이식

> 작업 장비: 회사 PC `C:\Users\jasonbae\Downloads\One Prompt a Day Card news`
> (세션 1은 집 PC `C:\Users\sodad\...` — 경로만 다름, 내용 동일)

### A. 무엇이 문제였나 (출발점)
- 세션 1 방식: 카드 **1080×1080 고정**, 이미지를 **1080×960으로 강제 center-crop**해서 채움.
  → 입력 이미지의 가장자리가 잘렸고, 카드 비율이 입력과 무관하게 항상 정사각.
- Jason 요구: ① **입력 이미지 비율에 카드가 자동으로 맞춰지고** ② 이미지가 **안 잘리고(무크롭)
  꽉** 들어갈 것.

### B. 핵심 기하 결론 (왜 이렇게 설계했나)
- 캐러셀(인스타/스레드)은 **첫 장 비율로 전 슬라이드를 크롭** → **한 덱=한 비율** 필수.
- "한 고정 비율로 모든 입력을 가장자리까지 + 무크롭"은 **기하학적으로 불가능**
  (정사각≠세로직사각). 셋 중 둘만 가능: 여백 두기 / 자르기 / 늘리기(왜곡).
- 그래서 채택한 모델: **카드 = 이미지 영역(가로 1080) + 캡션 바(120px)**.
  - 카드 높이 `--card-h` = `round(1080 / 입력이미지비율) + 120`, **IG 안전범위 566~1350으로 클램프**.
  - 카드 비율을 **그 덱의 이미지 비율에 맞추니** 매칭 이미지는 여백 0으로 꽉 참.
  - 그래도 안 맞는 잔여분(섞인 배치/클램프)은 **Fit(페이퍼 여백)** 으로 처리 → **절대 안 자름**.
- 결과 규칙: 1:1 이미지→**1080×1200**, 3:4→**1080×1350**(4:5 클램프), 텍스트 전용→**1080×1080**.

### C. 비율 왜곡(html2canvas) 재발 방지 — 이번엔 다른 해법
- 세션 1 교훈: html2canvas는 `object-fit`/`background-size`를 **무시**하고 박스에 늘림.
- 세션 1 해법: 이미지를 박스 비율로 **미리 크롭**(stretch가 1:1 no-op이 되게).
- **세션 2 해법(Fit, 무크롭):** `<img>`에 `object-fit`을 **쓰지 않고**,
  - 정적 덱/스킬: 생성 단계에서 이미지를 미디어 영역에 **맞춰 미리 스케일**(비율 보존) → 그 크기로 박음.
  - 메이커: 렌더 시 각 이미지를 미디어 영역에 contain-fit한 **명시적 px(width/height)** 로 지정.
  - 어느 쪽이든 html2canvas는 "이미 비율이 맞는 한 장"을 그릴 뿐이라 **왜곡 0**. (헤드리스로 실측 확인)

### D. 바뀐 파일

**스킬 본체 `card-news-skill\`**
- `card-news.css` — `--card-size` 제거 → **`--card-w`/`--card-h`/`--cap-h`** 변수화(기본 1:1 이미지=1080×1200).
  이미지 카드: 고정 960 크롭박스 → **`.media-wrap` + `img{max-width/height:100%}` Fit**(페이퍼 여백).
- `template.html` — 이미지 카드 `media-wrap` 구조, export 엔진에 **`CARD_W/CARD_H` 상수**(CSS와 동기).
- `SKILL.md` — 기본 1:1 + **자동 비율 절차**(detector 돌려 카드 크기 세팅) 문서화,
  세션 1의 "background-image div 써라"는 **옛 가이드 정정**(이제 Fit `<img>`), 1080×1080 참조 전부 갱신.
- **`_detect-ratio.ps1` (신규)** — 인박스 폴더 측정 → 중앙값 비율 → `--card-h`/`CARD_H` 추천값 출력. ASCII 전용.
- **`_build-deck-v2.ps1` (신규)** — 새 파이프라인 생성기(자동 비율 + Fit 무크롭 + 동적 export + jasonbae 경로).
  세션 1 `_build-deck.ps1`은 옛 디자인/집 경로라 보존만 함.

**브라우저 메이커 (Jason이 실제로 쓰는 도구)**
- `card-news-maker.src.html` — 원본 수정: `--card-w/h/cap-h` 변수화, **`recomputeCardSize()`** 로
  이미지 드롭/삭제/순서변경마다 중앙값 비율→카드 높이 자동, **`cropToBox`(강제 크롭) 제거→`loadImage`(무크롭)**,
  `object-fit:fill`(늘림) 제거, 렌더 시 이미지 명시적 px fit, **동적 `CARD_W/CARD_H` export**.
- `card-news-maker.html` — 위 src에 라이브러리(html2canvas/jszip) 주입해 **재빌드**(자체완결 1파일).
  ※ 메이커는 라이브러리 내장이라 "js 파일 옆에 둬야" 문제 없음 — 파일 하나로 어디서든 동작.

### E. 검증 (전부 헤드리스 Chrome 실측, puppeteer-core)
- `_verify-fit.js` — 1:1 원본이 미디어 영역을 **가로/세로 100% 채움**, 비율 1.0 무왜곡, export 1080×1200. **PASS**
- `_verify-deck.js` — 실제 18장 덱: **전 카드 1080×1200**, 이미지 12장 **무왜곡·꽉참**, ZIP 18개 빌드. **PASS**
- `_verify-maker.js` — 메이커에 이미지 주입: 1:1→1080×1200(꽉참), 3:4→1080×1350(클램프, 무왜곡),
  빈 입력→1080×1080. **PASS**
- 산출 덱: **`1pd-2026-05-30-portraits-NEW.html`** (새 파이프라인, 18장, 1080×1200).
- **Jason 실사용 확인:** 메이커에 실제 이미지 여러 비율 드롭 → "완벽하게 핏 + 자동 비율" 확인 완료.

### F. 함정/주의 (다음 세션용)
- **puppeteer 기동 플래키:** chrome kill과 launch를 **같은 명령에 넣지 말 것**(WS endpoint 타임아웃).
  goto는 `networkidle0` 금지(Google Fonts CDN 대기로 행) → `domcontentloaded` + `waitForFunction(JSZip/html2canvas 정의)`.
- **미리보기 스케일 함정:** `.scaler` transform 때문에 `getBoundingClientRect`는 **축소된 값** →
  채움 검증은 캔버스 픽셀이나 카드 대비 **비율(fraction)** 로 비교.
- **작은 이미지:** `max-width/height:100%`는 축소만 함(확대 X). 메이커는 렌더 시 명시적 px로 **확대도** 해 채움.
- **덱 옆 라이브러리:** 정적 덱(`1pd-...html`)은 `card-news.css`+`html2canvas.min.js`+`jszip.min.js`를
  **반드시 같이** 둬야 다운로드 동작(이번에 루트 js가 사라져 한 번 깨졌다가 복구). 옮길 땐 4개 세트로.

---

## 세션 3 (2026-06-07) — 인사이트/헤드라인 텍스트 볼드 강조

> 작업 장비: 집 PC `C:\Users\sodad\Downloads\One Prompt a Day Card news`
> 예시 참조: `C:\Users\sodad\Downloads\card-news-2026-06-04-y2k\1pd-2026-06-04-y2k-lookbook.html`
> (인사이트 카드에서 `<strong>without a studio.</strong>`처럼 키워드만 볼드 처리된 덱)

### A. 요구
- 인사이트(Takeaway) 한마디에서 **원하는 키워드만 볼드**로 강조하고 싶음.
- UX 우선: 마크다운 별표를 **직접 타이핑하는 건 비선호** → 워드처럼 선택+버튼.

### B. 채택안 — "선택 + B 버튼, textarea 유지" (별표 자동 래핑)
- 사용자: 강조할 부분 드래그 선택 → **B 버튼 또는 Ctrl/Cmd+B** → JS가 선택영역을 `**...**`로 자동 래핑(다시 누르면 토글 해제).
- 렌더: `mdBold()`가 `**...**`→`<strong>`. **반드시 esc 뒤에 치환**(nl2br 경유)해서 XSS/태그깨짐 0.
- textarea·plain-text·기존 다운로드(html2canvas)/비율 경로 **그대로** → 위험 최소. (풀 위지윅 contenteditable은 안 씀)
- 적용 범위: **인사이트 + 헤드라인** 둘 다. `.insight strong{600}`은 이미 있었고, 헤드라인은 700이라 `.headline strong{800}` 추가해 강조가 보이게.

### C. ★ 함정 발견 — `card-news-maker.src.html`이 stale였음 (중요)
- 세션 2의 비율개편(`--card-w/h`, `recomputeCardSize`, `loadImage` 무크롭)이 **빌드본 `card-news-maker.html`(6/3)에만** 들어갔고 **`src.html`(5/31)엔 없었음**. src로 재빌드했으면 세션2가 통째로 롤백될 뻔.
- **결론: 진짜 소스는 빌드본.** 이번엔 빌드본을 직접 수정 후, **빌드본에서 라이브러리 2개만 `__HTML2CANVAS__`/`__JSZIP__` 플레이스홀더로 치환해 src.html을 재생성**(역추출)해 둘을 다시 일치시킴. (주의: html2canvas 라이브러리에도 `"use strict"`가 있어 앱 스크립트 경계는 `var state = {`로 잡을 것.)

### D. 바뀐 파일
- `card-news-maker.html` — CSS `.btn-bold`/`.headline strong{800}` 추가, 헤드라인·인사이트 라벨에 **B 버튼**, JS `mdBold()`(렌더), `wrapBold()`+버튼/Ctrl+B 와이어링.
- `card-news-maker.src.html` — **빌드본에서 역추출해 동기화**(세션2 비율코드 + 세션3 볼드 전부 포함, 26.9KB, 3-script 구조).

### E. 검증
- `node --check`로 인라인 앱 스크립트 문법 PASS(14.6KB).
- 순수 로직 node 테스트 전부 PASS: `mdBold`(볼드 변환/줄바꿈동시/XSS안전/`*`곱셈기호 무해), `wrapBold`(래핑/토글해제 2종).
- (헤드리스 Chrome 미실시 — puppeteer-core 미설치. CSS는 기검증, 로직·문법으로 커버. 풀 브라우저 검증 원하면 `npm i puppeteer-core` 후 추가 가능.)

### F. 사용법
- 헤드라인/인사이트 입력칸에서 강조할 글자 **드래그 → B(또는 Ctrl+B)**. 입력칸엔 `**키워드**`로 보이고, 오른쪽 카드엔 볼드로 렌더.

### G. 후속 — 툴 체인 줄바꿈 (같은 날, 2026-06-07)
- 요구: 표지 **툴 체인** 입력에서 Enter로 줄바꿈.
- 처리: `f-chain`을 `<input type=text>` → **`<textarea>`** (placeholder도 3줄 예시), 표지 렌더 `esc(state.chain)` → **`nl2br(state.chain)`** (줄바꿈→`<br>`). `bind`/`reset`은 textarea에 그대로 동작해 수정 불필요.
- 검증: `node --check` PASS, src.html 동기화 확인. 빌드본 수정 후 src 역추출로 동기화(세션3 C의 절차 동일).

---

## 1. 스킬 본체

위치: `C:\Users\sodad\.claude\skills\card-news\`

| 파일 | 역할 |
|------|------|
| `SKILL.md` | 매니페스트 + 1pd→카드 매핑 + 비주얼 규칙 + 기술 주의사항 |
| `card-news.css` | StudioBlank 토큰(1080² 카드용, 자체완결). 표지/이미지/스텝/인사이트/아웃트로 카드 스타일 |
| `template.html` | 동작하는 7장 레퍼런스 덱 + PNG/ZIP 추출 엔진 |
| `html2canvas.min.js` | 카드 → 캔버스 래스터화 (로컬 번들, 오프라인 안전) |
| `jszip.min.js` | 전체 카드 → ZIP 단일 다운로드 |

> 스킬은 폴더 하나로 자체완결. 어느 장비든 `~/.claude/skills/`에 복사하면 동작.

---

## 2. 확정된 사양·원칙

- 비주얼: **StudioBlank** (모노크롬·미니멀·직각·Inter, 그림자/이모지/장식 금지)
- 사이즈: **1:1 정사각 1080×1080**
- 출력: **HTML 카드 + 카드 내 PNG 다운로드(개별) + 전체 ZIP 다운로드**
- 입력: **1pd 포스트** (+ inbox 폴더의 이미지/영상 스틸)
- 푸터: **텍스트 전용 `@ssuperwasabi`** — 원작자(StudioBlank) ■ 마크 사용 금지(IP)
- **이미지 = 1장당 1카드, 스와이프형. 그리드 압축 금지** (공들인 작업물은 각각 크게)
- 카드 수 유연, **캐러셀 한도 20장**(Instagram·Threads) 내. 넘으면 뺄 컷을 물어봄

## 3. 카드 구성 (1pd 포스트 분해)

`표지(ink) → 이미지 쇼케이스(1장당 1카드) → 워크플로우 스텝 → 인사이트 → 아웃트로(ink)`
- 이미지 카드: 박스 비율로 미리 크롭한 `<img>`(1080×960) + 하단 슬림 모노 캡션(120px, `tool · subject · medium`)
- 미디어 없는 텍스트 전용 덱: 5~7장

---

## 4. 입력 워크플로우 (inbox)

위치: `C:\Users\sodad\Downloads\One Prompt a Day Card news\inbox\`

```
inbox/_TEMPLATE/post.md      ← 복사해서 채우는 입력 시트
inbox/<YYYY-MM-DD-슬러그>/    ← 포스트당 폴더
   post.md, cover.png, 01.png …, video-still.png, notes.txt
```
- 텍스트: post.md 또는 대화창 붙여넣기
- 이미지: **파일로** (base64로 카드에 박힘). 넣은 건 다 보여줌(큐레이션 = 무엇을 넣느냐)
- 영상: Leo는 재생 불가 → **대표 스틸 1장 + 텍스트 설명**

---

## 5. 첫 실전 산출물 (검수 통과)

- 입력: `inbox/2026-05-30-post1/` (Magnific 포트레이트 12장) + 1pd 초안
- 포스트: Gemini → GPT Image2 → Magnific / "Close-up portrait series"
- 산출: **`1pd-2026-05-30-portraits.html`** (18장 = 표지+이미지12+스텝3+인사이트+아웃트로, 2.6MB)
- 크롭/비율: 중앙 cover-crop OK, PNG 다운로드 비율 정상 (Jason 확인 완료)
- 재생성기: `_build-deck.ps1` (이미지 cover-crop 1080×960→base64→18장 조립, **ASCII 전용**)

다시 뽑으려면:
```
powershell -File "C:\Users\sodad\Downloads\One Prompt a Day Card news\_build-deck.ps1"
```

---

## 6. ★ 다운로드 버그 — 원인과 해결 (중요)

**증상:** PNG 다운로드 버튼이 전부 무반응 (개별·전체 모두).

**진짜 원인:** *멀티다운로드 차단이 아니라* **인라인 JS 문법 오류**.
생성기 `.ps1` 안의 유니코드(`…`,`→`,`↓`,`·`,`—`)를 **Windows PowerShell 5.1이 no-BOM UTF-8
스크립트를 ANSI 코드페이지로 읽어** 깨뜨렸고, 그게 JS 문자열을 망가뜨려
(`'rendering …'` → `'rendering ??)`) **스크립트 전체 파싱 실패 → dl/dlAll 미정의 → 모든 버튼 사망.**
(진단 페이지는 별도의 정상 JS라 동작했고, 손으로 쓴 harbor 덱도 정상이었음 → 범위가 생성기로 좁혀짐)

**해결:**
1. 생성기 **ASCII 전용** 재작성 — 표시 글자는 HTML 엔티티(`&mdash; &rarr; &darr; &middot;`),
   JS 문자열은 순수 ASCII. `node --check`로 인라인 JS 검증.
2. 전체 다운로드 = **ZIP 단일 파일**(JSZip) — 혹시 모를 크롬 멀티다운로드 차단도 우회.
3. `toDataURL` → **`toBlob` + objectURL** (대용량 PNG data URL을 크롬이 무시하는 문제 예방).
4. 캡처 전 **`img.decode()` 대기** (이미지 카드 블랭크 방지).
5. html2canvas/JSZip **로컬 번들** (CDN 차단/오프라인 안전).

**검증(헤드리스 크롬, puppeteer-core):**
```
TEST 1 단발 PNG  → 1pd-card-02.png 1080×1080 ✓
TEST 2 전체 ZIP  → 1pd-2026-05-30-portraits.zip (18장) ✓
```

**교훈(회사에서 생성기 만들 때):** PS 5.1 + 비ASCII = 깨짐. 생성 스크립트는 ASCII로,
글리프는 엔티티로. 배포물은 `node --check`로 인라인 JS 먼저 검사.

### 6b. 이미지 비율 왜곡 버그 (이미지 카드)

**증상:** PNG 다운로드 시 이미지가 들어간 카드의 비율이 변형(가로로 늘어남).

**원인:** **html2canvas 1.4.1은 `object-fit:cover`도 `background-size:cover`도 무시**하고
이미지를 박스에 강제로 늘림(stretch-to-fill). 합성 원(circle) 테스트로 확인:
- object-fit: ratio 1.83 (가로 늘어남), background-size: ratio 2.45 (더 심함)

**해결:** 이미지를 **박스 비율로 미리 center-cover 크롭**해서 넣음. 박스를 고정
픽셀(이미지 1080×960 + 캡션바 120 = 1080)로 만들고, 소스를 1080×960으로 크롭 후 `<img>`로
삽입 → html2canvas가 늘려도 이미 박스와 동일 비율이라 **1:1 무왜곡**.
- 생성기: `To-Base64JpegCover` (System.Drawing center-cover crop)
- CSS: `.card.image .media { height:960px }`, `.cap-bar { height:120px }`, 카드 border 0
- 검증(헤드리스): pre-crop 후 원 ratio **0.974 ≈ 1.0 (PASS)**, 단발/ZIP 다운로드도 정상

---

## 7. 다운로드 사용법 (최종)

- 카드 위 마우스오버 → **`↓ PNG`** = 그 카드 1장 저장
- 좌상단 **`↓ Download all (ZIP)`** = 전체를 `1pd-...-portraits.zip` 하나로 저장
- 라이브러리 미로드 시 경고창이 뜸 (html2canvas.min.js / jszip.min.js 동봉 확인)

---

## 8. 배포 패키지

`card-news-skill-package.zip` (프로젝트 폴더):
`card-news/`(스킬+로컬 라이브러리 2종) + `inbox/`(템플릿) + WORKLOG + 설치방법.txt
→ 회사 장비: 압축 풀어 `card-news/`를 `~/.claude/skills/`에, `inbox/`는 콘텐츠 폴더에.

---

## 9. 다음에 할 일 (TODO)

- [x] **비율 옵션 → 자동 비율로 완성**(세션 2): 입력 이미지 비율에 카드가 자동 맞춤 + Fit 무크롭
- [x] **생성기 디자인 일반화**(세션 2): `_build-deck-v2.ps1`이 자동 비율 + Fit + 동적 export
- [ ] 회사 장비 설치·동작 확인 (3대)
- [ ] 사내망 CDN/폰트 차단 시: Inter/Plex 폰트도 로컬 번들 (현재 폰트만 Google Fonts)
- [ ] 개인 브랜딩 로고 → `.foot` 슬롯에 삽입 (현재 텍스트만)
- [ ] 생성기 **텍스트** 자동화: 포스트별 텍스트를 post.md에서 읽어 자동 주입 (현재 `_build-deck-v2.ps1`도 이 포스트 텍스트는 하드코딩 — 디자인만 일반화됨)
- [ ] 메이커에 **개별 캡션**(이미지마다 다른 캡션) 옵션 — 현재 공통 캡션 1개
- [ ] Threads 포스트 URL → 카드뉴스 입력 경로(보조)

## 10. 참고 — 프로젝트 폴더의 도구/자산

- `_build-deck.ps1` — 덱 재생성기 (ASCII 전용 + cover-crop). 이번 포스트 내용 하드코딩
- `_test-download.js` — 다운로드 헤드리스 검증 (단발 PNG + ZIP)
- `_aspect-test.js` — 이미지 비율 보존 검증 (합성 원으로 측정)
- `_diagnostic.html` — 다운로드 단계별 진단 페이지
- 헤드리스 도구는 `npm i puppeteer-core` 후 사용 (설치된 Chrome 자동 인식)
- 원본 디자인 시스템: `StudioBlank Design System\` (스킬 런타임엔 불필요, 참고용)
- 폰트: Inter + IBM Plex Mono (현재 Google Fonts CDN — 사내망 차단 시 로컬화 TODO)

---

> 끝. 회사 장비에서 `card-news-skill-package.zip` 풀고 이어가면 됩니다. 다음 작업은
> 9번 TODO부터 (실제 포스트 텍스트로 생성기 일반화 / 폰트 로컬화 / 개인 로고).
