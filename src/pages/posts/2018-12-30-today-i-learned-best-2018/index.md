---
path: '/posts/today-i-learned-best-2018'
date: '2018-12-30'
title: 'Today I Learned - 2018년 Best of Best'
category: 'Today I Learned'
tags:
  - TIL
  - Learning
  - Reading
  - Programming
description: '2018년 Today I Learned 중 인상깊었던 내용을 선별해봤습니다'
---

저는 2017년 10월부터 주력 노트 앱을 [Bear](https://bear.app)로 결정하고 꾸준히 사용해오면서 Today I Learned(TIL)을 작성하기 시작했습니다. 그 전에는 따로 적기보다는 읽고 나서 잊거나, 가끔 트위터에 좋은 글이나 Github에 공개된 오픈 소스 소프트웨어(OSS)를 간단히 요약하여 공유하는 정도만 하고 있었습니다. 한번 살펴 본 지식의 내재화를 위해 직접 노트에 작성하기 시작하면서 크고 작은 도움이 되었다고 생각합니다.

이 글은 제가 어떻게 작성을 해 왔는지 간단히 경험을 공유하면서 올해 살펴봤던 글이나 트윗 OSS 중에 인상깊었던 것을 선별하여 공개하고자 합니다.

## 어떻게 작성하고 있었나?

Bear라는 앱은 태그 기반으로 노트의 카테고리를 구분할 수 있습니다. 태그는 노트 어디에나 넣을 수 있습니다. 매월 해당하는 Today I Learned 노트를 생성하고, 주 단위로 쪼갠 다음 그 주에 알게 된 지식을 리스트 아이템으로 정리하였습니다. 보통은 단순히 `포스트 링크 - 정리 혹은 느낀 점` 방식으로 정리했으나 제가 직접 작성한 글을 내부 노트 링크로 연결하거나 짧은 일기 형식의 글을 작성하기도 했습니다.

![TIL 작성 예](https://cl.ly/58cd92e5458a/til-post-1.png)

노트 작성은 이런 식으로 하였고, 제가 특정 분야의 태그가 매겨져있는 노트를 찾을 때면 사이드바에서 태그를 선택하거나 그 태그 이름으로 검색을 하면 됩니다. 최대한 태그가 적게 생성되도록 노력했지만 대략 이정도의 태그가 나왔습니다.

![TIL 태그들](https://cl.ly/40bdeca3ce0b/til-post-2.png)

체감상 제가 일하고 있는 분야가 분야다보니 `javascript`, `css` 태그를 많이 보았던 것 같습니다. 태그를 하는 방식은 여러분들이 편하신 대로 앱이나 정리 방식에 맞추어서 하시면 되겠습니다.

## 2018년 인상적이었던 배움

저 많은 목록 중 올해 제게 가장 인상깊었던 글의 링크나 트윗 등을 뽑아봤습니다. 어디까지나 개인적인 취향에 불과하기 때문에 참고삼아 보셨으면 좋겠습니다.
각 아이템에 어울리는 주제를 `@` 기호와 함께 태그를 매겼습니다. 필요한 내용 검색하실 때 유용하게 사용될 수 있기를 바랍니다.

- [(번역) 테스트를 작성하라. 너무 많이는 말고. 통합 테스트를 많이 써라](https://adhrinae.github.io/posts/write-mostly-integration-test-kr) - 테스트를 할 가치가 있냐 없냐는 더 이상 논의 할 가치가 없는 주제라고 봅니다. 그렇다면 어떻게 애플리케이션을 효과적으로 테스트 할 것인가? 라는 고민거리를 가지고 있는 분들에게 실용적인 관점을 제공해주는 글입니다. `@Testing`
- ['개발자의 기본기' 를 생각하게 하는 트윗](https://twitter.com/minjang_kim/status/959849128053231619) - 트위터 [redacted (@minjang_kim)](https://twitter.com/minjang_kim)님의 트윗 발췌. 작년 초에도 故 제럴드 와인버그와 이메일로 대화를 주고 받을 때 비슷한 조언을 들은 적이 있습니다. 그 시기 제럴드는 [이런 글](http://secretsofconsulting.blogspot.com/2017/02/how-long-can-i-remain-ruby-java-c.html)을 남겼습니다. 요약하자면 **"특정 언어의 프로그래머로 몇년 먹고살 수 있을지 전전긍긍하지 말고 ‘Programmer’ or ‘Problem-solver’ 같은 사람이 되어 살아남을 생각을 하라''** 라는 내용입니다. `@Developer`
- [자바스크립트로 함수형 프로그래밍 아주 살짝 맛보기](https://adhrinae.github.io/posts/functional-js-tutorial) - 올해 초 함수형 프로그래밍이란걸 실제로 어떻게 적용해봐야할지 긴가민가하다 작은 시도를 해 보았고, 그 과정을 글로 남겼습니다. 최대한 쉽게 기초적인 개념을 설명하려고 했고, 좋은 글 링크도 달았으니 관심 있으시다면 읽어보세요. `@FP`
- [(번역) 두려움, 믿음, 그리고 자바스크립트 - 언제 타입 시스템과 함수형 프로그래밍이 먹히지 않는가](https://adhrinae.github.io/posts/fear-trust-and-javascript-kr) - 자바스크립트 환경에서 함수형 프로그래밍과 타입 시스템을 적용하려 할 때 고려할 수 있는 어려움을 짚어주는 글입니다. `@FP`
- [GitHub - Functional-JavaScript/FunctionalES: ES6+, 함수형 프로그래밍, 비동기, 동시성 프로그래밍](https://github.com/Functional-JavaScript/FunctionalES) - ['함수형 자바스크립트 프로그래밍'](http://aladin.kr/p/tntNr)의 저자 유인동님이 ES6+ 기반으로 설명해주시는 함수형 프로그래밍 강좌 저장소입니다. 최근에 이 내용에서 더욱 발전한 내용으로 [유료 강좌](https://programmers.co.kr/learn/courses/7637)를 내놓으셨습니다. `@FP`
- [예외 처리에 대한 6가지 화두](http://hamait.tistory.com/m/712) - Go 언어를 살짝 살펴보면서 예외 처리하는 방식이 독특하다고 생각했는데, 이 글을 읽으면서 조금 더 예외 처리에 대해 깊게 살펴볼 수 있었습니다. `@Fundamental`
- [RxJS and Reactive Programming - Animations and visual lessons](https://reactive.how) - RxJS의 오퍼레이터가 어떤 방식으로 동작하는지 애니메이션과 함께 쉽게 익힐 수 있도록 알려주는 교재입니다. `@Rx`
- [The 5 Problem-Solving Skills of Great Software Developers - DEV Community 👩‍💻👨‍💻](https://dev.to/lpasqualis/the-5-problem-solving-skills-of-great-software-developers-4e6) - 번역하려고 원작자에게 두번이나 연락을 시도했지만 답장이 없어 포기한 글입니다. 초보 개발자분들이라면 반드시 읽어보길 권합니다. 앞서 줄창 이야기한 '문제 해결 능력' 이라는게 대체 무엇인지 감을 잡을 수 있으실 테고, 일선 학교에서 의무적으로 진행하려고 하는 '소프트웨어 교육' 이라는 것을 이 글에서 보여주는 생각을 기본으로 가르쳐야 한다고 생각합니다. 하지만 현실은.. 🤦🏻‍♂️ `@Developer`
- [Yep, JavaScript Moves Fast. Build Your Component Library Anyway.](https://medium.freecodecamp.org/yep-javascript-moves-fast-build-your-component-library-anyway-a50576ab3031) - 팀 단위로 재사용 가능한 컴포넌트 라이브러리를 구축할 필요성을 역설하는 글 `@React`
- [GitHub - 30-seconds/30-seconds-of-code: Curated collection of useful JavaScript snippets that you can understand in 30 seconds or less.](https://github.com/30-seconds/30-seconds-of-code#take) - 한 개당 30초 이내로 살펴볼 수 있는 간단하고 실용적인 자바스크립트 스니펫 모음. CSS, 리액트 편 등도 있습니다. `@OSS` `@Javascript`
- [I was not ready to become the maintainer of Babel - DEV Community 👩‍💻👨‍💻](https://dev.to/hzoo/i-was-not-ready-to-become-the-maintainer-of-babel-2j6) - 현재 [바벨](http://babeljs.io)을 풀타임으로 관리하고 있는 [Henry Zhu](https://twitter.com/left_pad)가 풀타임 메인테이너로 전업하고 얼마 되지 않아 남긴 글입니다. 흔히 가면 증후군(Imposter syndrome)이라고 여겨지는 증세를 우리가 어떻게 받아들이고 앞으로 나아갈 수 있을 지 영감을 줍니다. `@Developer`
- [GitHub - JaeYeopHan/Interview_Question_for_Beginner: Technical-Interview guidelines written for those who started studying programming. I wish you all the best.](https://github.com/JaeYeopHan/Interview_Question_for_Beginner) - [한재엽](https://jbee-resume.now.sh)님이 만드신 개발자를 위한 기술 면접 문제가 정리된 저장소입니다. `@OSS` `@Developer`
- [Two Years of Functional Programming in JavaScript: Lessons Learned](https://hackernoon.com/two-years-of-functional-programming-in-javascript-lessons-learned-1851667c726) - 실무에 자바스크립트로 함수형 프로그래밍을 2년이나 도입하셨던 분이 남긴 회고. 방법론에 대해 아쉬웠던 점, 하지 말아야 했을 점 등을 잘 정리했기 때문에 앞으로도 관심 있으신 분들이라면 자바스크립트 함수형 프로그램이을 도입하시기 전에 읽어보시면 좋습니다. `@FP` `@Javascript`
- [프로그래머로서의 성장을 도왔던 태도들](https://ahnheejong.name/articles/becoming-better-programmer/) - [안희종](https://ahnheejong.name/about)님이 남긴 글입니다. 더 나은 프로그래머가 되기 위해 어떤 생각을 하고 노력을 했는지 정리되어 있습니다. `@Developer`
- [소프트웨어 개발의 지혜](https://brunch.co.kr/@springboot/35) - 개발자로서 어떤 가치를 중요시하면서 소프트웨어를 개발하십니까? 개발자로서 본질적으로 중요하게 여겨야 하는 가치 뿐 아니라 소프트웨어 개발의 본질에 대해 정리한 내용도 아주 중요하다고 생각하는 글입니다. `@Developer`
- [Algorithms & Data Structures](https://cs-playground-react.surge.sh) - 리액트 기반으로 만들어진 자료구조&알고리즘 학습용 웹앱입니다. `@OSS` `@Fundamental`
- [(번역)  데이터 구조와 설계 — 튜토리얼 – Hyeokwoo Alex Kwon – Medium](https://medium.com/@khwsc1/%EB%B2%88%EC%97%AD-%EB%8D%B0%EC%9D%B4%ED%84%B0-%EA%B5%AC%EC%A1%B0%EC%99%80-%EC%84%A4%EA%B3%84-%ED%8A%9C%ED%86%A0%EB%A6%AC%EC%96%BC-b25792a0aa86) - 흔히 개발을 할 때 '설계' 라는 단어에는 여러가지 뜻이 있습니다. 프로젝트의 구조를 잡는 걸 수도 있고, 프로젝트 전체를 아우르는 데이터의 구조를 잡는 일일 수도 있지요. 이 글은 데이터 구조를 어떻게 설계하는지 잘 짚어주는 튜토리얼입니다. `@Database` `@Fundamental`
- [GitHub - sw-yx/react-typescript-cheatsheet: a cheatsheet for react users using typescript with react for the first (or nth!) time](https://github.com/sw-yx/react-typescript-cheatsheet) - 리액트 + 타입스크립트를 도입할 때 설정부터 타이핑까지 막막한 분들이 많으실텐데 이 README 한번 살펴보시면 대부분 커버됩니다. 저도 실무에서 개발할 때 쓰는 타이핑 등은 이 글을 크게 벗어나지 않습니다. `@React` `@Typescript` `@OSS`
- [(번역) 아주 거대한 (자바스크립트) 어플리케이션을 구축하기 – Steady Study – Medium](https://medium.com/steady-study/%EB%B2%88%EC%97%AD-%EC%95%84%EC%A3%BC-%EA%B1%B0%EB%8C%80%ED%95%9C-%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EC%96%B4%ED%94%8C%EB%A6%AC%EC%BC%80%EC%9D%B4%EC%85%98%EC%9D%84-%EA%B5%AC%EC%B6%95%ED%95%98%EA%B8%B0-3aa37fc45122) - 자바스크립트 생태계가 발전하면서 자바스크립트만으로도 아주 거대한 규모의 애플리케이션을 만들 수 있게 되었습니다. 하지만 그에 따라 프로젝트를 관리 해야하는데 여러 어려움에 부딪히게 됩니다. 이 글을 통해 어떤 부분을 유의하면서 프로젝트를 확장시킬지 도움되는 팁을 얻을 수 있습니다. `@Javascript`
- [GitHub - jamiebuilds/the-super-tiny-compiler: Possibly the smallest compiler ever](https://github.com/jamiebuilds/the-super-tiny-compiler) - '컴파일러' 라는게 어떻게 동작하는지 기본 원리를 파악할 수 있게 도움을 주는 예제 코드입니다. 자바스크립트로 작성되어 있습니다. `@OSS` `@Fundamental`
- [(번역) 프로그래시브 웹앱 성능에 대한 리엑트, 프리엑트 케이스 스터디 : Treebo - KYU.IO 🌾](https://kyu.io/ko/%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EC%8B%9C%EB%B8%8C-%EC%9B%B9%EC%95%B1-%EC%84%B1%EB%8A%A5%EC%97%90-%EB%8C%80%ED%95%9C-%EC%BC%80%EC%9D%B4%EC%8A%A4-%EC%8A%A4%ED%84%B0%EB%94%94-treebo/) - 리액트 애플리케이션에 PWA(Progressive Web App)을 도입하면서 성능이 향상된 사례 번역. [핀터레스트 사례](https://medium.com/dev-channel/a-pinterest-progressive-web-app-performance-case-study-3bd6ed2e6154)도 있긴 하지만 번역되지 않은 것 같아 이 글을 먼저 소개합니다. `@PWA` `@React`
- [Keeping a Clean House with Typescript at Scale – Panaseer Labs Engineering & Data Science – Medium](https://medium.com/panaseer-labs-engineering-data-science/clean-house-with-typescript-ba3f43de05a2?WT.mc_id=link-twitter-jeliknes) - 타입스크립트 프로젝트의 규모가 커지면서 확장성을 강화하기 위해 취한 조치가 정리된 글입니다. 초기에 타입스크립트를 도입할 때 실수하기 쉬운 부분을 짚어주는 것 부터 시작하여 더 세부적인 케이스까지 안내하고 있습니다. `@Typescript`
- [(번역) 나는 어떻게 더 나은 프로그래머가 되었는가](https://adhrinae.github.io/posts/how-i-became-a-better-programmer-kr) - [Prettier](https://prettier.io)를 만든 [James Long](https://twitter.com/jlongster)이 자신이 프로그래머로서 어떻게 발전했는지 짚어본 글을 번역했습니다. "익숙하지 않은 일에 뛰어드는 것" 을 강조했던게 기억납니다. `@Developer`
- [좋은 개발자 / 유명한 개발자 – Cho Minkyu – Medium](https://medium.com/@pitzcarraldo/%EC%A2%8B%EC%9D%80-%EA%B0%9C%EB%B0%9C%EC%9E%90-%EC%9C%A0%EB%AA%85%ED%95%9C-%EA%B0%9C%EB%B0%9C%EC%9E%90-19b20a7d6ace) - 이 글을 읽고 제가 원하는 서비스를 개발자/사용자가 만족할 수 있는 퀄리티로 만드는 좋은 개발자가 되고 싶다는 목표를 세웠습니다. `@Developer`
- [Working From Home Is Not Remote Work](https://blog.trello.com/working-from-home-is-not-remote-work) - 원격근무를 운용할 거면 제대로 하자는 글입니다. 집에서 일을 하더라도 업무 시간에는 절대 방해받지 않는 환경을 조성하고, 사무실에 있는 사람들도 원격근무자와 커뮤니케이션을 할 때 절대 어려움이 없어야 한다는 것을 강조합니다.  `@Reading`
- [훌륭한 팀원의 조건 - Strong Views, Weakly Held – Kisang Pak – Medium](https://medium.com/@kpak/%ED%9B%8C%EB%A5%AD%ED%95%9C-%ED%8C%80%EC%9B%90%EC%9D%98-%EC%A1%B0%EA%B1%B4-strong-views-weakly-held-17880611d962) - 같이 일을 하다 보면 어떤 사람을 '훌륭한 팀원' 이라고 생각하게 되시나요? 각자 생각하시는 기준과 비교해보시면서 읽어보면 좋은 글이라고 생각합니다. `@Reading`
- [도움을 요청할 때 해서는 안 되는 말들](http://newspeppermint.com/2018/07/04/howtoaskforhelp/) - 위의 글과 바로 엮어서 보셔도 좋은 글입니다. 어렵사리 도움을 요청하는데 도움을 받는 쪽에서도 최대한의 효과를 얻고, 도움을 주는 쪽에서도 효율적인 도움을 줄 수 있는게 좋겠죠. `@Reading`
- [(번역) 자바스크립트 & 타입스크립트의 순환 참조를 한방에 해결하는 방법](https://adhrinae.github.io/posts/fix-circular-dependency-kr) - 노드 모듈을 불러올 때 순환 참조로 고통을 받으신 적 있다면 권해드리는 글입니다. 이 글 말고도 해결 방법은 다양합니다만, 이 주제에 익숙하지 않으신 분들이라면 모듈이 어떻게 로딩되는지 그림을 통해 간단히 살펴보실 수 있습니다. `@Javascript`
- [타입스크립트, 써야할까? | DailyEngineering](https://hyunseob.github.io/2018/08/12/do-you-need-to-use-ts/) - 타입스크립트를 도입하지 않는 이유는 여러가지가 있을 겁니다. 부정적인 선입견이 있을 수도 있고, 필요성을 느끼지 못할 수도 있고요. 이 글에서는 타입스크립트를 오래 사용하면서 얻은 경험을 기반으로 좋은 의견을 제시하고 있습니다. `@Typescript`
- [JavaScript engine fundamentals: optimizing prototypes · Mathias Bynens](https://mathiasbynens.be/notes/prototypes) - 자바스크립트 엔진이란게 어떻게 돌아가고, 프로토타입은 어떻게 동작하는지 굳이 알지 않아도 애플리케이션을 작성하는데 큰 지장은 없을 수 있습니다. 적어도 이 글은 제가 여태까지 살펴본 자바스크립트 엔진 & 프로토타입 관련 글 중 가장 자세한 글이라고 생각합니다. `@Javascript` `@Fundamental`
- [What makes a good frontend developer? | Zell Liew](https://zellwk.com/blog/good-frontend-developer/) - 먼저 초보 프론트엔드 개발자분들은 이 분의 메일링 리스트에 가입하는걸 권해드립니다. 기본적인 개념을 아주 쉽게 설명하는 글을 많이 올려줍니다. 저도 많이 배우고 있고요. 좋[은 자바스크립트 개발자가 되기 위한 글이 이전에도 번역되어 공유되다가 최근에 다시 재조명된 것을 본 적이 있는데](https://brunch.co.kr/@chiyodad/9), 그 글보다는 이 글이 현실적으로 더 도움이 된다고 생각합니다. `@Developer`
- [The Guardian · GitHub](https://github.com/guardian) - 영국 가디언 지의 깃헙 저장소입니다. `frontend` 저장소를 살펴보시면 접근성을 고려하여 얼마나 미려하게 설계가 되어있는지 알 수 있습니다. `@OSS`
- [Ideal Beginner Editor+REPL Setup · Issue #44 · BetterThanTomorrow/calva · GitHub](https://github.com/BetterThanTomorrow/calva/issues/44) - 클로저스크립트를 공부하기 시작하면서 다양한 자료를 찾다가 보니 발견한 이슈입니다. 클로저(스크립트)에 처음 접근하는 사람들이 어떤 설정으로 어떻게 학습을 할 지 질문과 답변이 오가는 이슈입니다. `@Clojure`
- [Thinking About React, Atomically ⚛ – Noteworthy - The Journal Blog](https://blog.usejournal.com/thinking-about-react-atomically-608c865d2262) - 현재 회사 프로젝트도 Atomic Design 기반으로 컴포넌트를 나누어 두었습니다. 그 기준을 어떻게 설정할지 고민을 했었는데 이 글이 아주 잘 설명해주고 있습니다. `@React`
- [GitHub - streamich/libreact: Collection of useful React components](https://github.com/streamich/libreact) - 리액트 애플리케이션을 개발하면서 유용하게 사용될 수 있는 컴포넌트들의 모음집입니다. 사용하지 않으시더라도 소스 코드를 조금 살펴보시면 Render Props, HOC를 이해하시는데 큰 도움이 됩니다. `@React`
- [GitHub - nikitavoloboev/my-mac-os: List of applications and tools that make my macOS experience even more amazing](https://github.com/nikitavoloboev/my-mac-os) - macOS 기반으로 개발을 할 때 생산성을 극대화할 수 있는 도구와 사용법을 잘 정리해준 저장소입니다. 저도 여기 소개 된 많은 앱을 사용하고 있고, 배운 것도 많아서 macOS를 사용하는 개발자분들에게 꼭 한번 살펴보시길 권하고 싶습니다. `@macOS` `@Tool`
- [Here’s yet another list of exciting projects to build](https://medium.freecodecamp.org/summer-is-over-you-should-be-coding-heres-yet-another-list-of-exciting-ideas-to-build-a95d7704d36d) - '연습을 위해 사이드 프로젝트를 해보라' 는 조언은 많이 받아보셨겠지만 구체적으로 뭘 만들어야 할지 막막할 때가 많습니다. 이 글을 만들어볼만한 클론/사이드 프로젝트 주제들을 한 뭉치 던져줍니다. `@Developer`
- [Theme in React JS – CHEQUER – Medium](https://medium.com/chequer/theme-in-react-js-dbf5377d0890) - [AXISJ](https://axisj.com)를 만드신 장기영님의 글입니다. 리액트 애플리케이션을 만들면서 컴포넌트의 스타일 설정, 나아가 전반적인 테마를 어떻게 지정할 수 있을지 `styled-components` 의 예를 들어 설명하고 있습니다. `@React`
- [GitHub - leonardomso/33-js-concepts: 📜 33 concepts every JavaScript developer should know.](https://github.com/leonardomso/33-js-concepts) - 자바스크립트를 학습 할 때 꼭 알아두어야 할 33가지의 중요한 개념을 설명하는 글과 영상 모음집입니다. `@Javascript`
- [그런 REST API로 괜찮은가](https://www.youtube.com/watch?v=RP_f5dMoHFc) - 작년 DEVIEW에 나온 발표라고 합니다. REST API 설계시 간과하기 쉬운 요소들, 더 나은 설계를 위해 고려해야 할 부분들에 대해 잘 정리해주셨습니다. [슬라이드도 있습니다.](https://slides.com/eungjun/rest) `@Fundamental`
- [GitHub - hg-pyun/iterize: Use JavaScript Iterator, Easily](https://github.com/hg-pyun/iterize) - 타입스크립트 기반으로 만들어진 이터레이터 유틸리티입니다. 이터레이터 개념에 대해 궁금하셨던 분들은 이 코드와 함께 핵심 개념을 잘 파악하실 수 있습니다. `@OSS` `@Typescript`
- [React - How to use keys to avoid using getDerivedStateFromProps - Gyandeep Singh](https://gyandeeps.com/react-getderivedstatefromprops-key/) - 이전 상태와 현재 상태를 비교하여 리액트 컴포넌트의 리랜더링을 일으킬 때 `getDerivedStateFromProps` 메서드를 우선저긍로 사용하는 실수를 하기 쉽습니다. 하지만 `key` 만 잘 활용하면 손쉽게 리랜더링을 제어할 수 있습니다. `@React`
- [We all <3 Terminals. - Terminals Are Sexy](https://terminalsare.sexy) - 터미널로 활용할 수 있는 다양한 도구와 방법들 모음입니다. `@Terminal` `@Tool`
- [web.dev](https://web.dev) - 미래지향적 웹 개발을 위해 구글이 제안하는 방법론, 활용할 수 있는 도구를 안내하는 사이트입니다. `@Web`
- [GoogleChromeLabs · GitHub](https://github.com/GoogleChromeLabs) - 여기 있는 프로젝트들 중 작은 프로젝트의 소스코드부터 살펴보시면 배울 점이 많습니다. 주석으로 기능 설명도 잘 되어있고, 타입스크립트 기반 프로젝트도 좀 있고 웹 컴포넌트도 활용하고 있어서 해당 기술에 관심이 있으시다면 큰 도움이 되리라 생각합니다. `@OSS` `@Typescript` `@Web`
- [(번역) 최신 네트워크 로드 밸런싱 및 프록시 소개](https://ziwon.github.io/post/modern-network-load-balancing-and-proxying/) - 애플리케이션 배포 인프라 구축하시면서 로드 밸런서 이야기는 당연히 들어보셨으리라 생각합니다. 꽤 긴 글이지만 기본 네트워크 지식을 가지고 쭉 읽어보시면 유용한 정보들이 많습니다. `@Infrastructure`
- [GitHub - cssanimation/css-animation-101: Learn how to bring animation to your web projects](https://github.com/cssanimation/css-animation-101) - CSS 애니메이션 구현의 기초를 알려주는 eBook이 공유되는 저장소입니다. `@CSS`
- [CSS Guidelines (2.2.5) – High-level advice and guidelines for writing sane, manageable, scalable CSS](https://cssguidelin.es) - CSS를 작성할 때 적용하기 좋은 조언들이 한가득 담긴 글입니다. 단순히 BEM같은 클래스 네이밍 컨벤션에 대한 이야기가 아니라는데 주목해주세요. `@CSS`
- [Overreacted](https://overreacted.io) - Redux의 제작자이자, 지금은 리액트 코어 개발자로 일하고 있는 [Dan Abramov](https://mobile.twitter.com/dan_abramov)의 블로그입니다. 개인 블로그를 최근에 열었다는게 오히려 신기할 정도인데요. 리액트의 내부 동작을 알기 쉽게 설명해주는 글이 많습니다. `@Developer` `@React` `@OSS`
- [편리한 git alias 설정하기 - 기계인간 John Grib](https://johngrib.github.io/wiki/git-alias/) - Git을 GUI로만 쓰시는 분들에게는 별로 공감이 되지 않는 주제일 수 있으나, Git CLI를 더 유용하게 이용할 수 있도록 만들어주는 다양한 팁이 공유된 글입니다. `@Git` `@Terminal`
- [Meta Tags — Preview, Edit and Generate](https://metatags.io) - 주요 사이트 및 애플리케이션에 사용되는 OpenGraph가 어떤 모양으로 나타날지 직접 메타 태그를 입력해보고 눈으로 견본을 확인할 수 있는 웹 애플리케이션입니다. `@Tool`
- [(번역) 기술 업계의 독성 말투 문제, 고칩시다! - Here, Edward 👨🏻‍💻](https://edykim.com/ko/post/tech-has-a-toxic-tone-problem-lets-fix-it/) - IT 업계에서 일하면서 언제나 커뮤니케이션의 중요성을 실감하고 있습니다. 커뮤니케이션에 문제가 발생하는 상황은 여럿 있지만, 이 글은 독성 말투에 초점을 맞추어 좋지 않은 예와 현실적인 대안을 제시하고 있습니다. `@Developer`
- [Web components still need to be accessible - 24 Accessibility](https://www.24a11y.com/2018/web-components-still-need-to-be-accessible/) - 웹 컴포넌트를 만들 때도 당연히 접근성을 신경써야 한다는 글입니다. 그게 다는 아닙니다. SPA(Single Page Application)을 만들면서 우리는 컴포넌트의 구조를 어떻게 잘 작성하는지만 신경 쓸 때가 많은데, 결국 그렇게 작성한 코드의 결과물은 브라우저에 그려지는 DOM입니다. 그 DOM의 접근성을 신경써야 하는 것은 프론트엔드 개발자의 의무입니다. `@Web`
- [JavaScript 코드 리뷰 - 코드 리뷰 문화 – 좋은 JavaScript 코드 작성을 위한 블로그](https://cimfalab.github.io/deepscan/2016/08/code-review-1) - 제목은 자바스크립트 코드 리뷰라고 이야기하고 있지만, 어떤 언어 기반이라 하더라도 팀에 코드 리뷰를 적용하는 방법을 잘 안내하고 있는 훌륭한 글입니다. `@Developer`

## 마치며

원래는 10개정도만 추려보려 했는데 목록이 산으로 가버렸네요. 다음 달부터는 매달치 TIL 의 정리본을 월말에 공유할 예정입니다. 글을 발행하기 위한 정리를 하면서 저도 복습할 기회를 얻을 수 있어서 좋네요.

여기서 몇 개라도 유용한 정보를 얻어가셨으면 좋겠습니다. 새해 복 많이 받으세요.