---
path: "/posts/lessons-learned-testing-react-redux-apps-with-jest-and-enzyme-kr"
date: "2018-01-27"
title: "[번역] 리액트 + 리덕스 앱을 Jest와 Enzyme으로 테스트 하며 얻은 교훈"
category: "Testing"
tags:
  - Testing
  - React
  - Javascript
---

**더 좋은 테스트를 위한 번역 시리즈**

1. [그래서, 자바스크립트 테스트가 뭔가요?](/posts/what-is-testing-javascript-kr)
2. [테스트를 작성하라. 너무 많이는 말고. 통합 테스트를 많이 써라.](/posts/write-mostly-integration-test-kr)
3. [리덕스 앱을 저비용 고효율로 통합 테스트 하기](/posts/integration-tests-in-redux-apps)
4. [리액트 + 리덕스 앱을 Jest와 Enzyme으로 테스트하며 얻은 교훈](/posts/lessons-learned-testing-react-redux-apps-with-jest-and-enzyme-kr)

## 번역 서문

더 좋은 (리액트 애플리케이션) 테스트를 위한 번역 시리즈 마지막입니다. 처음에는 팀원들과 공유하기 위해 테스트의 기초적인 부분을 다루는 글을 번역하려다가, 최대한 실전에 도움이 되면서도 부담없이 시작할 수 있는 내용 위주로 좋은 글을 찾아서 번역해보았습니다.

제 자신도 번역을 통해 ‘어디까지 테스트하는게 실무에 도움이 많이 될까?’ 라는 질문의 답을 얻는데 많은 도움이 되었습니다. 이제 테스트만 잘 짜면 될텐데요.

