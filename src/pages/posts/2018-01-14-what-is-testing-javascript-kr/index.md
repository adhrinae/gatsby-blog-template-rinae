---
path: "/posts/what-is-testing-javascript-kr"
date: "2018-01-14"
title: "[번역] 그래서, 자바스크립트 테스트가 뭔가요?"
category: "Testing"
tags:
  - Translation
  - Javascript
  - Testing
---

**더 좋은 테스트를 위한 번역 시리즈**

1. [그래서, 자바스크립트 테스트가 뭔가요?](/posts/what-is-testing-javascript-kr)
2. [테스트를 작성하라. 너무 많이는 말고. 통합 테스트를 많이 써라.](/posts/write-mostly-integration-test-kr)
3. [리덕스 앱을 저비용 고효율로 통합 테스트 하기](/posts/integration-tests-in-redux-apps-kr)
4. [리액트 + 리덕스 앱을 Jest와 Enzyme으로 테스트하며 얻은 교훈](/posts/lessons-learned-testing-react-redux-apps-with-jest-and-enzyme-kr)

## 들어가며

요즘 개인적으로 “가능한한 내 코드에 모두 테스트를 작성하겠다” 라는 목표를 가지고 있습니다. 하지만 테스트에 대해 두루뭉술한 개념만 가지고 있고, 지금은 상대적으로 쉬운 함수만 테스트를 작성할 수 있는 수준입니다.

하지만 실제 개발하고 있는 애플리케이션은 ‘리액트 + 리덕스(혹은 MobX) + 기타등등’ 의 구성으로 되어있기 때문에 조금만 테스트를 제대로 해 보려고 하면 어디부터 손을 대야할지 전혀 감을 못 잡는 상태입니다.

그래서 실전에 최대한 도움이 될 수 있도록 유용한 글을 몇개 추려서 단계별로 보기 좋은 참고서가 될 수있도록 번역하는 사이드 프로젝트를 진행하고 있습니다. 이 글을 보시는 분들도 리액트로 만드는 애플리케이션을 테스트하는데 도움이 되었으면 좋겠습니다.

그 첫 번째 단계로 **테스트가 대체 뭐냐?** 라는 질문에 가벼운 답이 될 수 있는 글의 번역부터 시작합니다.

