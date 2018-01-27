---
path: "/posts/integration-tests-in-redux-apps-kr"
date: "2018-01-19"
title: "[번역] 리덕스 앱을 저비용 고효율로 통합 테스트 하기"
category: "Testing"
tags:
  - Testing
  - React
  - Javascript
---

**더 좋은 테스트를 위한 번역 시리즈**

1. [그래서, 자바스크립트 테스트가 뭔가요?](/posts/what-is-testing-javascript-kr)
2. [테스트를 작성하라. 너무 많이는 말고. 통합 테스트를 많이 써라.](/posts/write-mostly-integration-test-kr)
3. [리덕스 앱을 저비용 고효율로 통합 테스트 하기](/posts/integration-tests-in-redux-apps-kr)
4. [리액트 + 리덕스 앱을 Jest와 Enzyme으로 테스트하며 얻은 교훈](/posts/lessons-learned-testing-react-redux-apps-with-jest-and-enzyme-kr)

## 번역 서문

[지난번](/posts/what-is-testing-javascript-kr) [시리즈](/posts/write-mostly-integration-test-kr)를 통해 테스트가 무엇인지, 어떤 방향으로 테스트를 해야할지 조금 감을 잡으셨을 겁니다. 이제 본격적으로 리액트 애플리케이션을 테스트하고자 하는데, 또 한번 막히게 되죠.

> 통합 테스트가 좋다는 건 알겠는데 좀더 실전에 가까운 예가 필요하다

라고 생각하실지 몰라서 (저도 그렇게 생각하기 때문에) 남은 두 번의 번역 시리즈는 리액트 + 리덕스 애플리케이션 개발 시 테스트를 어떻게 했는지, 참고할만한 팁을 번역할 예정입니다.

참고로 원작자는 ‘Redux app’ 이라는 용어를 계속 사용하고 있어서 저도 그냥 리덕스 앱이라고 번역했습니다. (앵귤러도 리덕스 쓸 수 있는데...) 또한 mocking(흉내내기, 모조품 만들기)의 번역이 부자연스러워 바로 음차했습니다. 더 좋은 표현이 있다면 제안 부탁드립니다.

