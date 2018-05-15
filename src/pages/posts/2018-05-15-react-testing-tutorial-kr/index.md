---
path: "/posts/react-testing-tutorial-kr"
date: "2018-05-15"
title: "[번역] 리액트 테스팅 튜토리얼: 테스트 프레임워크와 컴포넌트 테스트 방법"
category: "React"
tags:
  - Javascript
  - React
  - Testing
  - Translation
---

본 튜토리얼은 [Robin Wieruch](https://www.robinwieruch.de/about/)님의 [React Testing Tutorial](https://www.robinwieruch.de/react-testing-tutorial/) 을 한글로 번역한 것입니다. 번역과 관련된 의견 및 토론은 [번역 저장소](https://github.com/adhrinae/react-testing-tutorial-kr)에 이슈로 남겨주세요.

---

탄탄한 애플리케이션을 만들기 위해 테스트를 작성하는 것은 소프트웨어 개발을 하면서 아주 중요한 부분입니다. 테스트는 애플리케이션이 어느 정도 확실한 수준까지 동작하고 있는지 자동으로 확인할 수 있는 도구가 됩니다.  그 수준은 질과 양, (커버리지) 그리고 테스트의 종류(단위 테스트, 통합 테스트, E2E 테스트)에 따라 결정됩니다. -- **역주: 앞으로는 E2E(End-to-End) 테스트를 전체 테스트라고 명명하겠습니다. 더 적절한 표현에 관한 의견은 댓글로 남겨주세요.**

이 글은 **리액트 앱을 테스팅하는데 필요한 모든 주제를 다루고자 합니다.** 여러분은 주로 순수한 비지니스 로직을 다룬 리액트 컴포넌트를 테스트하는 법을 익히게 됩니다. 그리고 다양한 테스팅 라이브러리나 프레임워크를 선보이고 있으므로 각기 다른 경우에 맞추어 사용하시면 됩니다. 리액트 애플리케이션을 위한 테스트 설정 및 작성 방법을 익히게 되며, Mocha, Chai, Sinon, Enzyme, Jest를 테스트 도구로 사용하게 됩니다.

만약 [create-react-app](https://github.com/facebook/create-react-app) 기반으로 구성된 애플리케이션을 만들고 계시다면 대부분의 설정에 관한 내용은 넘어가셔도 됩니다. create-react-app 애플리케이션에 기본 테스트 도구로 Jest가 포함되어 있습니다. 여기에 수동으로 Sinon이나 Enzyme을 추가할 수도 있습니다.

그렇지 않다면 [링크를 클릭하여 간단한 리액트 + 웹팩 애플리케이션 설정](https://www.robinwieruch.de/minimal-react-webpack-babel-setup/) 을 참고하여 프로젝트를 만드시길 권합니다. 링크 글을 따라 설정이 완료되면 튜토리얼을 따라 테스트 환경을 구축할 수 있습니다.

미리 말씀드린대로 이 글은 **리액트 애플리케이션에 각기 다른 테스트 라이브러리를 어떻게 설정하고 적용하는지** 보여드립니다. 대략적으로 [테스팅 피라미드](https://www.google.com/search?q=testing+pyramid) 를 따라가게 될 겁니다. 여기서 테스팅 피라미드를 따라간다는 것은 대부분은 단위 테스트를 작성하고, 이어서 어느 정도의 통합 테스트를 작성한 뒤에 몇 가지 전체 테스트를 작성한다는 뜻입니다. 하지만 리액트 애플리케이션은 주로 함수를 사용하기보다 컴포넌트를 사용하기 때문에 테스트할 때 다른 접근 방식이 있습니다. ["통합 테스트를 주로 작성하고 단위 테스트는 그리 많이 작성하지 않는"](https://adhrinae.github.io/posts/write-mostly-integration-test-kr) 전략입니다. 이 방법은 튜토리얼 뒤에서 다시 설명하겠습니다.

**대체 단위, 통합, 전체 테스트가 뭘까요?** 일반적으로 단위 테스트란 애플리케이션 일부(주로 컴포넌트)를 독립적으로 테스트하는 것이고, 통합 테스트란 서로 다른 부분(각기 다른 컴포넌트들)이 모여 특정 상황에서 잘 엮여서 작동하는지 확인하는 것입니다. 통합 테스트의 예로 특정 컴포넌트의 모든 필수 속성값(Props)이 자손 컴포넌트에 제대로 전달되었는지 확인하는 경우가 있습니다. 마지막이자 중요한 전체 테스트는 애플리케이션을 브라우저 환경에서 테스트하는 것입니다. 이메일 주소를 넣고 비밀번호를 입력한 뒤에 백엔드 서버로 Form을 제출하는 [회원 가입 과정](https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial/) 전체를 흉내내볼 수도 있습니다.

이 튜토리얼의 또 다른 목표는 여러분들에게 너무 복잡하지도 않으면서 전반적으로 적용할 수 있는 몇 가지 **일반적인 테스트 패턴과 모범 사례**를 알려드리는 것입니다. 매번 테스트 자체를 어떻게 작성해야 하는지 고민하지 않고 리액트 컴포넌트를 효율적으로 테스트 하는데 도움이 될 겁니다. 따라서 대부분의 테스트는 컴포넌트 전반에 걸쳐 적용할 수 있는 공통 패턴을 따릅니다. 이러한 테스트 패턴은 [TDD(테스트 주도 개발)](https://en.wikipedia.org/wiki/Test-driven_development) 방법을 적용하게 되면 더욱 흥미로워집니다. 테스트를 먼저 작성하고 컴포넌트를 그 뒤에 작성하게 되지요. 결과적으로 이 가이드가 리액트 테스트의 몇가지 모범 사례를 제시해주고, 리액트 테스트 프레임워크의 생태계를 이해하며 각각의 도구를 어떻게 설정하고 사용하는지 알려드리고자 합니다.

예제 코드는 [Github 저장소](https://github.com/rwieruch/react-components-test-setup) 에서 확인하실 수 있습니다.

---

<!-- TOC -->

- [테스트를 위한 간단한 리액트 애플리케이션 설정하기](#테스트를-위한-간단한-리액트-애플리케이션-설정하기)
- [리액트에서 Mocha와 Chai 테스트 설정하기](#리액트에서-mocha와-chai-테스트-설정하기)
- [리액트 State 변경을 단위 테스트하기](#리액트-state-변경을-단위-테스트하기)
- [리액트에 Enzyme 테스트 설정하기](#리액트에-enzyme-테스트-설정하기)
- [Enzyme으로 리액트 테스트하기 - 리액트 컴포넌트를 단위, 통합 테스트하는 방법](#enzyme으로-리액트-테스트하기---리액트-컴포넌트를-단위-통합-테스트하는-방법)
- [리액트에서 Sinon 테스트 설정하기](#리액트에서-sinon-테스트-설정하기)
- [Sinon으로 리액트 테스트하기 - 비동기 코드를 테스트하는 방법](#sinon으로-리액트-테스트하기---비동기-코드를-테스트하는-방법)
- [리액트에서 Jest 설정하기](#리액트에서-jest-설정하기)
- [Jest로 리액트 테스트하기 - 컴포넌트 스냅샷 테스트](#jest로-리액트-테스트하기---컴포넌트-스냅샷-테스트)
- [Cypress.io를 활용한 리액트 전체 테스트](#cypressio를-활용한-리액트-전체-테스트)
- [리액트 컴포넌트 테스트와 CI(Continuous Integration)](#리액트-컴포넌트-테스트와-cicontinuous-integration)
- [Coveralls로 리액트 컴포넌트의 테스트 커버리지 확인하기](#coveralls로-리액트-컴포넌트의-테스트-커버리지-확인하기)
- [마치며](#마치며)
- [번역 후기](#번역-후기)

<!-- /TOC -->

---

## 테스트를 위한 간단한 리액트 애플리케이션 설정하기

테스트를 설정해서 다양한 라이브러리를 사용해보고 리액트 컴포넌트 테스트를 작성하기 위해, 먼저 테스트가 실행 될 간단한 리액트 애플리케이션이 필요합니다. 일단 기본이 되는 `App` 컴포넌트를 만들어 보겠습니다. 만약 아래의 과정이 너무 어렵게 느껴진다면, 테스트를 익히시기에 앞서 [리액트 도움닫기](https://github.com/sujinleeme/the-road-to-learn-react-korean) 를 보시고 리액트 자체를 배우셔야 합니다.

그럼 `src/index.js` 파일부터 시작해보겠습니다. 아직 `App` 컴포넌트는 구현되지 않았지만 불러와서(import) render 함수를 실행해두겠습니다.

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
```

App 컴포넌트는 자신의 고유 상태를 가지고 있는 ES6 클래스입니다. 그리고 더하기 버튼과 빼기 버튼을 누를때마다 숫자를 하나씩 더하거나 빼는게 가능하지요. `src/App.js` 파일에 작성합니다.

```jsx
import React, { Component } from 'react';

class App extends Component {
  constructor() {
    super();

    this.state = {
      counter: 0,
    };

    this.onIncrement = this.onIncrement.bind(this);
    this.onDecrement = this.onDecrement.bind(this);
  }

  onIncrement() {
    this.setState((prevState) => ({
      counter: prevState.counter + 1,
    }));
  }

  onDecrement() {
    this.setState((prevState) => ({
      counter: prevState.counter - 1,
    }));
  }

  render() {
    const { counter } = this.state;

    return (
      <div>
        <h1>My Counter</h1>
        <p>{counter}</p>

        <button
          type="button"
          onClick={this.onIncrement}
        >
          Increment
        </button>

        <button
          type="button"
          onClick={this.onDecrement}
        >
          Decrement
        </button>
      </div>
    );
  }
}

export default App;
```

여러분들에게 이 컴포넌트가 어떻게 작동하는지 전부 명료하게 보이리라 생각합니다. (만약 그렇지 않다면 아까 말씀드린대로 리액트 도움닫기 책을 먼저 읽어주세요)

하지만 사용자 경험을 반영한 애플리케이션은 아니네요. 나중애 부분적으로 분리된 부분을 테스트해보기 위해 몇 가지 기능을 추가해보겠습니다. `this.setState()`  메서드가 실제로는 비동기적으로 작동하기 때문에 [객체를 인자로 넘기는 대신에 함수를 인자로 넘기고 있습니다](https://www.robinwieruch.de/learn-react-before-using-redux/). 이 때 객체로 인자를 넘길때에 비해 유일한 장점은 콜백 함수 안에서 현재의 상태에 접근할 수 있다는 겁니다. 이에 더해서 컴포넌트와 완전히 별개로 함수 자체를 테스트 할 수 있게 만듭니다.

```jsx
import React, { Component } from 'react';

const doIncrement = (prevState) => ({
  counter: prevState.counter + 1,
});

const doDecrement = (prevState) => ({
  counter: prevState.counter - 1,
});

class App extends Component {
  constructor() {
    // ...
  }

  onIncrement() {
    this.setState(doIncrement);
  }

  onDecrement() {
    this.setState(doDecrement);
  }

  render() {
    // ...
  }
}

export default App;
```

나중에 테스트 파일에서 이 함수들을 불러오기 위해 컴포넌트에서 내보내기(export)를 설정하겠습니다.

```jsx
import React, { Component } from 'react';

export const doIncrement = (prevState) => ({
  counter: prevState.counter + 1,
});

export const doDecrement = (prevState) => ({
  counter: prevState.counter - 1,
});

class App extends Component {
  //...
}

export default App;
```

이제 컴포넌트의 고유 상태를 변경하기 위해 사용되는 함수들이 컴포넌트와 분리되었기 때문에 별도로 테스트할 수 있게 되었습니다. 나중에 이런 개별 함수를 테스트하는 일을 단위 테스트라고 부르게 됩니다. 이 함수들을 테스트할 때는 함수에 입력값을 넣고 테스트는 기대되는 결과값을 단언(asserts)합니다. 순수 함수(입력 값에 따른 출력값이 동일하며 함수 외부의 환경에 영향을 주고받지 않는 함수)이기 때문에 부수 효과도 없습니다.

이제 우리의 애플리케이션에 자손 컴포넌트를 하나 추가해보겠습니다. 나중에 자손 컴포넌트를 활용한 통합 테스트를 하게 됩니다. 개별 컴포넌트를 각자 테스트한다면 단위 테스트를 하는 것이고 두 컴포넌트를 아우르는 환경을 테스트를 하게 되면 통합 테스트가 됩니다.

```jsx
// ...

class App extends Component {
  // ...

  render() {
    const { counter } = this.state;

    return (
      <div>
        <h1>My Counter</h1>
        <Counter counter={counter} />

        <button
          type="button"
          onClick={this.onIncrement}
        >
          Increment
        </button>

        <button
          type="button"
          onClick={this.onDecrement}
        >
          Decrement
        </button>
      </div>
    );
  }
}

export const Counter = ({ counter }) =>
  <p>{counter}</p>

export default App;
```

보시다시피 컴포넌트가 잘 내보내졌습니다. 이렇게 하면 강좌 뒷부분에서 테스트 파일을 작성할 때 원하는 컴포넌트를 불러올 수 있습니다. 아무리 `Counter` 컴포넌트가 애플리케이션 전체에 걸쳐 재사용되는 일이 없다 하더라도, 테스트를 위해서 컴포넌트나 함수를 내보내는 게 좋습니다. 이제 다음 장에서 테스트를 설명하기 위한 애플리케이션 준비가 끝났습니다.

## 리액트에서 Mocha와 Chai 테스트 설정하기

이번 장에서 Mocha(모카)와 Chai(차이)로 리액트 테스트를 실행하기 위해 설정하는 법을 알려드리겠습니다. 내보내진 함수 하나를 가지고 첫 번째 단언(assertion)을 구현하고 실행해보겠습니다. 먼저 특정 프레임워크(역주: 여기서는 애플리케이션 자체를 의미한다고 봅니다) 안에 있는 모든 테스트를 실행시키는 역할을 맡는 실행기가 필요합니다. 그 실행기가 [Mocha](https://github.com/mochajs/mocha) 입니다.Mocha는 리액트 애플리케이션에 사용되는 유명한 테스트 실행기입니다. 이와 달리 또 다른 유명한 테스트 실행기인 Karma(카르마)는 앵귤러 애플리케이션을 테스트하는데 주로 사용됩니다.

커맨드 라인에서 Mocha를 개발 의존성 모듈로 설치하겠습니다.

	npm install --save-dev mocha

그리고 단언을 작성하기 위해 사용되는 요소가 필요합니다. 누군가는 "X는 Y와 같아야 한다(Expect X to be equal to Y)" 라고 알려주어야 하거든요. 우리는 이번에 [Chai](https://github.com/chaijs/chai)를 사용해서 단언을 작성하겠습니다. Chai도 커맨드 라인으로 설치해줍니다.

	npm install --save-dev chai

리액트 컴포넌트를 테스트 할 때 가상의 브라우저 환경을 만들어주어야 할 필요가 있습니다. 왜냐면 컴포넌트들은 실제로 HTML로 그려지면서 브라우저의 DOM이 될 테니까요. 하지만 테스트 코드는 실제 브라우저에서 실행되지 않기 때문에 컴포넌트를 직접 테스트하기 위한 최소한의 환경을 갖추어야 합니다. 그래서 [jsdom](https://github.com/jsdom/jsdom)도 의존성 모듈로 설치해야 합니다. jsdom은 뒷장에서 만들어 볼 테스트에서 가상의 브라우저 환경을 만들어줍니다.

	npm install --save-dev jsdom

이렇게 테스트 환경을 구축하기 위한 최소한의 라이브러리들을 설치했습니다. 몇 가지 테스트들을 작성하고 실행해 본 뒤에 나중에는 더 발전된 라이브러리를 사용하여 리액트 컴포넌트 테스트 환경을 보강해볼 예정입니다.

이번 장 마지막 과정으로, 테스트를 실제로 실행하기 위해 라이브러리를 설정하는 법을 살펴보겠습니다. `src` 폴더와 같은 레벨에 `test` 폴더와 그 안에 필요한 설정 파일들을 만들겠습니다.

```
mkdir test
cd test
touch helpers.js dom.js
```

위의 파일은 커맨드 라인에서 테스트 스크립트를 실행할 때 환경 설정하는데 사용됩니다. 먼저 `test/helpers.js` 파일부터 보겠습니다.

```javascript
import { expect } from 'chai';

global.expect = expect;
```

기껏 한거라곤 `expect` 함수를 Chai에서 가져와서 할당해둔겁니다. 이 함수는 나중에 테스트 할 때 "X는 Y와 같아야 한다" 는 단언을 작성할 때 사용합니다. 더 나아가 `expect` 함수는 이 파일을 사용하는 모든 테스트 파일의 전역 함수로 할당됩니다. 그러면 매번 `expect` 함수를 직접 가져오지 않고도 바로 사용할 수 있게 됩니다. 조금 뒤에는 더 많은 함수를 테스트용 전역 함수로 추가하게 됩니다. 어쨌든 거의 모든 테스트에 사용하는 함수들이니까요.

`test/dom.js` 파일에는 가짜 브라우저 환경을 설정해서 리액트 컴포넌트가 HTML로 그려지도록 설정합니다.

```javascript
import { JSDOM } from 'jsdom';

const { window } = new JSDOM('<!doctype html><html><body></body></html>');

function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .reduce((result, prop) => ({
      ...result,
      [prop]: Object.getOwnPropertyDescriptor(src, prop),
    }), {});
  Object.defineProperties(target, props);
}

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};

copyProps(window, global);
```

이 강좌에서는 위의 코드 자체를 깊이 설명하진 않겠습니다. 기본적으로 리액트 컴포넌트 테스트를 위해 브라우저의 동작을 흉내낸다고 생각하시면 됩니다. jsdom 라이브러리가 브라우저에 사용되는 `window` 객체를 만들고 `document` 객체같은 객체를 추가합니다. 코드 내용이 이해하기 힘들다고 너무 걱정하지 마세요. 뒤에 이 파일을 건드릴 일은 거의 없습니다.

이렇게 필요한 헬퍼 파일이 모두 준비되었습니다. 하나는 테스트 파일 전체에 사용되는 함수를 전역 함수로 만드는 파일이고(어쨌든 필요하게 됩니다), 나머지 하나는 리액트 컴포넌트를 테스트 할 때 DOM을 흉내내는 설정 파일입니다. 이제 테스트를 위한 스크립트를 `package.json` 에 작성해야 합니다. 특정 접미사(spec, test 등)가 있는 파일을 모두 실행하는데, 실행하면서 위에 만들어둔 파일을 설정 파일로 사용하는 스크립트를 만듭니다.

```json
"scripts": {
  "start": "webpack-dev-server --config ./webpack.config.js",
  "test:unit": "mocha --require babel-core/register --require ./test/helpers.js --require ./test/dom.js 'src/**/*.spec.js'"
},
```

보시다시피 스크립트는 설정 파일을 `require` 문으로 가져오고 `*.spec.js` 라는 형태로 되어있는 파일을 모두 실행합니다. 기본적으로 테스트 파일 이름은 `App.spec.js` 처럼 되어 있고 `src` 폴더 아래라면 어디든지 상관없습니다. 물론 파일 이름이나 폴더 위치 등의 규칙은 여러분이 정하기 나름입니다.

테스트 스크립트는 `npm run test:unit` 으로 실행할 수 있겠지만 지금은 아무런 파일이 없기 때문에 테스트 파일을 찾을 수 없다고 뜰 겁니다. 다음 장에서 실제로 파일을 만들게 되겠지만, 일단 스크립트를 조금 더 추가하겠습니다. 바로 전에 작성한 스크립트를 실행하지만, 관찰(watch) 모드로 실행하는 스크립트입니다.

```json
"scripts": {
  "start": "webpack-dev-server --config ./webpack.config.js",
  "test:unit": "mocha --require babel-core/register --require ./test/helpers.js --require ./test/dom.js 'src/**/*.spec.js'",
  "test:unit:watch": "npm run test:unit -- --watch"
},
```

관찰 모드에서는 테스트가 한번 실행되고 난 뒤 유지되다가 소스 코드나 테스트에 변경이 일어나면 바로 다시 실행됩니다. 테스트 주도 개발을 할 때 관찰 모드를 설정해 놓으면 테스트를 추가하거나 변경할 때 즉시 피드백을 얻게 됩니다.

추가 설명: `npm run test:unit:watch` 로 관찰 모드를 실행하면서 개발 서버를 작동하려면 터미널 탭을 양 쪽에 두 개 띄워야 합니다.

Mocha와 Chai로 테스트하기에 앞서 작지만 쓸모 있는 라이브러리를 하나 더 소개해드리겠습니다. [ignore-styles](https://github.com/bkonkle/ignore-styles) 라는 녀석인데, 나중에 개발하시면서 리액트 컴포넌트에 CSS 스타일을 적용하시게 되겠지만 실제로 테스트에는 필요 없는 부분이므로 무시하고 싶을 때 사용합니다. 라이브러리를 `npm install --save-dev ignore-styles` 로 추가하신 다음에 스크립트의 내용을 조금 수정해줍니다.

```json
"scripts": {
  "start": "webpack-dev-server --config ./webpack.config.js",
  "test:unit": "mocha --require babel-core/register --require ./test/helpers.js --require ./test/dom.js --require ignore-styles 'src/**/*.spec.js'",
  "test:unit:watch": "npm run test:unit -- --watch"
},
```

드디어 Mocha와 Chai로 리액트 애플리케이션을 테스트하기 위한 설정을 마쳤습니다. 다음장에서는 첫 번째 테스트를 작성해 보겠습니다.

## 리액트 State 변경을 단위 테스트하기

아까 언급한 테스팅 피라미드의 벽돌 하나하나에 해당하는 '단위 테스트' 를 만들어 보겠습니다. 단위 테스트는 여러분의 애플리케이션에서 작은 부분을 독립적으로 테스트합니다. 보통 입력값을 받아 출력값을 돌려주는 함수들이 테스트 대상이 됩니다. 이 때 순수 함수가 빛을 발하게 됩니다. 함수를 실행하면서 생기는 부수 효과를 걱정할 필요가 전혀 없기 때문입니다. 순수 함수를 실행할 때 입력값이 같다면 출력 값은 언제나 동일합니다. 따라서 단위 테스트로 애플리케이션의 특정 동작을 확인해볼 수 있습니다.

우리는 이미 App 컴포넌트에서 `this.setState()` 안에서 동작하는 상태 변경 함수들을 클래스 밖으로 빼 두었습니다. 그리고 파일에서 내보내두었으니(export), 테스트 파일에서 불러와서(import) 실행하면 됩니다. 그러면 `src/` 폴더에 App 컴포넌트를 위한 테스트 파일을 만들어 보겠습니다. 적절한 접미사를 붙였는지 꼭 확인하세요. (역주: 보통은 `spec` 이나 `test` 를 붙입니다)

```
touch App.spec.js
```

이제 파일을 열고 코드를 추가합니다.

```javascript
describe('Local State', () => {
  it('state의 counter를 하나 올릴 수 있다', () => {

  });

  it('state의 counter를 하나 줄일 수 있다', () => {

  });
});
```

기본적으로 위의 테스트 묶음(suite)은 두 개의 테스트를 가지고 있습니다. **describe** 라고 하는 블록은 테스트 묶음을 정의하고, **it** 이라는 블록은 테스트 케이스를 정의합니다. 테스트는 성공할 수도 있고(Green), 실패할 수도 있습니다(Red). 당연히 여러분은 테스트를 계속 성공하도록 만들어야 합니다.

App 컴포넌트의 상태를 변경하기 위해 정의된 두 함수를 테스트하는 것은 여러분의 몫입니다. 하나는 `counter` 속성의 값을 하나 증가시키고, 나머지 하나는 하나 줄이고 있죠.

**it** 블록에 테스트를 작성할 때는 보통 세 단계를 거칩니다. 값을 정의하고(arrange), 실행하고(act), 단언하는 거죠(assert).

```javascript
import { doIncrement, doDecrement } from './App';

describe('Local State', () => {
  it('should increment the counter in state', () => {
    const state = { counter: 0 };
    const newState = doIncrement(state);

    expect(newState.counter).to.equal(1);
  });

  it('should decrement the counter in state', () => {
    const state = { counter: 0 };
    const newState = doDecrement(state);

    expect(newState.counter).to.equal(-1);
  });
});
```

각 테스트의 첫 번째 줄에는 초기 상태를 정의하는 객체를 설정했습니다. 이 객체는 바로 다음 단계에 테스트 할 함수의 입력값으로 사용됩니다. 두 번쨰 줄에서 함수에 설정한 초기값을 넘기고, 그 함수는 결과값을 리턴합니다. 마지막 줄에서 리턴된 값이 여러분이 설정한 기대값과 일치하는지 단언합니다. 우리가 작성한 테스트의 경우 `doIncrement()` 함수는 `counter` 속성의 값을 하나 올려야 하고, `doDecrement()` 함수는 하나 줄여야겠지요.

다 됐습니다. 이제 `npm run test:unit` 을 입력하시거나 `npm run test:unit:watch` 로 테스트를 실행해보세요. 관찰 모드를 켜 놓으셨다면 테스트 함수 블록이나 실제 함수 블록을 수정하고 결과가 어떻게 바뀌는지 확인하실 수 있습니다. 테스트가 성공하거나 실패하겠지요. 그리고 이 테스트는 아직 리액트와 의존 관계가 전혀 없다는 점을 확인해두시기 바랍니다. 순수한 자바스크립트 함수를 테스트하는데는 Mocha와 Chai만 사용하면 됩니다. 심지어 이전 장에서 설정한 `test/dom.js` 파일의 설정을 사용하지도 않았지요. 왜냐면 이 단위 테스트에는 브라우저의 DOM과 연관된 코드가 전혀 없기 때문입니다.

## 리액트에 Enzyme 테스트 설정하기

이번 장에서는 [Enzyme](https://github.com/airbnb/enzyme)으로 손쉽게 리액트 컴포넌트의 단위 테스트와 통합 테스트를 하기 위한 설정을 해 보겠습니다. 이 라이브러리는 Airbnb에서 리액트의 컴포넌트 테스트를 선보이면서 공개한 라이브러리입니다. 먼저 개발 의존성으로 Enzyme을 설치합니다.

```
npm install --save-dev enzyme
```

Enzyme에는 리액트 버전별로 맞는 어댑터가 필요합니다. 리액트 버전 16에 맞는 어댑터도 설치해줍니다.

```
npm install --save-dev enzyme-adapter-react-16
```

지금 보시는 테스팅 강좌에는 리액트 버전 16을 사용합니다. 그래서 Enzyme 어댑터도 그에 맞는 버전으로 설치해주었습니다. 만약 다른 버전을 사용한다면 공식 문서를 살펴보시고 맞는 어댑터를 설치해주세요.

그러면 `test/helpers.js` 파일에 Enzyme을 설정하겠습니다. 이 파일에 어댑터와 Enzyme 테스트에 쓰이는 함수들을 설정합니다.

```javascript
import { expect } from 'chai';
import { mount, render, shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

global.expect = expect;

global.mount = mount;
global.render = render;
global.shallow = shallow;
```

Chai에서 단언을 실행할 때 사용하는 `expect` 함수처럼 Enzyme에서 사용하는 `shallow`, `render`, `mount` 함수를 전역 함수로 만듭니다. 그러면 테스트 파일에서 일일이 이 함수들을 불러올 필요가 없어지게 됩니다. 앞으로 리액트 컴포넌트의 단위 테스트나 통합 테스트를 할 때 이 함수들을 사용하게 됩니다.

## Enzyme으로 리액트 테스트하기 - 리액트 컴포넌트를 단위, 통합 테스트하는 방법

*(읽기에 앞서 - 본문에서 render라는 용어 및 함수를 주로 '그리다' 는 동사로 바꾸어서 번역했습니다. 문맥상 어색한 경우 '랜더링' 이라는 단어를 그대로 사용한 경우도 있으니 참고 바랍니다)*

Enzyme 설정이 완료되었으니, 컴포넌트 테스트를 진행해보겠습니다. 이번 장에서는 여러분이 컴포넌트를 테스트 할 때 적용할 수 있는 몇 가지 기본 패턴을 알려드리겠습니다. 이 패턴들을 잘 따르신다면 매번 리액트 컴포넌트를 테스트할 떄 머리를 싸맬 필요가 없을겁니다.

이미 `src/App.js` 파일에서 `App` 컴포넌트를 내보냈으니 바로 `App` 컴포넌트를 랜더링할 때 `Counter` 컴포넌트도 같이 랜더링 되는지 확인해보는 테스트를 작성할 수 있습니다. `App.spec.js` 파일에 다음의 테스트를 추가해보겠습니다.

```jsx
import React from 'react';
import App, { doIncrement, doDecrement, Counter } from './App';

describe('Local State', () => {
  // ...
});

describe('App Component', () => {
  it('Counter 래퍼를 그려낸다', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find(Counter)).to.have.length(1);
  });
});
```

`shallow` 함수는 아까 `test/helpers.js` 파일에 정의해 놓았던 전역 변수 중 하나입니다. 이 함수는 Enzyme에서 가장 단순하게 컴포넌트를 그려내는 함수입니다. 딱 해당 컴포넌트만 그려내고 그 컴포넌트의 자손 컴포넌트의 내용은 그리지 않습니다. 컴포넌트를 분리해서 테스트 할 수 있게 만들어주기 때문에 단위 테스트에는 제격인 함수입니다. 앞선 테스트에서 `Counter` 컴포넌트가 `App` 컴포넌트 안의 인스턴스로 그려졌는지 확인해 보았습니다. 테스트에 따르면 딱 하나의 `Counter` 컴포넌트만 나와야 하지요.

이게 Enzyme으로 리액트 애플리케이션을 단위 테스트하는 아주 간단한 방법 중 하나입니다. 추가적으로 여러분은 그려진 컴포넌트에서 특정 HTML 태그나 CSS 클래스에 맞는 DOM이 그려졌는지 확인할 수 있습니다.

```jsx
it('List 래퍼가 list 엘리먼트를 그려낸다', () => {
  const wrapper = shallow(<List items={['a', 'b']} />);
  expect(wrapper.find('li')).to.have.length(2);
  expect(wrapper.find('.list')).to.have.length(1);
});
```

컴포넌트에 어떤 속성(리액트의 Props)을 전달했느냐에 따라 [Enzyme의 선택자를 이용하여](https://github.com/airbnb/enzyme/blob/master/docs/api/selector.md) 그려진 HTML 엘리먼트를 확인해볼 수 있습니다. 또한 컴포넌트에 [리액트의 조건부 랜더링을](https://github.com/airbnb/enzyme/blob/master/docs/api/selector.md) 적용했다면 선택자로 선택된 요소의 개수가 0개인지 1개인지 확인하는 방식으로 조건에 따라 컴포넌트가 알맞게 그려졌는지 확인할 수 있습니다.

Enzyme으로 얕은 랜더링을 할 떄는 단위 테스트 뿐 아니라 가볍게 통합 테스트도 할 수 있습니다. 예를 들어 단순히 HTML 태그가 제대로 그려졌는지 확인하는 것 뿐 아니라 아래의 테스트처럼 다음 컴포넌트에 정확하게 속성이 전달되었는지 확인하는 테스트도 만들 수 있습니다.

```jsx
// ...

describe('App Component', () => {
  it('Counter 래퍼를 그려낸다', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find(Counter)).to.have.length(1);
  });

  it('Counter 래퍼에 모든 Prop이 전달되었다', () => {
    const wrapper = shallow(<App />);
    let counterWrapper = wrapper.find(Counter);

    expect(counterWrapper.props().counter).to.equal(0);

    wrapper.setState({ counter: -1 });

    counterWrapper = wrapper.find(Counter);
    expect(counterWrapper.props().counter).to.equal(-1);
  });
});
```

단위 테스트와 통합 테스트의 경계가 애매하게 보일 수도 있습니다. 하지만 이번 테스트의 경우는 두 컴포넌트 사이의 간단한 부분이 기대한 대로 동작하는지 확인하는 정도이기 때문에 '가벼운 통합 테스트' 정도로 생각할 수 있겠습니다. 저 마지막 테스트는 어떻게 컴포넌트 사이에 전달되는 속성에 접근하고 확인했는지, 그리고 어떻게 컴포넌트의 지역 상태를 변경했는지 의도한 목적에 맞게 결과를 보여주었습니다. 이런 방식으로 여러분은 컴포넌트의 지역 상태 변화를 테스트할 수 있습니다. 예를 들어 컴포넌트 안에 있는 상태에 따라 특정 요소가 나타났다 사라졌다 하는 토글이 있다고 생각해 봅시다. 여러분은 테스트 코드를 작성하면서 임의로 상태를 변경하여 알맞은 HTML 요소가 그려졌는지 확인할 수 있습니다.

지금까지 그려진 컴포넌트를 테스트하고, 그 컴포넌트의 속성에 접근하거나 지역 상태를 변경해서 테스트하는 방법을 살펴보았습니다. 그리고 Enzyme을 사용하여 가상으로 클릭 이벤트를 활성화 할 수도 있습니다. 현재 `App` 컴포넌트는 클릭 이벤트를 테스트해보기에 최적의 조건을 가진 버튼 두 개가 있습니다. 한 버튼은 지역 상태의 `counter` 속성을 하나 올리고, 반면 나머지 하나는 하나 낮추는 역할을 하지요. 이제 `onClick` 핸들러가 붙어있는 버튼 같은 HTML 요소의 이벤트를 가상화하는지 살펴보겠습니다.

```javascript
// ...

describe('App Component', () => {
  it('Counter 래퍼를 그려낸다', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find(Counter)).to.have.length(1);
  });

  it('Counter 래퍼에 모든 Prop이 전달되었다', () => {
    const wrapper = shallow(<App />);
    let counterWrapper = wrapper.find(Counter);

    expect(counterWrapper.props().counter).to.equal(0);

    wrapper.setState({ counter: -1 });

    counterWrapper = wrapper.find(Counter);
    expect(counterWrapper.props().counter).to.equal(-1);
  });

  it('counter를 하나 올린다', () => {
    const wrapper = shallow(<App />);

    wrapper.setState({ counter: 0 });
    wrapper.find('button').at(0).simulate('click');

    expect(wrapper.state().counter).to.equal(1);
  });

  it('counter를 하나 내린다', () => {
    const wrapper = shallow(<App />);

    wrapper.setState({ counter: 0 });
    wrapper.find('button').at(1).simulate('click');

    expect(wrapper.state().counter).to.equal(-1);
  });
});
```

버튼이 두개 있으니까 `at()` 헬퍼 함수를 사용하여 특정 태그를 가진 엘리먼트의 리스트를 가져와서 그 리스트의 인덱스에 직접 접근할 수 있습니다. 하지만 엘리먼트의 순서가 바뀌게 된다면 조심해서 사용하셔야 합니다. 제대로 된 테스트라면 각각의 엘리먼트들을 명확히 가져올 수 있도록 선택자(Selector)를 잘 매겨서 사용하시길 권합니다. 그렇지 않고 계속 인덱스를 사용하여 HTML 엘리먼트를 가져온다면 엘리먼트의 순서가 바뀔 때 테스트가 깨지게 됩니다.

코드 마지막 부분의 리액트 컴포넌트의 지역 상태를 테스트하는 기본적인 방법입니다. 테스트 패턴이라고 보셔도 무방합니다. 다른 컴포넌트를 테스트할 때도 무난하게 재사용 가능한 방법이니까요. 특정 HTML 엘리먼트나 리액트 컴포넌트가 그려졌는지 확인하고, 정확한 속성이 전달되었거나 지역 상태가 원하는대로 변경되었는지 확인하는 테스트는 그리 많은 시간을 잡아먹지 않습니다.

지금까지 Enzyme의 `shallow()` 함수를 사용하여 단위 테스트와 얕은 수준의 통합 테스트를 해 보았습니다. 그렇다면 슬슬 `mount()` 함수와 `render()`  함수는 언제 쓰는지 궁금해지셨을 겁니다.

`shallow()` 함수가 자손 컴포넌트를 제외한 컴포넌트를 그려내는 반면 `mount()` 함수는 모든 자손 컴포넌트까지 그려냅니다. 즉 전체 컴포넌트 계층을 그려내는거죠. 전자가 함수가 분리된 환경에서 컴포넌트를 테스트하는데 사용된다면(단위 테스트나 얕은 수준의 통합 테스트), 후자는 진정한 통합 테스트에 사용된다고 볼 수 있습니다. 통합 테스트는 특정 컴포넌트 계층에 속한 모든 자손과 로직을 가져오기 때문에 더 깨지기 쉽습니다. 따라서 통합 테스트의 유지 비용은 단위 테스트보다 높습니다. 다른 사람들도 통합 테스트를 작성하는데 드는 비용이 단위 테스트를 작성하는데 드는 비용보다 비싸다고 말하지요. 덧붙여 `render()` 함수는 모든 자손 컴포넌트를 그려낸다는 특징 때문에 `mount()` 함수와 비슷하지만, 퍼포먼스 측면에서 `mount()` 보다 더 낫습니다. 왜냐면 리액트의 라이프사이클(Lifecycle) 메서드를 적용하지 않고 컴포넌트를 그려내기 때문입니다. 그러니 자손 컴포넌트까지 접근하고 싶지만 굳이 라이프사이클 메서드를 확인할 필요가 없다면 `mount()` 대신 `render()`  를 사용하시면 됩니다.

**얼마나 많은 단위 테스트와 통합 테스트를 작성해야 할 지 결정할 때 두 가지 중요한 원칙(philosophies)이 있습니다.** 일반적인 테스팅 피라미드 원리에 따라 1. 가능한 한 많은 단위 테스트를 작성하고, 2. 어느 정도의 통합 테스트를(그리고 아주 적은 수의 전체 테스트) 작성하라는 겁니다. 기본적으로 여러분은 작은 규모를 차지하면서 유지보수하기 용이한 단위 테스트를 많이 작성하고, 어느정도 중요한 부분에 통합 테스트를 적용해야 합니다. 이 방식이 소프트웨어 공학 분야에서 일반적으로 생각하는 테스팅입니다. 하지만 (리액트 같은 라이브러리나 프레임워크의) 컴포넌트 테스트를 할 때는 다른 원칙이 존재합니다. 바로 통합 테스트를 많이 작성하고 단위 테스트를 적게 작성하라는 겁니다. 컴포넌트 단위 테스트는 전체 애플리케이션과 비교하면 너무 고립된 데다가 잘 깨질 일도 없습니다. 그래서 보통 특정 부분의 맥락(context)를 완벽히 분리해서 본떠놓고(mock) 단위 테스트를 수행하지요. 그래서 많은 사람들이 이 주제를 놓고 갑론을박 합니다. 컴포넌트가 너무 분리되어 있으니까 테스트의 실효성이 있느냐는거죠. 결과적으로 여러분은 통합 테스트를 하면서 서로 다른 컴포넌트의 맥락이 잘 맞아 떨어지는지, 견고하게 구성되었는지 확인하는 테스트를 더 많이 하시게 될 겁니다.

실제로 테스트할 때는 위의 원칙이 무슨 상관이 있을까요? 여러분이 단위 테스트보다 통합 테스트를 더 많이 작성한다면, 컴포넌트를 테스트할 때 `shallow()` 대신에 `mount()` 나 `render()` 함수를 더 많이 사용하시게 될 겁니다. 그렇게 전체 컴포넌트 계층 구조를 그려낸 뒤에 특정 값의 존재 유무나 행동이 잘 맞는지 확인하고, 모든 자손 컴포넌트를 직접 접근할 수 있게 되었으니 더 복잡한 테스트를 작성할 수 있게 되었습니다. 복잡한 테스트라고 해도 본질은 앞서 작성한 테스트와 크게 다르지 않습니다. 똑같이 전달된 속성이 맞는지, 엘리먼트가 제대로 그려졌는지, 클릭 이벤트를 일으켜보기도 하고 지역 상태가 제대로 변화되었는지 확인하게 됩니다.

## 리액트에서 Sinon 테스트 설정하기

비동기(Asynchronous) 코드를 테스트하려면 어떻게 해야할까요? 지금까지는 동기(Synchronous) 방식 테스트에 대해서만 설명하고 있었습니다. 다시 한 번 `App` 컴포넌트를 살펴보시면 비동기적으로 실행되는 코드가 없어서 비동기 테스트가 필요 없다는 점을 보실 수 있습니다. 그렇다면 임의의 데이터를 `componentDidMount()` 라이프사이클 메서드에서 가져온다는 가상의 시나리오를 생각해 보겠습니다.

종종 `componentDidMount()` 에서 [외부 API(third-party API)](https://www.robinwieruch.de/what-is-an-api-javascript/)를 이용하여 데이터를 요청하는 일이 있습니다. 그렇기 때문에 리액트 컴포넌트에서 이런 비동기 코드가 제대로 동작하는지 테스트할 수 있어야 합니다. 임의의 API 엔드포인트가 있다고 가정하고, 데이터를 요청하여 카운터의 배열을 받을 수 있다고 가정해보겠습니다. 물론 실제로 엔드포인트가 존재하지 않기 때문에 실제 애플리케이션에서는 동작하지 않을 겁니다. 그래도 테스트를 하기 위해 만들어야 합니다. 이후에 여러분들만의 외부 API 요청을 직접 테스트해볼 수 있을겁니다.

위에 말씀드린 시나리오에서 외부 API 요청을 위해 `axios` 를 사용하겠습니다. 따라서 이 패키지를 설치하셔야 합니다.

```
npm install --save axios
```

그리고 임의의 API 엔드포인트로 요청하는 코드를 작성해보겠습니다. 이 시나리오에서 직접 특정 API에 요청을 할 지 말지는 여러분의 자유입니다. 혹시 리액트 컴포넌트 안에서 외부 API에 요청하는 법을 잘 모르신다면 ['리액트에서 데이터 가져오는 방법'](https://www.robinwieruch.de/react-fetching-data/) 을 살펴보시기 바랍니다.

```jsx
import React, { Component } from 'react';
import axios from 'axios';

// ...

class App extends Component {
  constructor() {
    super();

    this.state = {
      counter: 0,
      asyncCounters: null,
    };

    this.onIncrement = this.onIncrement.bind(this);
    this.onDecrement = this.onDecrement.bind(this);
  }

  componentDidMount() {
    axios.get('http://mypseudodomain/counter')
      .then(counter => this.setState({ asyncCounters: counter }))
      .catch(error => console.log(error));
  }

  onIncrement() {
    this.setState(doIncrement);
  }

  onDecrement() {
    this.setState(doDecrement);
  }

  render() {
    // ...
  }
}

// ...

export default App;
```

이 시나리오를 테스트하기 위해 굳이 `render()` 메서드에서 `asyncCounters` 속성을 드러낼 필요는 없습니다. 어차피 엔드포인트에서 가짜 데이터만 리턴하게 될 테니까요. 그리고 오로지 요청이 성공적으로 이루어졌는지까지만 가정해서 테스트해보고자 합니다.

그럼 이제 리액트 컴포넌트에서 비동기 데이터 요청을 테스트 하려면 어떻게 해야할까요? [Sinon](https://github.com/sinonjs/sinon)이라는 멋진 라이브러리를 개발 의존성에 추가해줍시다.

```
npm install --save-dev sinon
```

그리고 Sinon을 `test/helpers.js` 파일에 글로벌 함수로 등록해줍니다.

```javascript
import sinon from 'sinon';
import { expect } from 'chai';
import { mount, render, shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

global.expect = expect;

global.sinon = sinon;

global.mount = mount;
global.render = render;
global.shallow = shallow;
```

Sinon은 관찰(spies), Mock, Stub에 사용될 수 있습니다.(역주: Spy는 관찰자정도로 번역할 수 있겠지만 주로 영문 표기를 그대로 사용하고자 합니다. Mock, Stub은 일반적으로 한글로 번역하기 모호한 개념인데다 대부분의 기술 문서도 원문을 그대로 사용하고 있기 때문에 억지로 번역하지 않겠습니다 - Mock과 Stub에 관해서는 [다음 링크](https://medium.com/@SlackBeck/mock-object란-무엇인가-85159754b2ac)를 참고해주세요) 다음 장에서 관찰자와 Stub을 사용해서 리액트 컴포넌트 안의 비동기 비지니스 로직을 테스트합니다. 이런 작업이 비동기 로직을 테스트할 때 가장 시간이 많이 들어가는 부분입니다.

## Sinon으로 리액트 테스트하기 - 비동기 코드를 테스트하는 방법

실제 시연을 해보기 위해 첫 번째 [Spy](http://sinonjs.org/releases/v4.4.6/spies/)를 붙여보겠습니다. Spy는 어떠한 함수나 단언에도 사용할 수 있습니다. Spy가 적용된 이후 특정 함수가 테스트 안에서 몇 번이나 호출되었는지 확인해볼 수 있습니다.

```jsx
// ...

describe('App Component', () => {
  it('componentDidMount를 호출한다', () => {
    sinon.spy(App.prototype, 'componentDidMount');

    const wrapper = mount(<App />);
    expect(App.prototype.componentDidMount.calledOnce).to.equal(true);
  });
});
```

'`App` 컴포넌트의 프로토타입 체인에 들어있는 `componentDidMount()` 라이프사이클 메서드가 한 번 실행된다.' 는 테스트를 작성했습니다. 리액트의 라이프사이클 메서드를 알고 계시다면 이 메서드는 컴포넌트가 마운트될 때 한 번만 실행된다는 사실을 알고 계실겁니다. 그 이후에는 호출되지 않지요. 따라서 테스트는 성공할 겁니다. 이런 방식으로 리액트의 라이프사이클 메서드를 테스트할 수 있습니다.

실제로 이 테스트 자체는 별 의미가 없기 때문에 지우셔도 됩니다. 그저 Sinon에서 제공하는 관찰 기능의 맛을 보여드린 것 뿐입니다. 라이프사이클 메서드 자체가 잘 동작하는지 여부는 리액트 내부에서 테스트 되어야 하는 일입니다. 대신 리액트 애플리케이션 안에서 비동기 데이터 요청을 하는 과정을 Sinon으로 테스트하겠습니다.

`App` 컴포넌트에 대한 모든 테스트는 `componentDidMount()` 함수에서 호출되는 데이터 요청의 영향을 받기 때문에 매 테스트마다 데이터가 제대로 들어오도록 만들어야 합니다. Mocha는 `before()`, `after()` 함수로 매 테스트마다 필요한 환경을 설정하는 함수를 제공합니다.

```javascript
// ...

describe('App Component', () => {
  before(() => {

  });

  after(() => {

  });

  it('Counter 래퍼를 그려낸다', () => {
    // ...
  });

  // ...
});
```

이제 테스트 파일에 axios를 사용하겠습니다. 특정 API 요청에 [스텁](http://sinonjs.org/releases/v4.4.6/stubs/)(stub, 역주: '테스트용으로 특정 요청에 따라 정해진 가짜 데이터(canned answer)를 제공하는 함수' 라는 뜻을 가지고 있으며 국내에 적절한 우리말 번역이 없어 원어 그대로 사용하겠습니다)을 적용하여 데이터 요청을 흉내내고, 그 데이터를 가져오기 위해서입니다.

```javascript
import React from 'react';
import axios from 'axios';
import App, { doIncrement, doDecrement, Counter } from './App';

// ...

describe('App Component', () => {
  const result = [3, 5, 9];
  const promise = Promise.resolve(result);

  before(() => {
    sinon.stub(axios, 'get').withArgs('http://mydomain/counter').returns(promise);
  });

  after(() => {
    axios.get.restore();
  });

  // ...
});
```

그런데 스텁이 뭐냐고요? Sinon 문서에서 일컫기를 '테스트 스텁은 미리 지정된 동작을 수행하는 함수 (혹은 Spy)' 라고 합니다. 정의대로라면 Spy도 완전히 통제할 수 있다는 말이 되지요. 예를 들자면 특정 함수(`get()` 함수같은)가 어떤 리턴값을 돌려줄지 미리 지정할 수 있습니다. 한발 나아가 특정 인자를 받을 때만 내가 원하는 동작을 수행하도록 지정할 수 있습니다. 위의 코드를 보시면 axios의 `get` 함수로 특정 도메인에 요청을 할 때 반드시 정수의 배열(`counters`)  을 프로미스로 돌려주도록 정의한 것을 알 수 있습니다.

테스트가 실행된 후 `after` 블록에서 `restore()` 메서드가 `axios.get()` 메서드에 적용된 스텁을 해제하고 원래 정의된 동작대로 움직이도록 복원하는 것 까지 설정되어 있습니다. 매번 스텁을 해제하지 않으면 다른 테스트 케이스에서 미처 해제되지 못한 스텁이 영향을 주는 불상사가 일어납니다.

그럼 이제 `componentDidMount()` 함수의 비동기 동작을 테스트해보겠습니다. 테스트 내용은 데이터를 요청한 뒤에 결과물을 리액트 컴포넌트 안의 `asyncCounters` 라는 지역 속성으로 저장하는지 확인하는 겁니다.

```jsx
// ...

describe('App Component', () => {
  const result = [3, 5, 9];
  const promise = Promise.resolve(result);

  before(() => {
    sinon.stub(axios, 'get').withArgs('http://mydomain/counter').returns(promise);
  });

  after(() => {
    axios.get.restore();
  });

  // ...

  it('비동기로 카운터를 가져온다', () => {
    const wrapper = shallow(<App />);

    expect(wrapper.state().asyncCounters).to.equal(null);

    promise.then(() => {
      expect(wrapper.state().asyncCounters).to.equal(result);
    });
  });
});
```

`App` 컴포넌트를 처음 그려낼 때 `asyncCounters` 상태는 `null` 이어야 합니다. 그리고 프로미스가 완료되면 우리가 지정한 `result` 값과 같은 상태가 되어야 합니다. 이제 테스트를 여러 번 실행해봐도 원하는대로 동작하는지 확인해볼 수 있게 되었습니다. 축하드립니다! 이제 리액트 컴포넌트의 비동기 동작도 테스트할 수 있게 되었습니다. Sinon 자체는 Mocha, Chai와 마찬가지로 리액트와 직접적으로 엮여있지 않다는 점을 명심하셔야 합니다. 오로지 함수를 관찰하거나 그 함수에 스텁을 적용하고, 더 세밀하게 정의되어있는 Mock 객체를 만들고자 할 때만 사용하셔야 합니다.

## 리액트에서 Jest 설정하기

이번 장에서는 Jest를 설정하고 리액트 애플리케이션 테스트를 실행하는 방법을 알아보겠습니다. [Jest](https://facebook.github.io/jest/)는 여러분의 리액트 컴포넌트를 테스트할 때 사용됩니다. 이 라이브러리는 페이스북에서 공식적으로 사용되는 테스팅 라이브러리이며, '스냅샷(Snapshot, 순간적으로 촬영된 사진) 테스트' 라는 개념을 도입하여 Enzyme과 함께 리액트 애플리케이션의 단위 테스트와 통합 테스트를 할 때 아주 유용하게 사용됩니다.

스냅샷 테스트라 함은 테스트를 실행할 때 실제 그려지는 컴포넌트의 결과물을 스냅샷으로 만드는 겁니다. 그리고 이 스냅샷은 다음 테스트를 실행할 때 생성되는 스냅샷과 비교하는데 사용됩니다. 만약 그려진 컴포넌트의 결과물이 바뀌었다면 각 스냅샷의 달라진 점이 표시되면서 테스트가 실패합니다. 아직까지 그리 나쁜 일은 아닌 것이, 스냅샷 테스트는 그저 결과물이 바뀌었을때 알려주는 역할만 하기 때문입니다. 스냅샷 테스트가 실패했다면 여러분은 변경된 스냅샷을 받아들이거나(새 스냅샷을 기준이 되는 스냅샷으로 업데이트하거나) 변경된 부분을 무시하고 컴포넌트의 구현부를 수정하여 원래의 결과물이 나오도록 고치면 됩니다.

Jest로 스냅샷 테스트를 하면 테스트를 가볍게 유지할 수 있습니다. 간단히 설정한 뒤에 테스트를 실행할 때마다 변경사항이 발생했다면, 변경사항을 받아들일지 말지 결정하면 됩니다. 비지니스 로직보다는 출력된 결과물에 더 신경을 쓰게 되지요. 비지니스 로직도 Enzyme으로 잘 테스트할 수 있지만, Jest로도 테스트할 수 있습니다.

나아가기 앞서: Jest는 테스트 실행기와 단언 함수가 포함되어 있습니다. 앞서 Mocha와 Chai를 테스트 실행기와 단언 라이브러리로 사용하였지만, Jest 하나로 모두 해결할 수 있습니다. 사용할 때 API가 약간 다르긴 합니다.  Jest를 사용할 때는 `it` 블록보다 `test` 블록을 사용한다던가(역주: Jest에서 `describe`, `it`, `test` 다 사용 가능합니다), 단언 함수를 쓸 때 `to.equal()` 대신 `toEqual()` 을 사용한다던가. 어쨌든 Jest로 모든 일을 처리하고 싶으시다면 Mocha와 Chai 설정 부분은 넘어가셔도 됩니다. Jest와 Enzyme만으로 리액트 애플리케이션을 테스트하고 싶으시다면, Mocha와 Chai를 설정하지 않고  Enzyme(과 Sinon)을 Jest 환경에 설정하시면 됩니다.

그럼 이제 Jest를 설정해 보겠습니다. 먼저 개발 의존성으로 Jest와 `react-test-renderer` 라이브러리를 설치해줍니다. 이 라이브러리는 Jest 테스트에서 컴포넌트를 그려낼 때 사용합니다.

```
npm install --save-dev jest react-test-renderer
```

그리고 Jest 설정 파일을 `test/` 폴더에 만듭니다.

```
cd test
touch jest.config.json
```

만들어진 파일에 다음의 설정을 입력하고 저장해줍니다.

```json
{
  "testRegex": "((\\.|/*.)(snapshot))\\.js?$",
  "rootDir": "../src"
}
```

`testRegex` 설정은 어디에 있는 스냅샷 테스트 파일을 가지고 테스트를 할 지 지정합니다. 이 튜토리얼에서는 `*.snapshot.js` 파일을 테스트 대상으로 지정하여, `*.spec.js` 파일에 작성된 유닛 테스트 및 통합 테스트와 완전히 분리했습니다. Mocha 와 마찬가지로 Jest는 재귀적으로 `src/` 폴더를 탐색하여 해당 정규표현식에 해당하는 모든 스냅샷 테스트 파일을 실행합니다.

`rootDir` 설정은 Jest가 어느 폴더부터 테스트 파일을 탐색해나갈지 지정합니다. Jest 설정 파일이 `test/` 폴더에 있으니 한 단계 위로 올라가 `src/` 폴더 안에 있는 스냅샷 테스트를 찾을 수 있도록 해 줍시다.

마지막으로 `package.json` 파일에 스냅샷 테스트를 실행하는 스크립트를 추가해줍니다.

```json
"scripts": {
  "start": "webpack-dev-server --config ./webpack.config.js",
  "test:unit": "mocha --require babel-core/register --require ./test/helpers.js --require ./test/dom.js --require ignore-styles 'src/**/*.spec.js'",
  "test:unit:watch": "npm run test:unit -- --watch",
  "test:snapshot": "jest --config ./test/jest.config.json",
  "test:snapshot:watch": "npm run test:snapshot -- --watch"
},
```

 `npm run test:snapshot` 으로 커맨드를 실행하면 Jest에게 설정 파일에 따라 테스트가 실행됩니다. `npm run test:snapshot:watch` 는 위에 Mocha의 워치 모드처럼 스냅샷 테스트를 워치 모드로 실행합니다.

이제 테스트를 실행하려면 터미널 탭을 하나 더 띄워야 할 수도 있습니다. Mocha로 단위 테스트와 통합 테스트를 워치 모드로 실행하고, 다른 탭을 열어 Jest의 스냅샷 테스트를 워치 모드로 실행하며, `npm start` 로 애플리케이션을 실행해볼 탭도 필요합니다. 매번 소스 파일이 변경될 때마다 두 탭에 있는 테스트가 동시에 재실행됩니다. 만약 Mocha와 Chai를 사용하지 않으신다면 Jest만 실행하기 위한 테스트 스크립트만 만드시면 됩니다. (Sinon과 Enzyme은 필요에 따라 선택합니다)

**역주: 실제 이대로만 설정하고 다음 챕터의 설명을 따라 테스트를 실행하면 오류가 납니다. 그 이유는 Jest의 실행 환경을 제대로 설정하지 못했기 때문인데요, Mocha를 설정할 때 처럼 Babel 환경에서 실행해주어야 합니다. 가장 쉬운 방법으로 `babel-jest` 를 개발 의존성으로 추가해주시면 됩니다. 타입스크립트 사용자의 경우 `ts-jest` 설치 및 별도의 설정이 필요합니다.**

## Jest로 리액트 테스트하기 - 컴포넌트 스냅샷 테스트

이 장에서는 두 개의 리액트 컴포넌트를 테스트하기 위해 두 개의 스냅샷 테스트를 작성하겠습니다. 먼저 `src/` 폴더에 파일을 만듭니다.

```
cd src
touch App.snapshot.js
```

그리고 `App`, `Counter` 컴포넌트에 대한 스냅샷 테스트를 작성합니다. 보통 스냅샷 테스트는 최소한 아래의 양식을 가지고 있습니다.

```jsx
import React from 'react';
import renderer from 'react-test-renderer';

import App, { Counter } from './App';

describe('App Snapshot', () => {
  test('renders', () => {
    const component = renderer.create(
      <App />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('Counter Snapshot', () => {
  test('renders', () => {
    const component = renderer.create(
      <Counter counter={1} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
```

네 이게 다입니다. 이제 커맨드 라인에서 스냅샷 테스트를 실행해보세요. 모두 성공할겁니다. 그 다음에 `App` 컴포넌트의  `render()` 메서드 구현부를 조금 수정해봅니다. 예를 들어 `<h1>` 태그에 몇마디 넣어서 추가해볼 수도 있겠습니다. 다시 스냅샷 테스트를 실행하면 `App` 컴포넌트에 대한 테스트는 실패할겁니다. 그리고 스냅샷을 업데이트할지 코드를 고칠지 결정하면 됩니다.

스냅샷 테스트로 리액트 컴포넌트를 테스트하는 아주 기초적인 방법을 보여드렸습니다만, Jest는 훨씬 강력한 기능을 제공합니다. 예를 들어 자체적으로 단언 함수를 가지고 있지요(`toEqual()` 등). Jest의 공식 문서를 한번 살펴보시고 어떤 기능을 가지고 있는지 찾아보시는걸 추천합니다. 이 라이브러리 자체는 굉장히 강력하지만 어찌되었든 고안된 목적 자체가 여러분의 컴포넌트 테스트를 쉽게 만들기 위해서라는 점을 명심하세요. 스냅샷 테스트를 테스트 묶음(Test Suite)에 추가하는데 너무 많은 개발 비용을 들이지 마세요.

**역주: 보통 Jest와 스냅샷 테스트를 할 때는 Enzyme을 함께 사용하는 경우가 많습니다. 실제로 이 튜토리얼의 저자도 같이 사용하는 것을 언급했었지요. Enzyme과 함께 스냅샷 테스트를 하는 방법은 [다음의 튜토리얼](https://velopert.com/3587)과 [저장소](https://github.com/adhrinae/ts-react-parcel)를 참고하시기 바랍니다.**

## Cypress.io를 활용한 리액트 전체 테스트

엔드-투-엔드 테스트(E2E, 이 번역문에서는 전체 테스트라 명명합니다)는 예로부터 지금까지 어떤 테스트 프레임워크를 써도 지루한 일이었습니다. 요즘은 많은 사람들이 [Cypress.io](https://cypress.io) 로 전체 테스트를 하고 있습니다. Cypress의 문서는 아주 높은 수준으로 작성되어있고, 그 API는 간단명료합니다. 이제 우리가 작성한 코드로 Cypress를 활용한 전체 테스트를 해보겠습니다. 먼저 Cypress를 개발 의존성에 추가합니다. (역주: 네트워크 환경에 따라 굉장히 시간이 오래 걸리니 유의하시기 바랍니다)

```
npm install --save-dev cypress
```

그리고 Cypress와 전체 테스트에 관련된 폴더를 프로젝트 폴더 안에 만듭니다. 이 폴더 구조는 [Cypress에서 제공된 문서](https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests.html#Configuring-Folder-Structure)를 따릅니다.

```
mkdir cypress
cd cypress
mkdir integration
cd integration
```

세 번째 단계로 `package.json` 파일에 실행 스크립트를 추가합니다. 커맨드 라인으로 간단하게 Cypress를 실행할 수 있습니다.

```json
"scripts": {
  "start": "webpack-dev-server --config ./webpack.config.js --mode development",
  "test:unit": "mocha --require babel-core/register --require ./test/helpers.js --require ./test/dom.js --require ignore-styles 'src/**/*.spec.js'",
  "test:unit:watch": "npm run test:unit -- --watch",
  "test:snapshot": "jest --config ./test/jest.config.json",
  "test:snapshot:watch": "npm run test:snapshot -- --watch",
  "test:cypress": "cypress open"
},
```

처음 Cypress를 실행하면 아마 제가 제공하는 화면과 비슷한 화면이 나올 겁니다.

```
npm run test:cypress
```

아직 아무 테스트가 없다는 메세지로 "No files found in" 이라는 메세지가 나타납니다.

![Cypress 첫 실행 이미지](https://cl.ly/1g1i350q0j3H/Screen%20Shot%202018-05-12%20at%2008.45.03.png)

그러면 `cypress/integration` 폴더에 `App`  컴포넌트의 전체 테스트를 작성해보겠습니다.

```
touch App.e2e.js
```

첫 번째 테스트는 그다지 전체 테스트 같진 않지만, 일단 실행해보고 Cypress가 실제로 동작하는 것을 확인하실 수 있습니다.

```javascript
describe('App E2E', () => {
  it('should assert that true is equal to true', () => {
    expect(true).to.equal(true);
  });
});
```

이미 `describe`, `it` 블록은 친숙하게 느껴지시리라 생각합니다. 기존에 보시던 대로 이 블록들은 테스트를 특정 블록 안으로 캡슐화하는데 사용됩니다. Cypress는 실제로 Mocha를 기반에 두고 만들어졌기 때문에 위와 같은 블록들도 차용했다고 합니다. `expect` 같은 단언 문법은 Chai에서 가져왔습니다. **Cypress는 위와 같은 유명한 툴과 프레임워크를 기반으로 삼고 만들어졌기 때문에 친숙함을 느끼고 동작을 손쉽게 파악할 수 있습니다.**

그러면 다시 Cypress를 커맨드 라인으로 실행해보겠습니다.

```
npm run test:cypress
```

아래 그림과 같은 결과물을 보실 수 있을 겁니다. Cypress는 `cypress/` 폴더 아래에 있는 테스트를 찾아서 대시보드에 표시해 주고, 그 테스트를 하나씩 실행할지 아니면 전체 테스트를 다 실행할지 선택할 수 있습니다.

![첫 Cypress 테스트](https://cl.ly/2I0x2G3E0C44/Screen%20Shot%202018-05-12%20at%2009.31.32.png)

테스트를 실행하고 `true` 와 `true` 가 같은지 확인해봅시다. 당연하게도 테스트는 성공이라고 나타나겠지요. 그렇지 않다면 무언가 문제가 있다는 겁니다. 반대로 테스트를 수정해서 일부러 실패하게 만들어 볼 수도 있습니다.

```javascript
describe('App E2E', () => {
  it('should assert that true is equal to true', () => {
    expect(true).to.equal(false);
  });
});
```

원하신다면 Cypress를 실행하자마자 모든 테스트를 실행하도록 스크립트를 수정하셔도 됩니다.

```json
"scripts": {
  "start": "webpack-dev-server --config ./webpack.config.js --mode development",
  "test:unit": "mocha --require babel-core/register --require ./test/helpers.js --require ./test/dom.js --require ignore-styles 'src/**/*.spec.js'",
  "test:unit:watch": "npm run test:unit -- --watch",
  "test:snapshot": "jest --config ./test/jest.config.json",
  "test:snapshot:watch": "npm run test:snapshot -- --watch",
  "test:cypress": "cypress run"
},
```

커맨드 라인에서 다시 테스트를 실행하면 모든 테스트가 자동으로 실행되는데다 무슨 비디오 녹화가 완료되었다는 메세지도 보실 수 있을 겁니다. 이 비디오는 보통 Cypress 테스트 폴더 아래에 `videos/` 라는 폴더에 저장됩니다. 테스트 실행 시 비디오 뿐만 아니라 스크린샷도 자동으로 저장되도록 할 수 있습니다. 이 내용에 대해서는 [공식 문서를 참고하시기 바랍니다.](https://docs.cypress.io/guides/guides/screenshots-and-videos.html#)

자동 저장이 마음에 들지 않는다면 프로젝트 폴더에 설정 파일을 만들어서 자동 저장을 비활성화 할 수 있습니다. Cypress 처음 실행 시 프로젝트 루트 폴더에 `cypress.json` 파일이 생성되었을텐데, 그렇지 않다면 프로젝트 루트 폴더에 파일을 만들어주어야 합니다.

```
touch cypress.json
```

설정 파일에서 `videoRecording` 이라는 플래그를 비활성화합니다.

```json
{
  "videoRecording": false
}
```

다양한 설정 방법을 알아보시려면 [Cypress의 문서를 참고하세요.](https://docs.cypress.io/guides/references/configuration.html)

결과적으로 여러분은 직접 만든 리액트 애플리케이션을 Cypress로 테스트하고 싶으실 겁니다. Cypress는 전체 테스트를 위한 도구이기 때문에 Cypress로 애플리케이션에 접속하기 전에 먼저 애플리케이션을 실행해야 합니다. 이 경우에는 로컬 서버를 미리 실행해야겠네요.

Cypress 스크립트가 실행되기 전에 자동으로 개발 서버(여기서는 webpack-dev-server)를 실행하는 방법은 없을까요? 마침 이런 역할을 해 주는 [깔쌈한 라이브러리](https://github.com/bahmutov/start-server-and-test)가 있습니다. 먼저 이 라이브러리를 개발 의존성에 추가합니다.

```
npm install --save-dev start-server-and-test
```

그 다음 `package.json` 에 스크립트를 추가합니다. 스크립트는 `시작 스크립트 이름` `url` `테스트 스크립트 이름` 순으로 적으면 됩니다.

```json
"scripts": {
  "start": "webpack-dev-server --config ./webpack.config.js --mode development",
  "test:unit": "mocha --require babel-core/register --require ./test/helpers.js --require ./test/dom.js --require ignore-styles 'src/**/*.spec.js'",
  "test:unit:watch": "npm run test:unit -- --watch",
  "test:snapshot": "jest --config ./test/jest.config.json",
  "test:snapshot:watch": "npm run test:snapshot -- --watch",
  "test:cypress": "start-server-and-test start http://localhost:8080 cypress",
  "cypress": "cypress run"
},
```

마지막으로 실제 Cypress로 애플리케이션에 접속하는 전체 테스트를 작성해보겠습니다. Cypress 테스트 코드를 작성할 때 `cy` 라는 전역 객체를 사용하여 동작을 정의할 수 있습니다. 애플리케이션에 방문하고 `h1` 태그를 확인하는 테스트를 작성해보죠.

```javascript
describe('App E2E', () => {
  it('헤더가 있어야 한다', () => {
    cy.visit('http://localhost:8080');

    cy.get('h1')
      .should('have.text', 'My Counter');
  });
});
```

기본적으로 Cypress로 CSS 선택자를 지정하고, 단언을 할 때는 이런 방식으로 합니다. 다시 테스트를 실행해 보면 성공했다고 나옵니다.

Cypress 테스트 시 권장 설정을 말씀드리면, 기본 URL을 `cypress.json` 설정 파일에 지정해두시는게 좋습니다. 단순히 타이핑을 덜 하게 할 뿐 아니라 실행 속도에도 영향을 줍니다.

```json
{
  "videoRecording": false,
  "baseUrl": "http://localhost:8080"
}
```

이제 테스트 코드에서 URL을 지우고 절대 경로를 사용해도 됩니다. 이제 언제나 설정에서 주어진 URL 기반으로 동작합니다.

```javascript
describe('App E2E', () => {
  it('헤더가 있어야 한다', () => {
    cy.visit(‘/‘);

    cy.get('h1')
      .should('have.text', 'My Counter');
  });
});
```

그 다음에 리액트 애플리케이션의 버튼을 누르는 동작을 테스트할 겁니다. 각각의 버튼을 누르고 나서 카운터의 숫자가 바뀌는지를 확인합니다. 일단 카운터에 0이라는 숫자가 제대로 표시되는지 확인해보죠.

```javascript
describe('App E2E', () => {
  it('헤더가 있어야 한다', () => {
    cy.visit('/');

    cy.get('h1')
      .should('have.text', 'My Counter');
  });

  it('카운터를 늘리거나 줄일수 있어야 한다', () => {
    cy.visit('/');

    cy.get('p')
      .should('have.text', '0');
  });
});
```

그리고 [버튼을 조종하면서](https://docs.cypress.io/guides/core-concepts/interacting-with-elements.html) 카운터를 늘리거나 줄여보겠습니다.

```javascript
describe('App E2E', () => {
  it('헤더가 있어야 한다', () => {
    cy.visit('/');

    cy.get('h1')
      .should('have.text', 'My Counter');
  });

  it('카운터를 늘리거나 줄일수 있어야 한다', () => {
    cy.visit('/');

    cy.get('p')
      .should('have.text', '0');

    cy.contains('Increment').click();
    cy.get('p')
      .should('have.text', '1');

    cy.contains('Increment').click();
    cy.get('p')
      .should('have.text', '2');

    cy.contains('Decrement').click();
    cy.get('p')
      .should('have.text', '1');
  });
});
```

이렇게 여러분은 Cypress로 전체 테스트를 작성했습니다. URL과 URL 사이를 오갈 수도 있고, 다른 HTML 요소에 접근하고 그려진 결과물을 확인해볼 수 있습니다. 두 가지만 더 말씀드리자면

- 전체 테스트에 샘플 데이터를 끼워넣고 싶으시다면 Cypress에서 제공하는 [fixture](https://docs.cypress.io/api/commands/fixture.html#Syntax)를 이용하시면 됩니다.
- 테스트를 할 때 관찰을 Spy, Stub, Mock 함수가 필요하시다면 Sinon을 사용하시면 됩니다. Cypress는 비동기 코드 테스트를 할 때 활용할 수 있도록 Sinon을 기본적으로 내장하고 있습니다.

## 리액트 컴포넌트 테스트와 CI(Continuous Integration)

[CI(지속적 통합)](https://ko.wikipedia.org/wiki/%EC%A7%80%EC%86%8D%EC%A0%81_%ED%86%B5%ED%95%A9)을 할 때 리액트 컴포넌트 테스트가 여타 테스트와 크게 다른 점은 없습니다. 따라서 이 글에선 Travis CI를 사용하여 CI를 설정하는 방법을 보여드리겠습니다. 이런 설정을 할 때 기존에 익숙한 CI를 사용하셔도 상관 없습니다.

CI환경 아래서 모든 빌드 과정을 거치며 (리액트) 애플리케이션이 테스트되도록 해야합니다. 예를 들어 빌드 중에 테스트가 성공하지 못했다면 빌드가 실패해야 합니다. 이런 식으로 언제나 배포 전에 테스트의 성공 여부를 확인할 수 있습니다.

만약 Github 계정이나 git 설정이 되어있지 않다면 이 가이드를 보고 [Github과 git을 사용하는 기기에 설정해 주세요.](https://www.robinwieruch.de/git-essential-commands/) 그러면 Github에 여태 만든 프로젝트를 올리기 위한 저장소를 만들 수 있고, 변경 사항을 커밋한 다음 원격 저장소에 올릴(push) 수 있습니다.

그 다음 Github 계정으로 Travis CI의 계정을 만듭니다. 계정을 만드셨다면 대시보드가 보일테고, 여러분의 Github 계정에 있는  저장소의 목록이 보이게 됩니다. 여기서 어떤 저장소를 동기화할지 고르시면 됩니다. 우리가 CI를 설정하고자 하는 저장소를 토글하시면 됩니다.

![Travis CI 설정](https://cl.ly/3a2N0n3L3D3p/Screen%20Shot%202018-05-13%20at%2014.58.58.png)

이제 Travis CI와 Github 저장소가 동기화되었습니다. 남은 일은 Travis CI에게 CI환경에서 애플리케이션을 설치하고 실행하는 법을 알려주는 겁니다. 프로젝트 루트 폴더에 Travis 설정 파일을 만듭니다.

```
touch .travis.yml
```

그리고 다음의 설정을 입력합니다. 제일 중요한 부분은 테스트를 돌리기 위해 어떤 스크립트를 입력하느냐 입니다.

```yaml
language: node_js

node_js:
  - stable

install:
  - npm install

script:
  - npm run test:unit && npm run test:snapshot
```

이렇게 설정을 하고 Github 저장소에 푸시합니다. 저장소에 새로운 내용이 갱신될때마다 Travis CI는 자동으로 변화를 감지하고 프로젝트를 다시 빌드합니다. 대시보드에서 빌드 과정을 확인하고 테스트가 성공했는지 실패했는지 확인하실 수 있습니다. 당연히 녹색(성공)이 떠야겠죠.

CI에 Cypress를 사용한 전체 테스트를 추가할 수도 있습니다. (역주: 전체 테스트를 할 때 `start-server-and-test` 패키지를 활용한 스크립트가 개발 서버 실행 단계에서 멈추는 현상이 있습니다. CI 머신이 느려서 제가 못참고 꺼버린건지는 모르겠습니다만.. CI 빌드 과정만 확인하시려면 위의 스크립트정도만 적용해보시길 권합니다.)

```yaml
language: node_js

node_js:
  - stable

install:
  - npm install

script:
  - npm run test:unit && npm run test:snapshot && npm run test:cypress
```

최종 단계로 Github 저장소에 멋진 뱃지를 달 수 있습니다. 프로젝트의 `README.md` 파일을 열거나 없다면 프로젝트 루트 폴더에 하나 만듭니다.

```
touch README.md
```

이제 마크다운(Markdown) 문법을 사용하여 프로젝트 설명을 적을 수 있습니다. Github 저장소에 올리게 되면 나타나게 됩니다만 하셔도 되고 안하셔도 됩니다. 리드미 파일이 있으니 그 안에 빌드가 성공하는지 실패하는지 보여주는 멋진 뱃지를 달 수 있습니다. Travis CI 대시보드에서 여러분이 연결한 프로젝트를 찾아보시면 "build passing" 이라는 뱃지를 발견하실 수 있을겁니다.

뱃지를 클릭하면 저장소에 뱃지를 표시하기 위한 정보가 전부 표시됩니다. 마크다운 버전으로 선택하시면 `README.md` 에 어떻게 표시해야하는지 정보가 나타납니다.

```markdown
# React Component Test Example

[![Build Status](https://travis-
ci.org/adhrinae/react-application-test-example.svg?branch=master)](https://travis-ci.org/adhrinae/react-application-test-example)
```

위의 예시는 제 프로젝트를 표시하는 뱃지이니 실제로 사용하실 때는 저 내용을 그대로 복사/붙여넣기 하시면 안됩니다. 이제 빌드가 실패하면 상태를 알 수 있는 CI 설정이 프로젝트에 추가되었습니다. 또한 다른 사람들에게 이 프로젝트의 빌드 상태가 어떤지 보여줄 수 있는 뱃지도 추가했습니다. 이런 방식으로 여러분이 만든 프로젝트의 신뢰도를 나타낼 수 있습니다.

## Coveralls로 리액트 컴포넌트의 테스트 커버리지 확인하기

CI 환경과 마찬가지로 Coveralls도 리액트 컴포넌트 테스트를 할 때 필수는 아닙니다. Coveralls는 애플리케이션의 테스트 커버리지를 표시할 때 사용됩니다. 우리가 만든 리액트 애플리케이션의 테스트 커버리지를 어떻게 표시하는지 한번 시도해 보겠습니다. 먼저 Github 계정을 이용하여 [Coveralls.io](https://coveralls.io)에 가입합니다 그리고 필요한 Github 저장소를 토글하여 동기화합니다.

![Coveralls 설정](https://cl.ly/2S2i003A1c3A/Screen%20Shot%202018-05-13%20at%2016.12.54.png)

그리고 'Details' 버튼을 누른 다음 `repo_token` 을 복사합니다. 보통은 이런 비밀 토큰을 바로 공개 프로젝트에 드러내고 싶진 않으실테니 Travis CI의 대시보드에서 저장소를 찾아 토큰을 추가합니다.

![Coveralls 토큰을 Travis CI에 추가](https://cl.ly/2M15263v1T3G/Screen%20Shot%202018-05-13%20at%2016.15.34.png)

CI 설정에서 환경변수를 등록할 수 있습니다. `coveralls_repo_token` 이라는 이름으로 등록해줍니다.

![Travis CI에 환경 변수 등록하기](https://cl.ly/3C2R1b140R2k/Screen%20Shot%202018-05-13%20at%2016.18.17.png)

이제 프로젝트의 설정을 변경해주면 됩니다. 맨 처음 `coveralls` 라이브러리를 개발 의존성으로 추가합니다.

```
npm install --save-dev coveralls
```

다음에 `package.json` 에 coveralls를 실행하는 스크립트를 추가합니다.

```json
"scripts": {
  "start": "webpack-dev-server --config ./webpack.config.js",
  "test:unit": "mocha --require babel-core/register --require ./test/helpers.js --require ./test/dom.js --require ignore-styles 'src/**/*.spec.js'",
  "test:unit:watch": "npm run test:unit -- --watch",
  "test:snapshot": "jest --config ./test/jest.config.json",
  "test:snapshot:watch": "npm run test:snapshot -- --watch",
  "coveralls": "cat ./src/coverage/lcov.info | node node_modules/.bin/coveralls"
},
```

세 번째로 Travis CI 설정을 바꿔서 coveralls.io 대시보드에 커버리지를 표시하도록 만듭니다. (역주: 튜토리얼에서는 Node.js 버전을 `stable` 로 지정하였지만, 튜토리얼 작성 시점과 달리 현재 안정화 버전은 10.1.0 입니다. 하지만 coveralls 패키지는 현재 노드 버전 10을 지원하지 않기 때문에 버전을 직접 고정해주시는게 좋습니다.)

```yaml
language: node_js

node_js:
  - 8.11.1

install:
  - npm install

script:
  - npm run test:unit -- --coverage && npm run test:snapshot -- --coverage && npm run test:cypress

after_script:
  - COVERALLS_REPO_TOKEN=$coveralls_repo_token npm run coveralls
```

다 됐습니다. 변경 사항을 Github 저장소로 푸시하시면 빌드가 끝나고 coveralls.io 대시보드에 테스트 커버리지를 확인하실 수 있습니다.

![Coveralls 결과](https://cl.ly/0d1c0S1B3f0m/Screen%20Shot%202018-05-13%20at%2017.01.04.png)

커버리지가 생각보다 높진 않다는 것을 보실 수 있는데요. 테스트를 더 작성하여 커버리지를 높일 지는 하시기 나름입니다.

Travis CI의 뱃지를 추가할 때와 마찬가지로 Coveralls도 멋진 뱃지를 추가할 수 있습니다. coveralls.io 대시보드에 있는 뱃지를 클릭하여 추가하는 코드를 확인하실 수 있습니다. 이 코드도 `README.md` 파일에 추가합니다.

```markdown
# React Application Test Example

[![Coverage Status](https://coveralls.io/repos/github/adhrinae/react-application-test-example/badge.svg?branch=master)](https://coveralls.io/github/adhrinae/react-application-test-example?branch=master)
```

저장소 주소가 제대로 되어있는지 다시 확인해주세요. 이렇게 마지막 과정으로 리액트 테스팅 환경에서 커버리지까지 확인해볼 수 있었습니다. 지금까지 작성한 예제보다 더 높은 테스트 커버리지를 노려보세요 :)

## 마치며

드디어 기나긴 리액트 테스팅 튜토리얼을 마칩니다. 여러분이 직접 자신만의 리액트 테스팅 환경을 구축하고, 첫 테스트를 작성한 뒤에 CI를 구축하여 배포 전에 애플리케이션의 안정성을 확인해 보는 방법을 배우셨길 바랍니다. 이번 튜토리얼의 예제 전체는 [이 저장소](https://github.com/rwieruch/react-components-test-setup)에서 확인하실 수 있습니다. 한마디 더 말씀드리자면, 앞서 보신 간단한 테스트 패턴들은 리액트 애플리케이션 테스트를 작성할 때 짜증을 유발하기보다 더 습관에 가깝게 작성할 수 있도록 도우리라 생각합니다. 당장 여러분의 애플리케이션에 테스트 몇개 작성하는 것도 크게 어렵지 않을 겁니다. 리액트 애플리케이션 테스팅을 할 때 또 다른 팁이 있으시다면 언제든지 댓글로 의견을 남겨주세요. 읽어주셔서 고맙습니다 :)

---

## 번역 후기

처음 튜토리얼이 올라오고 원 저자인 Robin에게 허락을 받은 뒤 저장소를 만들고, 최종 결과물을 내기까지 거의 1.5개월이 걸렸습니다. 아무리 바쁜 나날을 보냈다 하더라도 조금은 더 빨리 마무리 할 수 있었으리라 하는 아쉬움이 있네요.

테스팅에 대해 기존에 여러 글을 번역했습니다만, 조금 더 밑바닥부터 설정하는 방법에 초점을 맞춘 글을 번역하거나 작성하진 못했습니다. 마침 이 글이 그 부분에서 크게 도움이 된다고 생각하여 번역을 진행했고, 저도 번역 과정에서 많은 내용을 공부할 수 있었습니다.

개인적으로 Mocha + Chai 설정을 하시기 보다 바로 Jest 설정을 하는 방법부터 진행하시는걸 추천하긴 합니다. 요즘 어지간해서는 Jest로 테스트 설정을 하니까요. 다만 이 튜토리얼은 Jest를 스냅샷 테스트하는데만 사용합니다. 공식 문서등을 참고해서 전반적인 테스트 설정하는 법을 보시는게 좋습니다.

컴포넌트를 테스트하는 일은 생각보다 복잡하거나 어려울 수 있습니다. 그래서 보통 스냅샷 테스트를 남발하는 경향이 있는데, 애플리케이션의 복잡성이 늘어날 수록 조금 더 구체적인 테스트를 작성하는게 도움이 되리라 생각합니다. 하지만 꾸준히 관리하는 스냅샷 테스트를 가지고 있는 프로젝트는 아예 테스트가 없는 프로젝트보단 확실히 낫겠지요.

그럼 앞으로도 테스트와 함께 버그 적은 애플리케이션을 작성하시길 바랍니다 :)
