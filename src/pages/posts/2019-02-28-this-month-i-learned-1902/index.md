---
path: '/posts/this-month-i-learned-1902'
date: '2019-02-28'
title: 'This Month I Learned - 2019년 2월'
category: 'This Month I Learned'
tags:
  - TIL
  - Learning
  - Reading
  - Programming
  - React
  - CSS
description: '2019년 2월동안 익혔던 / 읽었던 것들 정리'
---

## 읽을거리 - 일반

- [여행을 준비하는 처음부터 끝까지의 기록 | 생각노트](https://insidestory.kr/21532) - 개발과 관련 없는 뉴스레터 중 유일하게 구독하는 생각노트. 글을 정말 잘 쓰시고, 글 곳곳에서 생각 정리를 위해 어떻게 도구를 활용하고 생산성을 끌어올리는지도 배울 수 있다. 마침 3월 말에 교토 방문 예정이라 더 관심있게 읽어봤는데 여행을 위해 얼마나 디테일하게 계획을 짤 수 있을지 좋은 참고가 되었다. 이번에는 Things와 노션 사용에 대한 내용이 들어있었는데 Things 구입도 좀 땡기긴 한다.

## 읽을거리 - 개발자

- [nhn엔터의 위키 폐쇄 이슈](https://github.com/nhnent/fe.javascript/issues/43)와 [재오픈 계획에 관한 문의](https://github.com/nhnent/fe.javascript/issues/44)
  - 특정 단체와 인물을 직접적으로 비방할 의도는 없지만, 한 가지는 확실히 하고 넘어가야겠다. nhn엔터측에서 지적 재산권에 대해 인지를 못하던 것을 원저작자의 이슈 제기 덕분에 전면적인 재검토를 위해 임시로 위키를 폐쇄한 것으로 보인다.
  - 그런데 재오픈 계획에 대한 문의라고 올라온 질문에서 **"라이센스를 하나하나 따져가며 공개여부를 정하실 일은 없을거라 추측하고 있으니"** 라는 말에 소름이 돋았다.
  - 나는 어디까지나 내 지적 만족으 위해 번역을 한다 해도, 원작자에게 라이센스 문의 및 번역에 관해 진중하게 질문했던 사람으로서 도저히 이해가 되지 않았기 때문이다. 오히려 허락을 구하는게 비정상일 지경이다.
  - 다른 사람이 공유하는 지식이나 소스 코드는 하늘에서 뚝 떨어지는게 아니라는 점을 인지하고 있지 않는 한 우리나라에서 지적 저작물(글, 소프트웨어 등)이 제 가치를 인정받고 올바르게 구입되는 문화가 더 잘 정착되기 어려울 것이라 생각한다. 소프트웨어를 만들고 판매하는 회사에 소속된 사람으로서 아주 무거운 기분이 들었다.
- [3개월 차 주니어가 느끼는 나와 시니어의 차이](https://zeniuus.github.io/2019/02/06/difference-between-junior-and-senior/) - 3개월 차 주니어라 해도 카이스트 출신에 개발 이력도 꽤 있는 분이다. 회사 생활이 3개월 차일 뿐. 소제목만 봐도 전반적인 내용을 얻을 수 있도록 글도 잘 정리되어 있어서 보기 좋다. 특히 '코드가 돌아가는 환경의 아키텍처를 고려한다' 는 부분이 크게 와닿았다. 단순히 코드의 동작을 보장하는게 아니라 특정 환경에서 연결이 끊어지는 상황 같은 것도 고려한 로직을 작성할 필요에 대해서 역설한다. 도메인 지식에 대한 이야기도 그렇다. 결국 "코드 너머를 보라" 라는 말로 정리될 수 있겠다.
- [블로그를 만들며 고려한 것들 (JBEE.io) | JBEE.io](https://jbee.io/etc/intro-new-blog/) - 한재엽님이 새 블로그를 만들면서 고려했던 점들 정리. 다음달에 블로그를 개편할 때 이 블로그에 사용된 테마를 기반으로 개편할 예정이다.
- 김창준님의 ‘함께 자라기’ 책은 정말 좋은 책이다. 초급 개발자에게 ‘프로그래머의 길 멘토에게 묻다’, ‘소프트웨어 장인’ 과 함께 마인드셋 분야로 반드시 추천하고 싶은 책이다. 자세한 내용은 따로 포스팅 예정.
- [최근 구직, 구인 글을 보면서 느끼는 단상 :: SLiPP](https://www.slipp.net/questions/433) / [스타트업에 취업하기 | 프로그래머 이규원의 웹사이트](https://gyuwon.github.io/blog/2016/05/19/getting-hired-by-a-startup.html) - 비슷한 주제이고 뒷 글에 앞 글 링크를 연결했기에 처음으로 두 개를 한 아이템으로 작성해본다. 겉을 핥지 말고 깊이 들어가서 기초를 다져야 개발자로서 커리어 수명을 연장할 수 있을 것이다. 단순히 오래 먹고 사는 문제 뿐 아니라 진정으로 어떤 개발자가 되고싶은지 고찰도 들어가게 될 테고.
  
## 프론트엔드

- [Web workers vs Service workers vs Worklets](https://bitsofco.de/web-workers-vs-service-workers-vs-worklets/) - 아주 오랫동안 탭만 열어놓고 보지 않던 글(어딘가에 이미 TIL 아이템으로 등록되어 있을지도). 보통 서비스 워커라는 단어만 익숙했는데, 브라우저에서 별도의 스레드를 활용하는 워커들이 각각 어떤게 있고, 어떤 역할을 하는지 간단히 요약해준다. 이 블로그 자체도 꽤 좋은 설명을 많이 담아놓고 있어서 눈여겨 봐야겠다. 
	- Worklet - 브라우저의 랜더링 파이프라인 안에서 동작하기 때문에 개발자가 직접 스타일링이나 레이아웃 등의 과정에 손을 댈 수 있다. 대표적인 예가 후디니 API로 보이긴 하는데 확실하진 않다. JS로 그라디언트를 만들고, CSS에서 `background-image: paint(myGradient)` 같은 방식으로 호출하는게 가능하다.
	- Service worker - 브라우저와 네트워크 사이의 프록시 역할을 담당한다. 도큐먼트에서 만들어진 요청을 가로채어 캐시를 제공하는 등 오프라인 활용이 가능하게 만들어준다. 이를 활용하여 PWA가 가능한 것이겠지.
	- Web worker - 일반적인 용도의 스크립트로 활용된다. 메인 스레드에서 연산하기에 많이 오래 걸리는 연산을 여기서 대신 처리할 수 있다.
- [Rendering on the Web  | Google Developers](https://developers.google.com/web/updates/2019/02/rendering-on-the-web) - 현재 웹앱이 랜더링(실행)되는 방법 총망라. 각 방법에 대한 장단을 구분해 두었으며 페이지 마지막에 있는 표를 꼭 읽어보길 권장.
- [UI as an afterthought](https://michel.codes/blogs/ui-as-an-afterthought) - MobX의 제작자가 프론트엔드 개발에 있어 데이터 중심의 사고가 필요하다는 것을 역설하는 글. 나도 전적으로 동감하고, 이렇게 개발을 하고 싶지만 지금 상태로는 데이터 설계가 잘못되어 UI 구현이 마냥 어려운 것 아닐까 하는 생각이 든다. UI 생각은 잠시 미뤄두고 비지니스 로직을 완전히 분리하고 특정 플랫폼에서만 동작하지 않도록 설계하는 것이다. - [번역문](https://adhrinae.github.io/posts/ui-as-an-afterthought-kr)
- [IE11 Pseudo Selector Bug](https://codepen.io/marvinhagemeister/pen/GqVKmw) - IE 버그 수정하다가 버튼의 `::after` 엘리먼트가 잘려 나오는 현상이 있어서 살펴보니 다행히도 손쉽게 해결책을 찾을 수 있었다. IE에서 버튼의 `overflow` 기본값은 `hidden` 이어서 생긴 문제라고 한다.
- [Sid on Twitter: "CSS tip!If you are adding border-radius on a container, don't forget to add overflow: hidden, otherwise content (especially images) can bleed out of the container… https://t.co/3n8j6UvIp8"](https://twitter.com/siddharthkp/status/1094821277452234752?s=20) - 어쩐지 약간 테두리를 둥글게 한 요소의 귀퉁이가 잘리는 것 처럼 보이더니만..
- [GitHub - aholachek/react-animation-comparison: A tour of React animation libraries with a focus on developer experience](https://github.com/aholachek/react-animation-comparison) - 사이드 프로젝트에 애니메이션을 본격적으로 넣어볼까 하면서 몇 가지 리액트 애니메이션 라이브러리를 검색해 봤는데, 이 저장소에서 라이브러리를 비교하고 장단점을 분석해 두었다. 사용 예도 있어서 좋은 참고가 되었다. 작성자는 기본 API인 `react-transition-group` 과 `animejs` 를 조합해 쓰는 것을 가장 좋게 평가했다. `react-spring` 이란게 있다는 것도 이번에 알았는데, 사이드 프로젝트에는 `react-spring` 을 써볼까 한다.
- [UI/UX Animation Principles: Tips, Tricks & Best Practices](https://theblog.adobe.com/ui-ux-animation-principles-tips-tricks-best-practices/) - 어도비에서 발행한 애니메이션 관련 팁. 애니메이션을 구현할 때 유의해야 할 점을 짚어주고 있다. 소제목만 하나씩 읽어봐도 맥을 짚을 수 있었다.
- [Create your own Formik with React Hooks and MobX – gitconnected.com | Level Up Your Coding](https://levelup.gitconnected.com/formik-with-react-hooks-and-mobx-1493b5fd607e) - React Hooks API와 MobX를 이용하여 직접 Formik을 만들어보는 튜토리얼. 재밌어보인다.
- [SF Pro Tracking · Figma](https://spectrum.chat/figma/feature-requests/sf-pro-tracking~4c4d2693-456e-4d76-a4cd-2f75cb8ca08e) - Figma로 나온 디자인 산출물대로 CSS를 적용했음에도 브라우저에서 다른 결과가 나오는 문제가 있어서 조사를 해 봤는데 전혀 상상하지 못한 문제를 발견했다. iOS/macOS에서 어떻게 SF(San Fransisco) 폰트를 다루는지 조금은 실마리를 잡을 수 있었다. 당장 해결될 문제로 보이진 않는다만..
- [스크롤 이벤트 최적화 | JBEE.io](https://jbee.io/web/optimize-scroll-event/) - 한재엽님이 설명해주신 스크롤 이벤트 최적화에 관한 글. 보통 `throttle` 같은 함수를 사용하는 1차원적인 설명이 있지만, 궁극적으로 `requestAnimationFrame`  함수를 소개하고 이를 어떻게 활용해야 하는지 알려준다. 나도 이런게 있다고 알고만 있고 제대로 쓰진 않았는데, 이번 기회에 `onScroll` 이벤트를 바인딩해놓은 로직을 가능하면 rAF로 교체할 수 있나 살펴봐야겠다.

## 프로그래밍 기본

- [GitHub - labs42io/clean-code-typescript: Clean Code concepts adapted for TypeScript](https://github.com/labs42io/clean-code-typescript) - 클린 코드 책에 나왔던 개념을 타입스크립트로 표현한 글
- [MVC PATTERN | Dolen’s blog](https://imcts.github.io/MVC-PATTERN/) - 코드스피츠 강의의 내용을 따라 정리하면서 예제 코드까지 구현해본 MVC 패턴 정리글인데 코드스피츠 강의 내용 답게 바로 곱씹기엔 좀 심오하다.

## 오픈 소스 프로젝트

- [GitHub - SonarSource/SonarTS: Static code analyzer for TypeScript](https://github.com/SonarSource/SonarTS) - 정적 코드 분석기. 코어는 자바로 되어있다. TSLint에 플러그인 형식으로 얹어서 쓸 수 있으며, 굉장히 다양한 룰을 제공하는데 이 룰은 단순히 린트로는 잡아낼 수 없는 수준의 버그 탐지 규칙으로 보인다. 도입해볼 만한 가치가 있을지도?
- [FuseBox · A bundler that does it right](https://fuse-box.org) - 타입스크로 작성된 번들러. API도 괜찮게 제공되어 있고, 타입스크립트로 작성된 만큼 First Class Typescript support를 지원한다. 그래서 이번에 사이드 프로젝트를 할 때 번들러로 한번 써보기로 했다.