![test-right-now](https://cl.ly/0P3O322S1P3y/Screen%20Shot%202018-01-27%20at%2014.46.48.png)

다음에는 어떤 글을 쓰거나 번역할지 아직 모르겠지만 모쪼록 도움이 되었으면 좋겠습니다.

[원문은 여기서 보실 수 있습니다](https://medium.com/@Tetheta/lessons-learned-testing-react-redux-apps-with-jest-and-enzyme-eb581d6d167b)

- - - -

만약 여러분이 기술 중심 회사에서 일하시는게 아니라면, 단위 테스트같은 개발 요소를 도입한다고 관리자를 설득하는게 어려울 수 있습니다. 저는 한동안 열렬한 지지자가 되어(역주: 필자 자신이 ‘관리자’ 임을 암시하는 문장이라 봅니다)  몇몇 프로젝트에 단위 테스트를 도입하고 동료들과 몇 가지 패턴을 도입해보았습니다. 그 과정에서 제가 배운 교훈을 이야기하고자 합니다.

## 설정이 만만치 않습니다 😐

여러분이 create-react-app 같은 것을 사용하고 있거나 회사에서 이미 Jest + Enzyme 설정을 해 두었다면 아주 좋습니다!

저처럼 밑바닥부터 설정해야 한다면 몇 가지 유의하실 점이 있습니다.

1. Jest는 노드 환경에서 실행됩니다. 즉 Webpack같은 번들러의 결과물을 실행하는 것이 아니라 파일의 코드 그대로 실행한다는 뜻입니다. 따라서 ES6나 기타 문법을 사용하고 싶다면 테스트 환경에서 사용하는 `.babelrc` 파일을 설정해야 합니다.
2. 위에 이어서 브라우저가 아니라 노드 환경에서 실행되기 때문에 import, export 같은 문법을 사용하기 위해 폴리필을 추가해야 할 수도 있습니다.
3. 최신 버전의 Enzyme은 Jest가 제대로 실행되기 위해 [설정 파일이 필요합니다](http://airbnb.io/enzyme/#installation).
4. 아마 폰트, 이미지, 스타일 파일들을 잔뜩 모킹해야 할지도 모릅니다.
5. CI(Continuous Integration) 빌드 중 테스트를 실행하고 싶다면 `testResultProcessor`, `runInBand` 설정을 해 주시는게 좋습니다. 저는 [Bamboo](https://github.com/CHECK24/jest-bamboo-reporter)를 사용하고 있습니다.

컴포넌트를 작성하는 환경과 테스트를 작성하는 환경을 최대한 비슷하게 맞추기 위해(ES2017, import/export 등) 제대로 된 폴리필을 설정하는 것이 가장 큰 장벽이었습니다. React 버전 16으로 업그레이드 하는 것도 꽤 흥미로운 일이었지만 이제 대부분은 자연스럽게 적응(최소한 문서화라도)했습니다.

기회가 된다면 언젠가 제 설정을 짚어보는 포스트를 써 볼지도 모릅니다. 제 프로젝트의 일부는 그저 문서로 남겨두기엔 특이한 환경을 가지고 있었고, 고통스럽기도 했습니다.

## 스냅샷을 사용하세요 (json serializer와 함께 사용하면 더 좋습니다)

스냅샷은 아주 좋습니다 😃. 하지만 이런 코드를 실행하면

```js
test('Match previous snapshot', () => {
  expect(wrapper).toMatchSnapshot();
});
```

그냥 enzyme이 사용하는 자체 객체를 뱉어버립니다😦. 저는 [enzyme-to-json](https://github.com/adriantoine/enzyme-to-json) 같은 패키지를 써서 가독성을 높이길 추천합니다. 스냅샷이 변경되었을 때 아주 유용합니다.

그리고 스냅샷을 버전 관리 시스템(Git 등)에 포함시키세요. 여러분이 반영한 변경 사항이 갑자기 문제를 일으킬 때 문제점을 찾는 데 큰 도움이 됩니다.

## jest —watch 도 좋습니다 😃

테스트 할 때 반드시 사용하세요! 여러가지 일을 편하게 만들어주고, 패턴 매치(`p` 키를 누른 뒤 파일이나 폴더 이름을 입력해보세요)를 사용해서 매번 저장할 때마다 모든 테스트를 다시 실행하지 않게 만들 수도 있습니다.

## test() 문의 괄호가 제대로 놓여있는지 확인하세요

```js
test('Test'), () => {
  expect(test).toEqual(test);
}
```

위의 코드는 지극히 정상적인 자바스크립트 코드지만 테스트를 실행하면 모두 잘 작동한다면서 아무 일도 일어나지 않을 겁니다.

올바른 코드는 이렇게 작성합니다.

```js
test('Test', () => {
  expect(test).toEqual(test);
});
```

이런 실수는 쉽게 저지를 수 있는데다 테스트에 문제가 있는데도 통과하기 때문에 특히 무섭습니다. 저는 특정 단위 테스트를 잘못 썼는데(역주: 문법적 실패가 아니라 fail이 뜨는 코드) 실패가 뜨지 않았습니다. 비슷한 코드를 복사하고 붙여넣다가 간신히 이 실수를 발견했지요.

그래서 생각한 것이...

## 테스트가 실패하는지 꼭 확인하세요

여러분이 실력있고 TDD를 사용하는 개발자라면 이미 이 방법을 사용하고 있을 겁니다.

그렇지 않은 분이라면 단위 테스트를 너무 후순위로 취급하기 때문에 테스트를 한 뭉치 작성하고 “좋아! 잘 작동하는군! 이제 다음 단계로 가야지” 라고 생각하기 쉽습니다.

하지만 앞서 언급된 문제로 이어질 수있는데다, 비슷한 테스트를 복사-붙여넣기 하다보면 특히 쉽게 잘못된 요소나 모킹한 함수를 테스트 할 수 있습니다.

테스트의 중요한 부분을 잠시 주석처리하는 식으로 쉽게 테스트를 실패하게 만들 수 있으며, 덕분에 여러분이 수없이 겪을 지도 모르는 골치 아픈 상황에서 벗어날 수 있습니다.

## 반복 가능하고 확장 가능한 테스트 패턴을 만들어보세요

여러분이 혼자서 프로젝트의 테스트를 만들거나 유지보수하지 않는 이상, 새 컴포넌트를 빠르고 쉽게 테스트하거나 최소한 기본 수준의 테스트라도 빠르게 만들고 싶을겁니다.

제 동료 개발자들을 보니 가장 큰 장벽은 “어떻게 시작해야할지 모른다” 는 부분이었습니다. 명확하고 따라하기 쉬운 패턴을 만들어서 그들을 도울 수 있습니다.

예를 들어 많은 사용자 입력을 받는 컴포넌트를 테스트하고 싶다면 이런 방식으로 테스트 해 볼 수도 있습니다.

```js
const userChangeCases = [{
  name: 'Test1',
  props: { toLowercase: true },
  value: 'testPre',
  result: 'testpre'
}];
const props = {
  onDataChange: jest.fn()
};
describe('Testing TextComponent', () => {
  let wrapper = null;
  beforeEach(() => {
    wrapper = mount(<TextComponent {...props} />);
  });
  describe('On Change Cases', () => {
    userChangeCases.forEach(item => {
      test(item.name, () => {
        wrapper.setProps(item.props);
        const input = wrapper.find('input');
        input.simulate('change',
          { target: { value: item.value } });
        expect(props.onDataChange).
          toBeCalledWith(item.resultValue);
    });
  });
});
```

그리고 나중에 추가로 사용자 입력 케이스를 테스트할 때 손쉽게 `userChangeCases` 배열에 추가하면 됩니다. 게다가 다른 컴포넌트에 비슷한 테스트를 해야하면 복사하기도 쉽습니다.

사실 이렇게 제가 따르고 있는 작은 규약들을(beforeEach로 매 테스트마다 wrapper 지정하기, 이름 짓는 방법, props 객체에 [전개 연산자--MDN 문서 영문판으로 다시 보시길 권장합니다--](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Spread_operator)  사용하기) 어딘가에 정의해두면 다른 사람들이 쉽게 이해하고 자신의 컴포넌트를 테스트 할 때 유용하게 테스트 작동 원리를 베껴갈 수 있습니다.

이 예는 다소 부자연스럽지만(저는 일반적으로 테스트에 따라 입력 값 변화를 처리하는 순수 함수를 만듭니다) 전체 시스템이 작동하는지 여부를 신속하게 알 수 있으며, 복잡한 입력을 수행하지 않는 경우 필요에 맞게 적절하게 사용 할 수 있습니다.

## Enzyme: Mount vs Shallow

`shallow` 는 “순수 단위 테스트” 방식의 접근입니다. 단순히 여러분이 테스트하고자 하는 컴포넌트아 DOM을 본떠서 그 컴포넌트가 어떤 역할을 수행하는지 테스트합니다. 이런 방식의 테스트는 더 빠르게 동작합니다.

아주 괜찮은 것 같지만, 여러분은 무엇을 테스트하고자 하는지 신경 쓰셔야 합니다. 각각의 컴포넌트를 완벽하게 분리하고 전체 단위 테스트 커버리지를 높이는게 목표인가요? 아니면 여러가지 문제가 될 수 있는 경우를 테스트하고 그 과정에서 컴포넌트가 제대로 동작하는지를 확인하는게 목표인가요?

전자의 경우는 `shallow` 를 사용하는게 아마 완벽한 해결책이겠지만 후자의 경우는 `mount` 를 쓰는 게 좀 더 이상적입니다.

`mount` 는 컴포넌트에 속한 모든 것을 가상화(simulates)합니다. 말인즉슨 자손 컴포넌트(예를 들어 특별한 입력 컴포넌트라던가)를 잡아내서 입력값의 변화를 테스트해볼 수도 있습니다. 이렇게 사용자의 동작을 흉내내면서도 테스트하고자 하는 컴포넌트를 부모 컴포넌트와 그 주변 환경에서 분리할 수 있습니다.

또한 `mount` 는 [리액트의 라이프사이클 메서드(lifecycle methods)](https://velopert.com/1130)를 가상화할 수 있습니다. 특정 라이프사이클 메서드에 많은 로직이 있는 복잡한 컴포넌트를 테스트할 때도 유용합니다.

텍스트 기반의 컴포넌트를 `mount` 로 테스트하는 예를 보여드리겠습니다.

(제 실수를 지적해주신 [Ying Wang](https://medium.com/@ywcoder)님께 감사드립니다. `shallow` 도 마찬가지로 컴포넌트 안의 html 요소를 가상화합니다. 자손 컴포넌트를 다루지 않을 뿐입니다. 이에 맞추어 글을 수정했습니다.)

```js
import CustomInput from './CustomInput.jsx';
/*
CustomInput 컴포넌트 안에는 이렇게 생긴 input 태그가 있고
<input type="text" disabled={this.props.disabled} onChange={this.props.onChange}
TextComponent는 이 컴포넌트로 prop을 전달합니다.
*/
const props = {
  value: 'Nothing',
  onChange: jest.fn()
};
describe('Testing TextComponent', () => {
  let wrapper = null;
  beforeEach(() => {
    wrapper = mount(<TextComponent {...props} />);
  });
  test('OnChange called', () => {
    const input = wrapper.find(CustomInput).find('input');
    input.simulate('change', { target: { value: 'TestVal' } });
    expect(props.onChange).toBeCalledWith(
      expect.objectContaining({ target: { value } }); // 이벤트가 올바르게 전달되었는지 확인
  });
  test('isDisabled prop works', () => {
    wrapper.setProps({ isDisabled: true });
    const input = wrapper.find(CustomInput).find('input');
    expect(input.prop('disabled')).toBe(true);
  });
});
```

이런 방식의 테스트는 통합 테스트와 단위 테스트와의 경계를 흐리게 하지만, Guillermo Rauch는 이렇게 말했습니다.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Write tests. Not too many. Mostly integration.</p>&mdash; Guillermo Rauch (@rauchg) <a href="https://twitter.com/rauchg/status/807626710350839808?ref_src=twsrc%5Etfw">December 10, 2016</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

Kent C. Dodds도 이 트윗에 대해 [글을 썼는데](https://emaren84.github.io/posts/write-mostly-integration-test-kr) 꽤 설득력 있습니다.

제 생각에 두 종류의 테스트 모두 적합한 경우가 있습니다만, 제가 만든 대부분의 애플리케이션에서 단위 테스트를 하기에는 시간이 아깝고 저는 세부 구현이나 기반에 깔린 코드를 테스트하기보다 실제로 동작하는 부분을 테스트하는데 집중하고 싶습니다. 저도 계속 (실용적인 테스트의) 중심을 잡아보려고 노력중입니다.

요즘은 기본적으로 `mount` 를 사용하고 테스트 퍼포먼스에 영향이 가는 경우에만 `shallow` 를 사용하고 있습니다. 두 경우의 API가 약간 다르므로 특정 작업을 테스트하는 방법을 더 쉽게 기억할 수 있습니다.

## Redux 테스트는… 흥미로워요 😕

반면에 리덕스 액션과 리듀서는 무진장 테스트하기 쉽습니다. 그저 함수일 뿐 아니라 리듀서는 어떠한 부수 효과도 없는 순수 함수여야 합니다.

하지만 redux-thunks나 redux-saga를 사용하고 계시다면 조금 흥미로운(?) 일이 되고, `connect` 로 연결된 컴포넌트를 테스트 하는 일은 더욱 복잡해지게 됩니다.

Thunk와 Saga는 다른 액션을 대신 보내주면서 비동기 작업을 다루는 일을 합니다. 그래서 스토어를 본뜬 다음에 무슨 액션이 보내졌는지 확인해야하고, 부수 기능도 본떠야 합니다. 매번 테스트할때마다 실제 데이터베이스 호출 등을 하면 안되니까요.

Saga는 최소한 [테스트 가능하도록 디자인 되어있고](https://redux-saga.js.org/docs/advanced/Testing.html) 테스트에 도움되는 기능들을 가지고 있지만, Thunks는 부수 작업이 끝날때까지 대기가 걸리게 만듭니다.

결국 이런 질문으로 이어지게 되지요. “어느 부분까지 테스트 할 것인가?”

리덕스 앱을 전체적으로 테스트하기 위한 [좋은 자료](https://redux.js.org/docs/recipes/WritingTests.html)가 있습니다만, 여러분이 직접 작성한 코드 말고 리덕스를 테스트하는데 무슨 의미가 있을까요? 리덕스 자체는 완전히 테스트를 마친 라이브러리라서 우리가 같은 테스트를 또 할 필요는 없습니다. 게다가 `connect` 로 연결된 컴포넌트를 테스트하는건 굉장히 복잡하기 때문에 앱의 큰 부분을 본떠야 하는 불편함을 감수해야 합니다.

저는 액션을 제대로 보내기만 하면 리덕스 스토어가 이를 받아서 처리할거라고 확신합니다. 제가 진짜 신경쓰는 부분은 컴포넌트가 그 액션을 잘 받아서 제대로 변화가 일어나는지 확인하는 겁니다. 통합 테스트의 영역이지요.

그래서 제가 테스트를 할 때는

1. 먼저 리듀서를 테스트합니다. 테스트하기도 쉽고 중요한 기능을 가지고 있으니까요.
2. 그리고 리덕스에 연결되지 않은 컴포넌트를 테스트합니다. 특정 이벤트에 제대로 반응하는지 확인할 수 있습니다. 그리고 테스트하기 쉬운데다 데이터를 다루는 부분과 랜더링을 다루는 부분을 분리하여 볼 수 있습니다.
3. 복잡한 데이터를 다루는 부분을 순수 함수로 빼내어 테스트합니다.
4. 제 앱의 각 부분이 잘 맞아떨어지는지 확인하기 위해 Selenium을 써서 E2E(end to end) 테스트와 통합 테스트를 합니다.

이 방법이 완벽한 방법은 아닙니다. 저는 아직 마지막 두 부분을 처리하기 위한 최상의 방법을 찾고 있습니다만, 이 방법들도 테스트 작성을 간단하게 해주며 생산적이라는 생각이 듭니다.

매번 제가 동료들에게 리덕스에 연결된 컴포넌트를 다 테스트해서 보여줄 때마다 그들의 눈에는 동공지진이 일어납니다(their eyes instantly start glazing over). 많은 로직이 있고 본떠서 다루어야 할 것도 많습니다. 이런 복잡한 것들을 제쳐두면 일이 더 쉬워지며 사용자(혹은 매니저)를 우선적으로 고려한 유형의 테스트를 작성하는데 집중할 수 있습니다. 대부분의 프로젝트에 테스트를 작성할 시간이 얼마나 적은지를 생각한다면 괜찮은 등가교환이라 생각합니다.

## 결론

저는 아직도 테스트를 적절하게 하는 법을 배우고 있습니다. 그리고 지난 1년동안 많은 자료를 읽기도 하고 보기도 했습니다. 여러분이 자신만의 패턴을 만들면 Jest와 Enzyme으로 단위 테스트하는건 놀라우리만치 쉽습니다. 특히 리덕스의 복잡한 부분을 통합 테스트와 E2E 테스트로 옮기는 경우에도 유용합니다.

Jest와 Enzyme을 다루는게 어렵다면 [ReactFlux](https://www.reactiflux.com/)를 방문해보세요. 거기 있는 Jest 채널에서 많은 도움을 얻었습니다.

이제 막 Jest + Enzyme으로 테스트를 시작하신다면 [이 훌륭한 가이드](https://hackernoon.com/testing-react-components-with-jest-and-enzyme-41d592c174f)를 읽어보세요.

스냅샷 테스트에 대해 더 자세히 알아보시려면 [이 가이드](https://hackernoon.com/how-to-snapshot-test-everything-in-your-redux-app-with-jest-fde305ebedea)를 참고하세요.

마찬가지로 React, Redux, Jest의 공식 문서를 꼭 살펴보세요. 모두 최고 수준의 가이드를 제공합니다.

이 글이 여러분의 테스팅을 향한 여정에 도움이 되었으면 좋겠습니다. 어떠한 질문이나 코멘트가 있다면 [트위터로](https://twitter.com/tetheta) 연락주세요.