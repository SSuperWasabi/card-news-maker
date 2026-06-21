==========================================================
 One Prompt a Day - Card News  : 프로젝트 전체 아카이브
 (회사 장비에서 이어 작업하기)
==========================================================

이 폴더에는 카드뉴스 작업 일체가 들어 있습니다.

[먼저 읽기]
  WORKLOG_card-news-skill.md   <- 작업 로그 최종본. 여기서 시작.

[폴더/파일 안내]
  card-news-skill/             <- 스킬 본체(라이브 복사본). 아래 [스킬 설치] 참고
  card-news-skill-package.zip  <- 위와 동일 내용 + inbox 템플릿 + 설치방법(배포용)
  inbox/                       <- 입력 폴더. 포스트당 1폴더
     _TEMPLATE/post.md         <- 복사해서 채우는 입력 시트
     2026-05-30-post1/         <- 첫 실전 입력(포트레이트 12장)
  1pd-2026-05-30-portraits.html<- 첫 실전 결과 덱(18장). 브라우저로 열기
  1pd-2026-05-30-harbor.html   <- 초기 테스트 덱(6장)
  card-news.css / html2canvas.min.js / jszip.min.js  <- 덱 동작용(덱과 같은 폴더 유지)
  _build-deck.ps1              <- 덱 재생성기(ASCII 전용, cover-crop)
  _test-download.js            <- 다운로드 헤드리스 검증
  _aspect-test.js              <- 이미지 비율 검증
  _diagnostic.html             <- 다운로드 단계별 진단
  StudioBlank Design System/   <- 원본 디자인 시스템(참고용, 런타임 불필요)

[스킬 설치 - 회사 장비]
  card-news-skill 폴더를 이름만 'card-news' 로 바꿔서 아래로 복사:
    Windows :  C:\Users\<사용자명>\.claude\skills\card-news\
    Mac/Linux:  ~/.claude/skills/card-news/
  (또는 card-news-skill-package.zip 을 풀어 그 안의 card-news\ 를 같은 위치에)

[사용]
  새 Claude Code 세션에서:
   1) inbox/_TEMPLATE 복사 -> YYYY-MM-DD-슬러그
   2) post.md 작성 + 이미지/영상 스틸 넣기
   3) "이 폴더로 카드뉴스 만들어줘: ...\inbox\<폴더명>"
   4) 브라우저에서 PNG(개별) / Download all (ZIP)

[헤드리스 검증 도구 쓰려면]
   프로젝트 폴더에서:  npm i puppeteer-core   (설치된 Chrome 자동 인식)
   node _test-download.js   /   node _aspect-test.js

[주의]
  - html2canvas.min.js, jszip.min.js 는 덱 HTML 과 같은 폴더에 유지.
  - 생성기 .ps1 새로 만들 땐 ASCII 전용(PowerShell 5.1 인코딩 함정).
  - 푸터는 텍스트 전용(@ssuperwasabi), 원작자 로고 미사용.

==========================================================
