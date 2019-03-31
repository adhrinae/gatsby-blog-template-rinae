---
path: '/posts/this-month-i-learned-1903'
date: '2019-03-31'
title: 'This Month I Learned - 2019년 3월'
category: 'This Month I Learned'
tags:
  - TIL
  - Learning
  - Reading
  - Programming
  - React
description: '2019년 3월동안 익혔던 / 읽었던 것들 정리'
---

3월은 별다른 글을 하나도 작성하지 않았다. 10년만에 피아노를 다시 쳐본다던가, 일본 여행을 다녀온다던가, 평소보다 더 열심히 게임에 몰두한다던가 개발 외적으로 신경쓸 것들이 조금씩 있었다.  
앞으로도 개발 공부/수련과 개인적인 흥미를 어떤 수준까지 함께 끌고가느냐를 계속 고민하게 될 것이다. 나에게 주어진 시간은 한정되어 있고, 하루는 너무 짧다.

## 읽을거리 - 일반

- [한국 이커머스에는 빌런이 산다](https://brunch.co.kr/@windydog/213) - 왜 우리나라 이커머스를 이용할 때 자잘하게 불편함이 있다고 느꼈는지 이 글을 통해 다시 한번 되짚어볼 수 있었다. 과연 더 나은 이커머스 서비스가 어떻게 나오게 될지 기대된다. 내가 만들고 싶은 기분은 들지 않는다만.
- [8시간 자리만 지키면 무슨 소용? 리모트 워크 핵심은 효율적 업무 진행](http://dbr.donga.com/article/view/1203/article_no/9045) - 김태곤님의 글이다. 오토매틱 이전 회사와 지금 일하고 있는 오토매틱을 포함하여 8년이나 리모트 워크만 하고 계시고, 개인의 경험과 오토매틱이라는 조직이 어떻게 일하는지 상세한 컬럼을 작성해주셨다. 우리 회사는 여기서 서술하는 리모트 워크의 단계 중 3단계와 4단게 사이 쯤 위치해 있는 것 같은데, 아직 더 적극적으로 개선할 포인트가 많이 존재한다고 생각한다. 나의 경우는 더 적극적이고 효율적인 커뮤니케이션을 위해 고민하게 된다. 그와 더불어 문서화를 더 빠르고 철저히 하는 방법에는 어떤게 있을까 고민하고 있다.
- [어떻게 빨리 갈 수 있을까](https://muchtrans.com/translations/how-to-go-fast.ko.html) - 작은 팀에서 어떻게 해야 번아웃 되지 않고 성공적으로 제품을 출시할 수 있을지 중요한 포인트를 짚어주는 글 번역

## 읽을거리 - 개발자

- [개발자의 글쓰기 - 김철수 님](https://drive.google.com/file/d/1ELeCi_1UzCEkj-UDSLM44h9HcgGiDQrb/view?usp=sharing) - 페이스북에 공유되길래 한번 살펴보니까 원래 출판사에 출간하려고 제의헀던 책이 '시장성이 없다' 고 반려된 원고라고 한다.  처음에는 단순히 변수 명이나 주석 쓰는법에 대한 이야기를 하다가 점점 본격적으로 고객과 다른 개발자, 비지니스를 대상으로 한 개발자의 글쓰기를 다루고 있다. 한번 쯤 읽어볼 가치가 충분히 있는 원고라고 생각한다.
- [IT 기술 노트  - WikiDocs](https://wikidocs.net/book/2184) - IT업계에서 오랫동안 몸담고 프로젝트 매니저 역할을 하고 계신 분이 IT 업계에서 필요한 기술 전반을 정리한 기술 노트. 0번째 장의 *아주 성차별적인 표현* 을 거르고 본다면 한번 복습하기 좋은 내용으로 채워져 있는 것 같다.
- [Brian Kight on Twitter: "If you don’t know, go study.If you don’t understand, go ask.If you don’t have experience, go do.If you don’t have confidence, go practice.Don’t make simple things complex.#DoTheWork"](https://twitter.com/TBrianKight/status/1101849801640030209) - 트윗 내용이 인상깊어서 스크랩. 결국 고민만 하지 말고 직접 행동하라는 것이다.
- [나는 그동안 무엇으로 성장했을까? : 네이버 블로그](https://m.blog.naver.com/jukrang/221479816946) - 단순히 기술을 좇던 시절에서 벗어나, 개발자로서 동료와 협업하고 고객을 위한 제품을 만들어야 한다는 것을 깨닫게 되기까지의 과정을 담담하게 풀어낸 글. 성장을 **~"다양한 사람의 의지가 뒤섞이는 개발이라는 큰 운동장에서, 본인의 역할을 질문하고 찾아가는 과정"~** 이라고 표현한 것이 아주 와닿았다.
- [Fast-Forward Git Merge · ariya.io](https://ariya.io/2013/09/fast-forward-git-merge) - 팀 동료가 우리 작업할 때 Fast-forward 머지가 아니라서 신경쓰인다는 말씀을 듣고 '그러고보니 FF라는 용어를 터미널에서 나오는 메세지 정도로만 보고 정확히 뭔지 모르고 쓰고있었네?' 라는 생각이 들어서 좀 더 자세히 찾아보다 발견한 글.
  - "In short, non fast-forward merge keeps the notion of **explicit branches** . It may complicate the commit history with its non-linear outcome at the price of preserving the *source* of the branches (pull requests, when using GitHub). On the other hand, fast-forward merge keeps the changesets in a **linear history**, making it easier to use other tools (log, blame, bisect). The source of each branch will not be obvious, although this is not a big deal if the project mandates the strict  [cross-reference](https://ariya.io/2013/06/cross-reference-commit-message-and-issue-tracker)  between the commit message and its issue tracker."
  - FF 머지는 선형적으로 커밋이 이어지게 만들지만, 그렇지 않은 경우 외부 브랜치에 대한 내용을 추적하는 것으로 보인다. 특별히 외부 브랜치에 대한 크로스 체킹이 필요하지 않은 경우 FF 머지가 유리한 것으로 보인다.
- [(번역) 기술자의 히포크라테스 선서 | 생각하고 나누고 공감하기...](https://blog.fupfin.com/?p=188) - "나는 개발자(기술자)로서 어떤 마음가짐으로 제품을 개발하고, 앞으로 나아가야 하는가?" 라는 근본적인 질문에 다시 한번 생각할 거리를 주는 글.
- [커뮤니티의 역할에 대한 단상 – brightparagon](https://brightparagon.wordpress.com/2019/03/31/thoughts-on-role-of-community/) - 작성자인 노경모님은 GDG Korea의 운영진으로 알고 있다. 커뮤니티를 운영하면서 다른 개발자들에게 길라잡이가 되어줄 만한 내용을 안내하는 이벤트가 부족했다는 내용을 성토하고 있다. 앞으로 GDG를 통해 어떤 이벤트가 더 열리게 될지 기대하게 된다. 나는 커뮤니티에 참여/혹은 기여를 어떻게 할 수 있고, 하고 있는지는 고민이 좀 더 필요하다.
- [한 달짜리 개인 프로젝트 후기 – HappyProgrammer – Medium](https://medium.com/happyprogrammer-in-jeju/%ED%95%9C-%EB%8B%AC%EC%A7%9C%EB%A6%AC-%EA%B0%9C%EC%9D%B8-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%ED%9B%84%EA%B8%B0-dd440ad2cf9a) - 김대현님이 예전에 여유가 있을떄 한달 내내 몰입하여 사이드 프로젝트를 해보고자 했으나 생각보다 잘 되지 않았음을 반성하고, 대신 어떠어떠한 부분은 괜찮았으니 앞으로 나아가자는 내용. 자잘한 작업을 하더라도 각 작업을 되돌아보는 시간을 가지는 것은 중요하다는 것을 다시금 느꼈다.

## 프론트엔드

- [CSS 애니메이션 성능 개선 방법(reflow 최소화, will-change 사용) | WIT - NTS UIT Blog](https://wit.nts-corp.com/2017/06/05/4571) - 요즘 애니메이션 구현에 대해 관심을 가지고 있어서 그런지 눈에 띄었다. 부드러운 애니메이션을 적용하려면 reflow, repaint를 최대한 줄여야 하며 어떤 속성이 연관되어있는지 알려주고 있다. `wll-change` 라는 속성으로 브라우저가 어떤 속성이 변화하고 이에 따라 애니메이션을 최적화해야하는지 미리 알려주는 속성도 있다고 한다. 하지만 결국 대응 브라우저의 한계와 마크업 구조의 한계로 더 좋은 방법을 사용하지 못하고 fade-in/out 형식의 애니메이션으로 바꾸었다는 슬픈 이야기로 마무리
- [Making setInterval Declarative with React Hooks — Overreacted](https://overreacted.io/making-setinterval-declarative-with-react-hooks/) - `setInterval` 과 `useState` 를 같이 쓸 때 의도적으로 동작하지 않는데, 이를 해결하기 위해 `useInterval` 을 어떤 방식으로 구현했고 왜 이렇게 되었는지 친절하게 설명해주는 글. 임피던스 미스매치라는 용어를 굉장히 오랜만에 봐서 친숙한데 기본적으론 리액트의 프로그래밍 모델과 `setInterval` 이라는 명령형 API와는 커다란 간극이 있어 제대로 맞지 않는 것을 뜻한다. `useEffect` 의 처리 특성상 불필요한 리랜더가 계속 일어나거나, 적절히 제어를 시도하려 하면 오히려 인터벌이 실행되지 않는 것이다. 그래서 `useRef` 를 사용하는 방안을 보여주었고 깔끔하게 커스텀 훅으로 빼내는 과정까지 보여주면서 마무리한다.
- [스크롤과 관련된 CSS 속성 3가지 - 코드쓰는사람](https://taegon.kim/archives/9807) - 김태곤님이 정리해주신 CSS의 스크롤 관련 속성. 지금은 데스크탑 파이어폭스와 크롬에서만 지원되거나 크롬과 사파리에서만 지원되는 속성이라 조금 아쉽긴 하지만 점진적 지원 측면에서 충분히 쓸만한 속성이다.
- [Using MobX with React Hooks - DEV Community 👩‍💻👨‍💻](https://dev.to/ryands17/using-mobx-with-react-hooks-52h5) - 리액트 Hook API를 MobX와 어떻게 사용해야할지 짚어주는 글. 이번에 'MobX Quick Start Guide' 를 읽으면서 요즘 API 에 맞게 재구현해보고 있는데 이 글에서 짚어주는 포인트를 참고하여 좀 쉽게 접근할 수 있었다. 중요한 것 중에 하나가 `Provider`, `inject` 를 이용하지 않고 `createContext(storeInstance)` , `useContext` 를 활용하게 되었다는 것이다.
- [The 4 Layers of Single Page Applications You Need to Know](https://hackernoon.com/architecting-single-page-applications-b842ea633c2e) - SPA를 만들 때 (혹은 프론트엔드 애플리케이션을 만들 때) 사용했던 4가지 레이어 구분에 대한 이야기. 약간 용어나 개념이 살짝 다르긴 하지만 이미 이런 방식대로 하고있지 않았나 싶다.
- [HTML Semantics - Free tutorial to learn HTML and CSS](https://marksheet.io/html-semantics.html#dont-overthink-semantics) - 마지막 결론 부분 직링크. 우리가 시맨틱 태그를 사용한다고 할 때 너무 깊게 생각하지 말고 딱 이정도만으로도 어지간한 시맨틱 태그 구조화는 이루어낼 수 있다. 더 필요하면 그에 맞추어 생각하면 된다.
- [Reset All Stores? · mobx-state-tree community](https://spectrum.chat/mobx-state-tree/general/reset-all-stores~17735a32-834c-4455-8b8e-cab20dbe00ba) - MST를 쓰면서 특정 조건에 스토어 리셋을 하고 싶은데 어떤 방식이 더 좋을까? 하고 이야기를 나누면서 찾아보다 나온 스레드. `afterCreate` 훅에다 스냅샷을 저장해놓고 그 스냅샷을 적용하는 방법 등 괜찮은 방법들이 여럿 있다.
- [GitHub - nareshbhatia/mobx-state-router: MobX-powered router for React apps](https://github.com/nareshbhatia/mobx-state-router) - Mobx + React-router 를 쓸 때 따로 관리해주어야 하는 불편함이 있는데다, 기존에 있는 mobx-react-router 라이브러리가 썩 만족스럽게 작동하지 않는 부분이 있어서 대체제를 찾다 보니 제일 괜찮아보이는 녀석. 
  - [GitHub - nareshbhatia/mobx-shop: Demo app for mobx-state-router and material-ui](https://github.com/nareshbhatia/mobx-shop) - 위의 라이브러리를 활용한 예제 코드인데, 폴더 구조나 아키텍처가 나름 참고할만하게 되어있다. 페이지 단위(혹은 feature 단위)로 폴더를 구분해서 넣어놓고 `shared` 라는 폴더로 스토어나 공유 가능한 컴포넌트를 가져다가 조합해서 쓰고 있다.
- [(번역) Didact: 자신만의 리액트를 만드는 DIY 가이드](https://velog.io/@wickedev/%EB%B2%88%EC%97%AD-Didact-%EC%9E%90%EC%8B%A0%EB%A7%8C%EC%9D%98-%EB%A6%AC%EC%95%A1%ED%8A%B8%EB%A5%BC-%EB%A7%8C%EB%93%9C%EB%8A%94-DIY-%EA%B0%80%EC%9D%B4%EB%93%9C) - 리액트 아키텍처를 씹고 뜯고 맛보고 즐기고, 파이버까지 직접 구성해보는 DIY 가이드. 이전에 연재되었을 때 본 적이 있었고, 후속 업데이트를 기다리고 있었는데 딱히 별다른 소식은 없었나보다. 하지만 다행히도 다른 분이 번역을 해주셨고, 지금까지 연재된 분량이라도 차근차근 다시 살펴봐야겠다.

## 오픈 소스 프로젝트

- [GitHub - pikapkg/web: Install npm dependencies that run directly in the browser. No Browserify, Webpack or import maps required.](https://github.com/pikapkg/web) - NPM 패키지를 브라우저에서 바로 서빙할 수 있도록 만들어주는 플러그인. 단순히 unpkg 같은 서비스랑은 다른 것 같다. ES Module 시스템에 최적화되어있고, HTTP/2 에도 최적화되어있다. 앞으로 이런 식으로 패키지를 서빙할 수 있도록 생태계가 발전할 수록 우리의 웹 개발은 더욱 쉬워질 것이다. 하지만 [설명 페이지를 보면](https://www.pikapkg.com/about) 아직 많은 노드 모듈들이 CommonJS 기반으로 되어있어서 최적화된 에셋 제공이 어렵다고 한다.
- [GitHub - cometkim/use-pulled-grid: A React hook provides responsive grid container style](https://github.com/cometkim/use-pulled-grid) - 혜성님이 만든 custom hook 인데 이미 적극적으로 hook을 사용하고 계셔서 그런지 어떻게 활용해야할지 좋은 참고가 되는 소스코드였다. 그리고 내가 반응형 그리드를 만든다고 할 때 어떻게 문제를 해결해야할지 조금 가이드가 되기도 했다. 여전히 모르는게 많다. 특히 CSS만의 영역이라고 생각하는 것을 JS로 함께 해결하는 것 등에 대해서 말이다.
- [GitHub - RIP21/ts-get: Alternative to lodash.get that makes it typed and cool as if optional typing proposal is there](https://github.com/RIP21/ts-get) - `lodash.get` 을 타입세이프하게 사용할 수 있게 구현된 작은 라이브러리. TS 환경에서 굉장히 유용하게 사용할 수 있겠다.

## 도구

- [Gitpod - Code Now!](https://www.gitpod.io) - Github 저장소나 PR을 바로 웹 IDE로 열어보고 편집할 수 있게 만들어주는 서비스. 지금 베타 서비스라 오픈 소스 프로젝트에 한해서 1개월에 100시간 이용 가능한데, Gitlab도 사용가능하게 되면 한번 트라이얼로 써 보고 싶다.
- [GitHub - lra/mackup: Keep your applicatiodln settings in sync (OS X/Linux)](https://github.com/lra/mackup) - 애플리케이션 설정까지 백업해주는 도구
- [GitHub - Raathigesh/majestic: ⚡ Zero config GUI for Jest](https://github.com/Raathigesh/majestic/) - 예전에 별을 찍어두었던 라이브러리인데? 깔끔하게 만들어진 Jest GUI 클라이언트다. CRA 프로젝트 뿐 아니라 타입스크립트 프로젝트와도 잘 동작한다고 한다.