[원문은 여기서 읽어보실 수 있습니다.](https://blog.kentcdodds.com/but-really-what-is-a-javascript-test-46fe5f3fad77)

- - - -

*일단 한 발짝 물러서서 시작부터 자바스크립트 자동화 테스트를 이해해 보도록 하겠습니다.*

소프트웨어를 테스트하는 이유는 수도 없이 많습니다. 저는 크게 두 가지 이유를 가지고 있습니다.

1. 전체 작업 흐름의 속도를 올려서 개발을 빠르게 한다.
1. 변경 사항이 있을 때 기존 코드를 무너트리지 않는다는 확신을 갖도록 도와준다.

그래서 그런데, 저는 여러분에게 몇 가지 여쭈어 보고 싶은게 있습니다. (트위터 투표로 미리 물어보았죠)

- [자바스크립트 테스트를 작성해 보신 적 있습니까?](https://twitter.com/kentcdodds/status/942625485829181441)
- [자바스크립트 테스팅 프레임워크를 사용해 보신 적 있습니까?](https://twitter.com/kentcdodds/status/942625486638759938)
- [자바스크립트 테스팅 프레임워크를 밑바닥부터 설정해 보신 적 있습니까?](https://twitter.com/kentcdodds/status/942625487511154688)
- [테스팅 프레임워크를 충분히 이해하고 있고, 아주 간단한 테스팅 프레임워크라도 직접 만들어 보실 수 있습니까?](https://twitter.com/kentcdodds/status/942625489348280320)

이 글의 목적은 당신이 마지막 질문에 “네” 라고 대답할 수 있도록 돕는 것입니다. 결과적으로 자바스크립트를 테스트한다는게 무엇인지 알아야 더 좋은 테스트를 작성할 수 있으니까요.

이제 간단한 `math.js` 모듈을 만들어서 그 안에 두 함수를 작성한 다음에 내보내겠습니다.

```js
const sum = (a, b) => a + b
const subtract = (a, b) => a - b

module.exports = { sum, subtract }
```

**작성하는 모든 코드는 [Github에](https://github.com/kentcdodds/js-test-example) 올려두었으니 참고하시면 됩니다** 🐙😸

## 1단계

제가 생각할 수 있는 가장 기본적인 테스트 형식을 보여드리겠습니다.

```js
// basic-test.js
const actual = true
const expected = false
if (actual !== expected) {
  throw new Error('${actual} is not ${expected}')
}
```

터미널에서 `node basic-test.js` 라고 입력하시면 이 테스트 코드를 실행할 수 있습니다. 이게 테스트입니다!

**테스트는 기대하던 결과값과 실제 출력된 값이 맞지 않으면 에러를 일으키는 코드입니다.** 만약 특정한 상태값 설정을 해야하는 등(예를 들자면 컴포넌트가 테스트 실행 전에 그려져야(Rendered on Document) 브라우저 이벤트를 확인해볼 수 있다던가, 데이터베이스에 있는 사용자를 가져온다던가) 특수한 경우에는 더 복잡해질 수 있습니다. 하지만 `math.js` 모듈 같은 순수한 함수(Pure function - 입력값에 따른 출력값이 동일하며 외부의 상태에 영향을 미치지 않는 함수)은 상대적으로 쉽습니다.

**코드의 `actual !== expected` 부분을 “단언(assertion)” 이라고 합니다.** 단언은 어떤 것이 특정한 값으로 되어있어야 한다거나 특정 테스트를 통과해야한다고 코드로 표현하는 것을 뜻합니다. `actual` 부분이 어떠한 정규표현식에 일치해야하거나, 배열이 특정한 길이를 가지고 있어야 한다고 표현하는 것이 단언이 됩니다. 중요한 점은 만약 우리가 작성한 단언이 실패하면 에러가 일어나야 한다는 것입니다.

그래서 `math.js` 를 가장 기본적인 형태로 테스트 해 본다면 이렇게 됩니다.

```js
// 1.js
const {sum, subtract} = require('./math')
let result, expected
result = sum(3, 7)
expected = 10
if (result !== expected) {
  throw new Error(`${result} is not equal to ${expected}`)
}
result = subtract(7, 3)
expected = 4
if (result !== expected) {
  throw new Error(`${result} is not equal to ${expected}`)
}
```

짜잔! 이 파일을 `node` 커맨드로 실행해보면 에러 없이 실행되고 종료됩니다. 이제 `sum` 함수의 `+` 연산을 `-` 연산으로 바꾸고 다시 실행해서 테스트를 깨지도록 만들어보겠습니다.

```
$ node 1.js
/Users/kdodds/Desktop/js-test-example/1.js:8
  throw new Error(`${result} is not equal to ${expected}`)
  ^
Error: -4 is not equal to 10
    at Object.<anonymous> (/Users/kdodds/Desktop/js-test-example/1.js:8:9)
    at Module._compile (module.js:635:30)
    at Object.Module._extensions..js (module.js:646:10)
    at Module.load (module.js:554:32)
    at tryModuleLoad (module.js:497:12)
    at Function.Module._load (module.js:489:3)
    at Function.Module.runMain (module.js:676:10)
    at startup (bootstrap_node.js:187:16)
    at bootstrap_node.js:608:3
```

좋습니다! 우리는 벌써 기본적인 테스트를 사용해서 이득을 보고 있어요! 이제 테스트를 변경하지 않는 이상 `sum` 함수를 마음대로 바꿀 수 없습니다. 쩌네요(Neato)!

**테스팅 프레임워크(혹은 단언 라이브러리)의 가장 중요한 부분은 에러 메세지를 최대한 도움이 되도록 표현하는 겁니다.** 테스트가 실패할 때마다 여러분이 제일 먼저 에러 메세지를 보게 됩니다. 만약 에러 메세지를 보고 어떤 문제가 밑에 깔려있는지 단박에 파악하지 못한다면, 몇분씩 코드를 직접 들여다보면서 뭐가 잘못됐는지 찾아야 합니다. 에러 메세지의 질은 여러분이 주어진 테스팅 프레임워크를 얼마나 잘 이해하고 적절한 단언을 사용하느냐에 따라서 크게 달라집니다.

## 2단계

사실 Node.js 가 위에서 만들어본 [`assert`](https://nodejs.org/api/assert.html#assert_assert) 모듈을 내장하고 있다는 걸 알고 계셨나요🤔? 이 모듈을 써서 리팩터링을 해 보겠습니다!

```js
// 2.js
const assert = require('assert')
const {sum, subtract} = require('./math')

let result, expected

result = sum(3, 7)
expected = 10
assert.strictEqual(result, expected)

result = subtract(7, 3)
expected = 4
assert.strictEqual(result, expected)
```

좋아요! 저번에 작성했던 코드와 기능적으로 완전히 동일한 테스트 모듈을 작성해보았습니다. 딱 하나 다른게 있다면 에러 메세지입니다.

```
$ node 2.js
assert.js:42
  throw new errors.AssertionError({
  ^
AssertionError [ERR_ASSERTION]: -4 === 10
    at Object.<anonymous> (/Users/kdodds/Desktop/js-test-example/2.js:8:8)
    at Module._compile (module.js:635:30)
    at Object.Module._extensions..js (module.js:646:10)
    at Module.load (module.js:554:32)
    at tryModuleLoad (module.js:497:12)
    at Function.Module._load (module.js:489:3)
    at Function.Module.runMain (module.js:676:10)
    at startup (bootstrap_node.js:187:16)
    at bootstrap_node.js:608:3
```

내용을 보시면 아쉽게도 에러가 더 이상 코드 내용을 보여주지 않고 있습니다. 😦 일단 계속 가보죠.

## 3단계

더 나아가서 직접 테스팅 “프레임워크” 와 단언 라이브러리를 작성해보겠습니다. 먼저 단언 라이브러리부터 시작해보죠. Node의 내장 `assert` 모듈 대신에 `expect` 라는 라이브러리를 만들어보겠습니다. 변경된 코드는 아래와 같습니다.

```js
// 3.js
const {sum, subtract} = require('./math')

let result, expected

result = sum(3, 7)
expected = 10
expect(result).toBe(expected)

result = subtract(7, 3)
expected = 4
expect(result).toBe(expected)

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`${actual} is not equal to ${expected}`)
      }
    },
  }
}
```

이제 원하는대로 단언을 추가하고 객체를 리턴하도록 만들 수 있습니다(`toMatchRegex`, `toHaveLength`).

```
$ node 3.js
/Users/kdodds/Desktop/js-test-example/3.js:17
        throw new Error(`${actual} is not equal to ${expected}`)
        ^
Error: -4 is not equal to 10
    at Object.toBe (/Users/kdodds/Desktop/js-test-example/3.js:17:15)
    at Object.<anonymous> (/Users/kdodds/Desktop/js-test-example/3.js:7:16)
    at Module._compile (module.js:635:30)
    at Object.Module._extensions..js (module.js:646:10)
    at Module.load (module.js:554:32)
    at tryModuleLoad (module.js:497:12)
    at Function.Module._load (module.js:489:3)
    at Function.Module.runMain (module.js:676:10)
    at startup (bootstrap_node.js:187:16)
    at bootstrap_node.js:608:3
```

훨씬 보기 좋아졌네요.

## 4단계

그런데 만약 에러 메세지가 나온다 해도 정확하게 `sum` 함수에 문제가 생겼다고 파악하려면 어떻게 해야할까요😖? 저 파일 안에는 `subtract` 함수도 있는데 말이죠. 게다가 테스트 파일의 코드는 각각의 테스트를 적절히 분리하지 못하고 있습니다(시각적으로 + 기능적으로). 

그래서 헬퍼 함수를 만들어서 분리해보았습니다.

```js
// 4.js
const {sum, subtract} = require('./math')
test('sum adds numbers', () => {
  const result = sum(3, 7)
  const expected = 10
  expect(result).toBe(expected)
})
test('subtract subtracts numbers', () => {
  const result = subtract(7, 3)
  const expected = 4
  expect(result).toBe(expected)
})
function test(title, callback) {
  try {
    callback()
    console.log(`- [x] ${title}`)
  } catch (error) {
    console.error(`✕ ${title}`)
    console.error(error)
  }
}
function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`${actual} is not equal to ${expected}`)
      }
    },
  }
}
```

이제 특정 테스트에 관련된 내용은 전부 “test” 콜백 안에 집어넣고, 테스트에 제목을 매길 수 있습니다. 그리고 `test` 함수에 유용한 에러 메세지를 출력하도록 할 뿐만 아니라 모든 테스트를 한번에 실행할 수 있게 되었습니다(첫 번째 테스트에서 에러가 발생한다고 멈추지 않구요)!

```
$ node 4.js
✕ sum adds numbers
Error: -4 is not equal to 10
    at Object.toBe (/Users/kdodds/Desktop/js-test-example/4.js:29:15)
    at test (/Users/kdodds/Desktop/js-test-example/4.js:6:18)
    at test (/Users/kdodds/Desktop/js-test-example/4.js:17:5)
    at Object.<anonymous> (/Users/kdodds/Desktop/js-test-example/4.js:3:1)
    at Module._compile (module.js:635:30)
    at Object.Module._extensions..js (module.js:646:10)
    at Module.load (module.js:554:32)
    at tryModuleLoad (module.js:497:12)
    at Function.Module._load (module.js:489:3)
    at Function.Module.runMain (module.js:676:10)
- [x] subtract subtracts numbers
```

좋아요! 이제 에러 메세지 *뿐만 아니라* 어떤 부분을 고쳐야하는지 테스트 제목을 보고 찾아갈 수 있습니다.

## 5단계

마지막 단계로 모든 테스트 파일을 찾아서 실행하는 [CLI 도구를 작성하기만 하면 됩니다!](https://blog.kentcdodds.com/tips-for-making-a-cli-based-tool-with-node-9903255c2a3b) 처음엔 쉽겠지만 그 위에 해야하는 일들이 굉장히 많아서 좀 어렵습니다 . 😅

현재 시점에서 우리는 테스팅 프레임워크와 테스트 실행기(runner)를 만들었습니다. 다행히도 이미 만들어진 도구가 산더미같이 많습니다! 저는 모든 테스팅 도구를 사용해보았고 다 괜찮았습니다. 그래도 제 요구 사항을 가장 만족하는 도구는 Jest 뿐이었습니다. Jest는 아주 대단한 도구입니다. ([Jest를 더 알아보시려면 이 링크를 확인하세요](http://kcd.im/egghead-jest))

그러니 이제 직접 프레임워크를 작성하는 대신 테스트 파일을 Jest 용으로 바꾸어 보겠습니다. 이를 어쩌죠? 안바꿔도 되는데요!? Jest는 `test`, `expect` 를 글로벌 객체로 가지고 있기 때문에 그냥 이전에 작성한 `test` 와 `expect` 의 구현체를 지우기만 하면 됩니다!

```js
// 5.js
const {sum, subtract} = require('./math')
test('sum adds numbers', () => {
  const result = sum(3, 7)
  const expected = 10
  expect(result).toBe(expected)
})
test('subtract subtracts numbers', () => {
  const result = subtract(7, 3)
  const expected = 4
  expect(result).toBe(expected)
})
```

Jest로 이 파일을 실행하면 다음과 같은 결과가 출력됩니다.

```
$ jest
 FAIL  ./5.js
  ✕ sum adds numbers (5ms)
  - [x] subtract subtracts numbers (1ms)
● sum adds numbers
expect(received).toBe(expected)
    
    Expected value to be (using Object.is):
      10
    Received:
      -4
      4 |   const result = sum(3, 7)
      5 |   const expected = 10
    > 6 |   expect(result).toBe(expected)
      7 | })
      8 | 
      9 | test('subtract subtracts numbers', () => {
      
      at Object.<anonymous>.test (5.js:6:18)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 passed, 2 total
Snapshots:   0 total
Time:        0.6s, estimated 1s
Ran all test suites.
```

텍스트만 보아서는 알 수 없지만 사실 결과는 컬러로 출력됩니다. 이미지로 보시면 이렇게 나옵니다.

![](https://cl.ly/302i0B3V0J45/what-is-javascript-testing-1.png)

컬러로 출력되면 관련된 부분을 살펴볼 때 큰 도움이 됩니다. **그리고 에러가 발생하는 부분의 코드를 직접 보여줍니다! 이게 “도움이 되는” 에러 메세지죠!**

## 결론

그래서 자바스크립트 테스트가 뭐라고 했죠? 단순히 특정 상태를 설정해놓은 코드를 가지고 특정 동작을 수행한 뒤, 새 상태를 확인하는 단언을 만드는 겁니다. 이번 시간에는 [`beforeEach`](https://facebook.github.io/jest/docs/en/api.html#beforeeachfn-timeout), [`describe`](https://facebook.github.io/jest/docs/en/api.html#describename-fn) 같은 [프레임워크 공용으로 사용되는 헬퍼 함수](https://facebook.github.io/jest/docs/en/api.html)에 대한 이야기는 하지 않았지만, [`toMatchObject`](https://facebook.github.io/jest/docs/en/expect.html#tomatchobjectobject), [`toContain`](https://facebook.github.io/jest/docs/en/expect.html#tocontainitem) 같이 사용할 수 있는 단언이 아주 많이 있습니다. 적어도 이 글이 여러분들에게 자바스크립트로 테스트하는데 기본적인 개념을 제시해주길 바랍니다.

도움이 되었으면 좋겠군요. 행운을 빕니다! 👍

**놓치지 말고 참고할만한 글 목록(영어 자료)**

- [Horse JS on Twitter: “But really, what is a JavaScript”](https://twitter.com/horse_js/status/942658114209316864) - 문맥을 빗겨가게 끊어진 글을 트윗하는 아주 재밌는 계정입니다.
- [Introducing React Performance Devtool!! - by Nitin Tulswani](https://twitter.com/NTulswani/status/942079674527518720)
- [JavaScript January](https://www.javascriptjanuary.com)