[원문은 여기서 보실 수 있습니다.](https://hackernoon.com/low-effort-high-value-integration-tests-in-redux-apps-d3a590bd9fd5)

- - - -

**짧은 정리: 여러분은 노드 환경에서 앱을 랜더링하고, 사용자 동작을 흉내내며 상태나 마크업의 변화를 확인할 수 있습니다. 이런 테스트는 상대적으로 작성하기 쉽고 빠르게 작동하며 이를 통해 많은 자신감을 얻을 수 있습니다.**

효율적인 소프트웨어 테스트를 작성하는 일은 아슬아슬한 줄타기 같습니다(tricky balancing act). ‘효율성’ 이라는 용어는 실행 속도나 자원 소모를 의미하는 것이 아니라, 테스트를 작성하는데 드는 노력과 테스트가 제공하는 가치 사이에서 최고로 얻어낼 수 있는 절충안을 의미합니다.

이 문제는 알려지지 않았거나 전혀 새로운 문제가 아닙니다. 과거에 수 많은 똑똑한 사람들이 달려들었고, 나중에 이 문제에 맞딱뜨릴 개발자를 위해 가이드라인을 만들었습니다. 저는 [테스팅 피라미드](https://martinfowler.com/bliki/TestPyramid.html)를 신봉합니다. 테스팅 피라미드는 다양한 종류의 테스트를 제대로 다루는데 앞서, 각각의 코드를 개별적으로 다루는 단위 테스트(Unit test)가 기반이 되어야 한다고 강조합니다.

## 단위 테스트와 리덕스(Redux)

리덕스가 제시하는(역주: ‘강요하는’ 에 가까운 어감으로 느껴집니다) 구조 덕에 단위 테스트를 아주 쉽게 작성할 수 있습니다. 서로 분리되어있는 부분(리듀서, 액션 생성자, 컨테이너 등)을 각각 불러와서 여타 순수 함수와 똑같이 테스트 하면 됩니다. 데이터를 집어넣고, 나온 데이터를 단언(assertion)과 맞춰봅니다. 모킹(mocking)을 할 필요가 없지요. [리덕스 문서 안에 있는 테스팅 가이드](http://redux.js.org/docs/recipes/WritingTests.html)에 각 부분의 단위 테스트를 하는 방법이 작성되어 있습니다.

이 가이드를 따라가면서 지루하게 리듀서끼리, 액션 생성자끼리 테스트를 복-붙(copy-paste) 하다보면 단위 테스트 작성을 끝낼 수 있습니다. 그렇게 모든 작업이 끝나면 테스팅 피라미드가 뒷통수를 때리죠. 단순히 단위 테스트만 가지고는 ‘이 앱이 제대로 작동하는가?’ 라는 가장 기본적인 질문에 답할 수가 없습니다.

## 피라미드 오르기

웹 애플리케이션을 작성하면서 테스팅 피라미드의 윗 단계로 올라가는데 몇 가지 방법이 있습니다. 맨 꼭대기에 있는 end-to-end(e2e) 계층은 Selenium과 [webdriver.io](http://webdriver.io)를 사용해서 구현할 수 있습니다. 이런 종류의 테스트는 기술 독립적이라 여러분이 다른 프레임워크를 사용하도록 앱을 포팅해도 잘 작동합니다. 하지만 구현하고 돌려보는데 오래 걸리고, 디버그하기도 어려우며, 종종 원인 모를 문제에 시달릴 수 있습니다. 보통 아주 적은 종류의 e2e 테스트만 프로젝트에 적용하게 됩니다.

그렇다면 e2e테스트와 단위 테스트 사이에 있는 계층은 어떨까요? 일반적으로 이런 테스트를 통합 테스트(integration test)라고 부릅니다. 애플리케이션의 모듈이 어떻게 상호작용하는지 테스트하지요. 통합 테스트의 범위는 넓습니다. 예를 들자면 액션을 보내기 위해(dispatch) 액션 생성자를 사용하는 리듀서를 테스트한다면 이미 단위 테스트의 범위를 넘어간 겁니다. 다른 측면에서 보면 e2e 테스트는 아주 극단적인 형태의 통합 테스트라고 볼 수 있습니다.

우리는 리덕스에서 통합 테스트 하기에 아주 적절한 지점(sweet-spot)을 찾아보려 합니다. 개발 과정에서 충분히 빨리 돌려볼 수 있어야 하고, 단위 테스트와 같은 테스트 환경을 사용해야 하면서 리덕스로 관리되는 애플리케이션이 제대로 동작하고 있다는 충분한 확신을 줄 수 있어야 합니다.

## 범위를 찾기

우선 테스트 하고자 하는 범위를 설정하는 게 좋은 출발점이 됩니다. 일반적인 웹 앱은 이런 방식으로 구성되어있는데요.

![일반적으로 고도화된 웹앱의 구조](https://cl.ly/271c282D101g/typical-webapp-structure.png)

시스템의 일부는 올바른 테스트 결과를 얻기 위해 모킹되어야 합니다. 제일 제약이 심한 부분이 저 맨 꼭대기 위에 있는 ‘브라우저’입니다. (비록 헤드리스-Headless 라도) 브라우저 인스턴스를 띄워서 테스트를 돌리는 일은 Node.js(이하 노드)에서 테스트 코드를 실행하는 것보다 훨씬 오래 걸립니다. 시작부터 끝까지 진짜 요청이 끝나길 기다릴 필요는 없습니다. 네트워크 계층(역주: 프론트엔드와 백엔드 사이에 통신하는 부분을 지칭하는 것으로 보입니다)은 명확히 정의된 인터페이스라서 적절히 모킹하기 쉽습니다.

## 범위를 모킹하기

리액트와 리덕스를 쓰는 앱이 있다고 가정하면, 노드 환경에서 부드럽게 돌아가는 테스트를 작성하는게 꽤 쉽습니다(심지어 서버 사이드 랜더링을 한다면 프로덕션 환경에서도 가능합니다). [Jest](https://facebook.github.io/jest/)라는 걸출한 테스팅 프레임워크로 테스트를 돌릴 수 있는데다, 마찬가지로 대단한 [Enzyme](https://github.com/airbnb/enzyme)은 브라우저 환경 없이 애플리케이션의 일부 혹은 전체를 랜더링해주고 동작을 확인해볼 수 있게 만들어주기 때문입니다.

Enzyme은 `mount` 라는 함수를 제공하는데, 이 함수로 어떠한 리액트 컴포넌트라도 그려내고 동작을 확인해볼 수 있습니다. 리덕스를 쓰는 앱도 마찬가지로 테스트 가능합니다. 매번 테스트할 때 같은 코드를 반복하지 않기 위해 간단한 유틸리티 함수를 작성해두면 도움이 됩니다. 이 함수는 주어진 상태(Redux 스토어)와 Enzyme의 래퍼 객체(역주: Enzyme을 통해 그려진 컴포넌트를 객체화 한 것. 이후 다양한 메서드를 통해 하위 DOM 탐색 및 다양한 동작을 확인해볼 수 있습니다)를 리턴합니다. 이렇게 만들어둔 함수는 나중에 단언 작성을 꽤 편하게 해줍니다.

```js
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import MyApp from './containers/MyApp';
import createStore from './createStore';
export default function renderAppWithState(state) {
  const store = createStore(state);
  const wrapper = mount(
    <Provider store={store}>
      <MyApp />
    </Provider>
  );
  return [store, wrapper];
}
```

```js
const [, wrapper] = renderAppWithState({ foo: 'bar' });
wrapper
  .find('input')
  .simulate('change', { target: { value: 'hello' } });
```

노드 환경에서 테스트를 실행할 때 네트워크 계층을 깔끔하게 모킹하는 방법이 있습니다. 예를 들어 [nock](https://github.com/node-nock/nock) 같은 라이브러리가 있지요. nock은 테스트를 실행하기 전에 네트워크 요청에 따른 응답 데이터나 에러를 쉽게 선언할 수 있도록 만들어줍니다. 성공적인 GET 요청을 모킹하는 예는 다음과 같습니다.

```js
import nock from 'nock';
nock('https://example.com/api')
  .get('/12345')
  .reply(200, { foo: 'bar' });
// 이후 코드 어디에서나 https://example.com/api/1234 로 요청을 하면
// 성공했다는 응답과 함께 { foo: 'bar' } 를 응답값으로 리턴하게 됩니다.
```

이렇게 설정하면 통합 테스트를 단위 테스트와 비슷한 수준으로 빠르고 편하게 실행할 수 있습니다. 이제 테스트를 구현하기만 하면 됩니다...

![리덕스 통합 테스트를 위해 테스트 범위 모킹](https://cl.ly/3j3q0t3Q0b2G/mock-boundaries.png)

## 무엇을 테스트하나?

여러분이 만든 앱이 정상적으로 동작한다는 자신감을 가장 크게 얻으려면 사용자의 시점에서 통합 테스트를 작성해야 합니다. 버튼 클릭, 폼 채우기 등의 사용자가 조작하는 행위에 따라 앱이 기대한대로 반응하는지 확인하는게 목표입니다.

간단한 폼을 제출한다는 시나리오를 생각해 보겠습니다. 데이터가 폼에 들어있는 상태로 랜더링 한 뒤에 사용자가 ‘제출’ 버튼을 누르는 행위를 흉내를 내 보겠습니다(simulate). 그리고 지정된 API 엔드포인트로 요청을 제대로 보내는지 확인해보겠습니다.

```js
describe('Submitting the form', () => {
  const [, wrapper] = renderAppWithState({ name: 'John Doe' });
  const submitButton = wrapper.find('[type="submit"]');
  it('sends the data and shows the confirmation page', () => {
    nock('https://myapp.com/api').post('/12345').reply(200);
    submitButton.simulate('click');
    // 이제 무슨 일이 일어나는지 확인합니다
  });
});
```

## 언제 테스트하나?

본격적으로 단언을 작성하기 전에, 또 하나의 문제가 있습니다. “테스트를 언제 실행하냐” 인데요(역주: 테스트 코드를 실행하는 행위가 아니라 모든 작업이 다 끝나고 기대값과 결과값을 비교하는 ‘단언’ 을 의미하나봅니다). 모든 변화가 순차적으로 일어나는 단순한 상황에서는 사용자 동작을 흉내를 낸 뒤에 바로 단언을 실행하면 됩니다. 하지만 여러분의 앱은 보통 네트워크 요청 같은 비동기 코드를 다루기 위해 프로미스(Promise) 등을 사용할 겁니다. 네트워크 요청을 순차적으로 실행되게 모킹해놓았다 하더라도, 성공한 프로미스는 `submitButton.simulate('click')` 부분 다음의 코드를 바로 실행할겁니다. 우리는 단언이 실행되기 전에 앞선 작업이 “제대로 끝나기를” 기다리게 해야합니다.

Jest는 여러가지로 비동기 코드를 다루는 방법을 제공하지만, Promise 체인을 직접 다루는 방식으로 동작하거나(이번 예시에는 없지요) , 타이머를 모킹해야 합니다(Promise 기반 코드에는 동작하지 않습니다). `setTimeout(() => {}, 0)` 같은 코드를 사용할 수 있지만 [Jest의 비동기 콜백 기능](https://facebook.github.io/jest/docs/en/asynchronous.html)을 사용해야 해서 코드의 가독성이 떨어지게 됩니다.

하지만 이 문제를 멋지게 해결하기 위해 한 줄짜리 보조 함수를 사용하면 됩니다. 이 함수는 성공한 Promise를 이벤트 루프의 바로 다음 차례로 넘기는 일을 합니다. Jest에서 기본적으로 지원하는 Promise 리턴과 같이 사용하면 됩니다.

```js
const flushAllPromises = () => new Promise(resolve => setImmediate(resolve));

it('runs some promise based code', () => {
  triggerSomethingPromiseBased(); // Promise 기반의 동작 실행
  return flushAllPromises().then(() => {
     // 무슨 일이 일어나는지 확인하기
  });
});
```

## 어떻게 테스트하나?

사용자와 앱의 상호작용이 제대로 이루어지고 있나 확인하려면 어떤 방법이 있을까요?

**마크업(Markup)** - UI가 제대로 변경되었는지 확인하기 위해 페이지의 마크업을 들여다볼 수 있습니다. 예를 들어 [Jest의 스냅샷 기능으로요.](https://facebook.github.io/jest/docs/snapshot-testing.html) (유의할 점: 아래의 테스트 코드를 실행하기 위해 [enzyme-to-json](https://github.com/adriantoine/enzyme-to-json#serializer)같은 Jest 스냅샷 직렬화 모듈(serializer)을 설치해야 합니다)

```js
// ...
expect(wrapper).toMatchSnapshot();
submitButton.simulate('click');
return flushAllPromises().then(() => {
  expect(wrapper).toMatchSnapshot();
});
// ...
```

이런 방식의 단언은 작성하기 아주 쉽지만, 어디에 문제가 있는지 살펴보기 어려워지는 경향이 있습니다. 스냅샷은 가끔 겉으로 보기에 상관없어 보이는 테스트가 실패할 때도 변할 수 있습니다. 게다가 변화가 있었는지 확인만 할 뿐 무슨 행동을 했는지 기록을 남기진 않습니다.

**상태(State)** - 애플리케이션의 상태 변경을 확인하는 방법입니다. 한 곳에 집중된 스토어를 가지고 있는 리덕스 애플리케이션은 테스트하기 쉽지만, 상태가 나뉘어있다면 조금 복잡해질 수 있습니다. 이 때도 스냅샷 테스트를 할 수 있지만 저는 객체를 직접 비교하는 방식을 선호하는 편입니다.

```js
// ...
const [store, wrapper] = renderAppWithState({ name: 'John Doe' });
// ...
expect(store.getState()).toEqual({
  name: 'John Doe',
  confirmationVisible: false,
});
submitButton.simulate('click');
return flushAllPromises().then(() => {
  expect(store.getState()).toEqual({
    name: 'John Doe',
    confirmationVisible: true,
  });
});
// ...
```

상태 스토어는 사용자가 보지 못하는 곳에 감추어져 있기 때문에 사용자 중심적인 테스트와는 약간 거리가 있습니다. 하지만 디자인 변경에 따른 마크업 수정이 일어나는 경우 영향을 덜 받습니다.

**부수 기능(Side effects)** - 여러분의 애플리케이션에 따라 확인해야 하는 부수 기능도 있습니다(네트워크 요청, `localStorage` 변화 등). 이럴 때 nock의 `isDone` 메서드를 활용하여 모킹한 요청이 실제로 사용되었는지 확인할 수도 있습니다. 

**액션 보내기(Dispatched actions)** - 리덕스의 기능을 십분 활용하여 어떤 액션이 발생했는지 쉽게 로그를 정리하고 나열할 수 있습니다. 이를 이용해서 스토어에 액션을 보내는 흐름을 확인해볼 수 있습니다. [redux-mock-store](https://github.com/arnaudbenard/redux-mock-store) 같은 유용한 라이브러리의 도움을 받을 수도 있습니다. 먼저 위에서 정의한 `renderAppWithState` 메서드를 조금 수정해서 가상의 리덕스 스토어를 적용하면, 그 다음 스토어에 어떤 액션들이 호출되었는지 확인하기 위해 `getActions` 메서드를 사용할 수 있습니다.

```js
// ...
// 이제 renderAppWithState는 redux-mock-state를 사용해서 스토어를 생성합니다.
const [store, wrapper] = renderAppWithState({ name: 'John Doe' });
// ...
expect(store.getState()).toEqual({
  name: 'John Doe',
  confirmationVisible: false,
});
submitButton.simulate('click');
return flushAllPromises().then(() => {
  expect(store.getActions()).toEqual([
    { type: 'SUBMIT_FORM_START' }, 
    { type: 'SUBMIT_FORM_SUCCESS' },
  ]);
});
// ...
```

이런 유형의 단언은 특히 코드가 비동기로 흘러갈 때 테스트 하고자 할 때 유용합니다. 또한 테스트 시나리오가 어떤 흐름으로 구성되는지 보여주면서 일종의 문서 역할을 합니다.

## 중심 잡기

앞서 소개한 통합 테스트가 단위 테스트를 완전히 대체한다는 뜻은 아닙니다. 특히 애플리케이션에 무거운 로직이 있는 부분(리듀서나 셀렉터)은 여전히 철저하게 단위 테스트가 적용되어야 합니다. 테스팅 피라미드의 계층은 여전히 유효합니다! 하지만 통합 테스트는 테스트 방법 중 하나로서 충분히 유효하며, 가능한 한 고통을 덜고 더 자신있게 소프트웨어를 배포할 수 있도록 좋은 테스트를 구축하는데 도움이 됩니다.

소프트웨어 테스트라는 주제는 업계에서 가장 많이 오가는 주제 중 하나입니다. 제 동료는 제 글을 검수해주면서 “[통합 테스트는 사기다](http://blog.thecodewhisperer.com/permalink/integrated-tests-are-a-scam)” 라는 글을 알려주기도 했습니다. 어떤 사람들은 저 글을 쓴 사람이 맞다고도 하지만, 제가 생각하기에 흑백 논리로 따질 수 없는 주제라고 생각합니다. 여러분은 어떻게 생각하시나요?