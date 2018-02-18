---
path: "/posts/functional-js-tutorial"
date: "2018-02-19"
title: "자바스크립트로 함수형 프로그래밍 아주 살짝 맛보기"
category: "Functional Programming"
tags:
  - Functional Programming
  - Javascript
---

제가 요즘 프론트엔드 개발을 하면서 주로 관심을 가지고 있는 분야는

- CSS로 레이아웃을 더 잘 잡아보기 (without Grid, Flex - 하위호환 때문에…) + 더 사용자 친화적인 UI 고려하기
- 타입스크립트의 타입 시스템을 적극적으로 활용해보기
- 타입스크립트 뿐 아니라 자바스크립트의 기초에 소홀히 하지 않기
- 다양한 프로그래밍 패러다임과 이론을 익히면서 실무에 접목하기 -> 더욱 간결하고 유지보수가 용이한 코드 작성하기
- [테스팅](https://emaren84.github.io/posts/what-is-testing-javascript-kr)

이 정도로 나열해 볼 수 있습니다.

오늘은 이 중 세 번째와 네 번째 주제에 대해 아주 가벼운 이야기를 해 보려고 합니다. 최근에 자바스크립트 개발과 관련된 담론에서 많이 거론되는 용어가 있습니다. **[Reactive Programming](https://www.reactivemanifesto.org/ko) - 이 선언에 기반한 RxJS 등의 라이브러리**, **Functional Programming(함수형 프로그래밍)** 입니다. 사실 이 용어들이 등장한 것은 꽤 오래 전 일이라고 합니다만.. 저는 요즘에서야 눈을 돌리게 되었네요.

그렇게 함수형 프로그래밍에 관심을 가지면서 책이나 강연 등을 살펴보고, 얼마 전에는 함수를 적극적으로 활용하여 CSS 파일을 압축(minify)하는 아주 간단한 함수를 만들었습니다. 이 압축 함수를 만들면서 제가 조금이나마 익힌 함수형 프로그래밍의 개념을 어떻게 활용했는지, 어떻게 발전시킬 수 있을지 함께 고민하는 시간을 마련해보고자 합니다.

앞으로 제가 선보일 내용은 아주 기초적인데다 심지어 틀릴 수도 있으니 이상한 점이나 잘못된 점이 있다면 댓글이나 메일로 피드백 주시면 대단히 고맙겠습니다.

## 함수형 프로그래밍이란
제가 아는 한에서 여러가지로 장황하게 설명을 해 보려고 했으나, 다음 번역 글이 아주 좋은 설명을 하고 있다고 생각하여 링크로 대신하고자 합니다.

- [(번역) 함수형 프로그래밍이란 무엇인가? – Jooyung Han (한주영) – Medium](https://medium.com/@jooyunghan/%ED%95%A8%EC%88%98%ED%98%95-%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D%EC%9D%B4%EB%9E%80-%EB%AC%B4%EC%97%87%EC%9D%B8%EA%B0%80-fab4e960d263)
- [(번역) 어떤 프로그래밍 언어들이 함수형인가? – Jooyung Han (한주영) – Medium](https://medium.com/@jooyunghan/%EC%96%B4%EB%96%A4-%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D-%EC%96%B8%EC%96%B4%EB%93%A4%EC%9D%B4-%ED%95%A8%EC%88%98%ED%98%95%EC%9D%B8%EA%B0%80-fec1e941c47f)

제 나름의 정의를 내리자면 “더 안정적인 프로그램을 만들기 위해 입력과 출력이 철저히 통제된 순수 함수 및 부수 효과(Side-effect)를 최소화한 함수 위주로 프로그래밍 하는 것. 이를 통해 간결하고 가독성 높은 프로그램을 작성할 수 있으며 동시성 작업을 더 안전하게 구현할 수 있다.” 라고 말씀드릴 수 있겠습니다. 여기서 한마디 더 얹어보자면 **함수를 특별하게 취급하지 않는 프로그래밍 패러다임** 이라고 말씀드릴 수 있겠습니다.

사실 자바스크립트는 **함수형 프로그래밍 언어가 아닙니다.** 이 점은 반드시 인지하고 계셔야 합니다. 단순히 자바스크립트에서 함수가 일급 객체(First Class Citizen)이기 때문에 함수형 프로그래밍 언어인 것은 아닙니다. 함수형 프로그래밍이 가능한 정도입니다. 아마 이 주제 때문에 글 하나가 더 나오겠지만.. 언젠가 제가 더 확고한 기반지식을 쌓고 작성할 기회가 있으리라 생각합니다. (사실 이미 다른 분들의 훌륭한 글이나 번역이 많아서요)

## CSS 압축 함수 만들기 - 초기 버전
리액트 프로젝트를 하면서 외부 CSS나 미리 설정된 CSS를 HTML 헤더에 삽입할 일이 있는데, 저는 이 CSS 파일이 고스란히 노출되기보다 최소한 공백이나 개행 등을 제거하여 용량을 줄이고, 사용자가 조금이라도 빠르게 컨텐츠를 볼 수 있기를 원했습니다. 예를 들면 최상단에 페이지의 기본 설정을 위해 다음과 같은 CSS를 설정하였습니다.

```css
/* page-setup.css */
html {
  font-size: 62.5%;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  width: 100%;
  padding: 0px;
  margin: 0px;
}

div, p, h1, h2, h3, h4, h5, h6, ul, ol, li, dl, dt, dd,
table, th, td, form, fieldset, legend, input, textarea, blockquote, button {
  margin:0;
  padding:0;
}

*, *:before, *:after {
  box-sizing: inherit;
}

li {
  list-style: none;
}
```

사실 CSS는 중괄호(`{}`) 만 제대로 열고 닫히고, 세미콜론을 지켜주는 등 기본적인 문법 요소만 충족하면 정상적으로 동작합니다. 다만 `margin: 0 auto;`  같이 작성되어 있을 때는 `0` 과 `auto` 사이의 공백은 유지해야합니다. 그래서 제가 만들려는 함수의 필요 구현 조건은 이랬습니다.

- CSS 파일 앞 뒤에 불필요한 공백과 개행이 없어야한다.
- CSS 파일 내부에도 개행이 없어야한다.
- CSS 파일 내부에서 다음 문자 주위의 공백은 불필요하다 -> `,`, `;`, `:`, `{`, `}`

그래서 CSS파일 자체를 문자열로 읽어들여서 이를 `string#trim`, `string#replace` 메서드로 수정하는 함수를 만들었습니다.

```js
function cssMinifierNormal(cssString) {
  return cssString
    .trim() // -> CSS 전후 공백 및 개행 삭제
    .replace(/[\r\n]/g, '') // -> 개행 삭제
    .replace(/\s*,\s*/g, ',')  // -> 해당 문자열 주위의 공백을 삭제
    .replace(/\s*;\s*/g, ';')
    .replace(/\s*:\s*/g, ':')
    .replace(/\s*{\s*/g, '{')
    .replace(/\s*}\s*/g, '}');
}
```

아직까진 너무 간단한 함수입니다. 만약에 이 함수가 300개 이상의 규칙을 가지고 있다고 한다면 이렇게 작성하는게 옳은 방법일까요? 300개 이상의 규칙을 가지고 있는 함수에 새로운 규칙을 추기해야한다면 어디에 어떻게 추가해야 문제가 없을까요? 아마 당장은 이런 문제에 부딪힐 일이 없겠지만 약간의 고민 끝에 다른 방식으로 구현해 보았습니다.

## 함수로 풀어보자
이번에는 서로 다른 함수를 조합하는 방식으로 또 다른 `cssMinifier` 함수를 만들어보겠습니다. 먼저 조금씩 각기 다른 공백 제거 함수를 분리해보겠습니다.

- `trim`: 전후 공백 및 개행 삭제
- `replace`: 특정 정규표현식에 해당하는 문자열 교체

어? 방금 우리가 위에서 사용한 메서드 아닌가요? 하지만 이 메서드를 함수로 표현한다면 약간 이야기가 달라집니다. 함수를 평소와는 약간 다르게 구현해보겠습니다.

```js
const trim = (str) => str.trim();

// function trim(str) {
//   return str.trim();
// }

const replace = (regExp, newSubStr) => (str) =>
  str.replace(regExp, newSubStr);


// function replace(regExp, newSubStr) {
//   return function replacer(str) {
//     return str.replace(regExp, newSubStr);
//   }
// }
```

화살표 함수(Arrow Function)는 보신적이 있어도 화살표가 이중으로 쓰여진 부분은 익숙지 않으신 분들이 계실지도 모르겠습니다. 그래서 아래에 일반 함수 표현식으로 작성하는 법도 따로 표기했습니다. `replace` 는 일종의 부분 함수입니다. 첫 번째로 인자를 입력해 두면 그 다음에는 `string#replace` 메서드를 적용할 문자열의 입력을 기다리는 함수가 리턴됩니다. (커링이라고 말씀드리려 했으나 엄밀히 따지면 커링은 여러 개의 인자를 받는 함수를 각각 한개씩 받을 수 있도록 만들어주는 기법이라고 이해하고 있어서 부분 함수라고 표현합니다)

```js
// 콤마 주변의 공백을 제거하는 함수 할당
const removeSpaceAroundComma = replace(/\s*,\s*/g, ',');

removeSpaceAroundComma('One , Two , Three , Four')
// => 'One,Two,Three,Four'
```

위의 `replace` 함수를 이런 식으로 활용할 수 있습니다. 조금만 손을 보면 어떤 문자 주변의 공백이든 손쉽게 제거해주는 함수를 만들 수 있겠네요. 

```js
const removeSpaceAroundChar = (char) => replace(new RegExp(`\\s*${char}\\s*`, 'g'), char);

const removeSpaceAroundSemi = removeSpaceAroundChar(';');
removeSpaceAroundSemi('; undefined is not a function ; ');
// => ';undefined is not a function;'
```

아까 작성한 메서드 체인처럼 원하는 모든 문자열 주변의 공백을 제거하는 함수를 준비해보겠습니다. `Array#map`  함수를 쓰고자 하지만 이번에는 `map` 함수조차 직접 만들어봤습니다.

```js
const map = (iteratee) => (list) => list.map(iteratee);

// function map(iteratee) {
//   return function mapped(list) {
//     return list.map(iteratee);
//   }
// }
```

사실 이번 글에서는 새롭게 작성한 `map` 함수를 별로 사용할 일이 없을지 모르지만, 인자를 나중에 받는 방식으로 구현하면 함수끼리 조합이 용이해지는 이점이 있기 때문에 시험삼아 만들어봤습니다.

```js
const shrinkers = map(removeSpaceAroundChar)([',', ';', ':', '{', '}']);
```

이렇게 특정 문자열 주변의 공백을 제거해주는 함수의 배열을 만들었습니다. 그러면 이제 익숙한 `Array#forEach` 함수나 `Array#reduce` 로 문자열을 수정하면 되겠지요. 이렇게요.

```js
function shrinkCss(cssString) {
  return shrinkers.reduce((str, shrinker) => shrinker(cssString), cssString);
}
```

오늘의 목표는 여기서 끝내는게 아닙니다. 함수를 만드는 것 까지 해봤으니 만든 함수를 **조합**해서 문제를 한번에 해결해보겠습니다.

```js
const pipe = (...fns) => (value) => fns.reduce((acc, fn) => fn(acc), value);

pipe(
  x => x + 10,
  x => x + 20,
  x => x * 100,
)(0);
// => 3000
```

보시는대로 `pipe` 함수는 인자로 받은 함수를 모아놨다가 적용할 값을 받아서 왼쪽에서 오른쪽으로(위에서 아래로) 순차적으로 연산합니다. 보통 반대로 `compose` 함수를 쓰는 경우도 있는데, 저는 가독성 측면에서 아직은 `pipe`  를 선호합니다.

그럼 여태 만든 함수를 저 파이프라인에 쌓아두고 CSS 문자열을 넣기만 하면 우리가 원하는 문자열이 나오겠군요? 한번 최종 결과물을 만들어 보겠습니다.

```js
const fs = require('fs');

fs.readFile('./page-setup.css', { encoding: 'utf-8' }, (err, data) => {
  console.log(cssMinifier(data));
});

function cssMinifier(cssString) {
  const removeSpaceAroundChar = char => replace(new RegExp(`\\s*${char}\\s*`, 'g'), char);
  const removeNewLine = replace(/[\r\n]/g, '');
  const shrinkers = map(removeSpaceAroundChar)([',', ';', ':', '{', '}']);

  return pipe(trim, removeNewLine, ...shrinkers)(cssString);
}
```

구문 자체는 약간 복잡해졌을지 몰라도 코드 줄 수는 확연히 줄었으며 만약에 규칙을 추가해야 할 때는 어느 부분에 무엇을 추가해야하는지가 조금 더 간편해지고 명확해졌습니다. 각자 역할을 나타내는 이름을 가진 함수니까요. 지금은 `shrinkers` 오른편에 있는 배열에 원하는 글자만 추가해주면 새로운 공백 제거 규칙이 생성됩니다.

`shrinkers` 는 함수의 배열인지라 `pipe` 함수에 넣을 때는 전개 연산자(Spread Operator)로 풀어헤쳐서 인자로 적용하였습니다. 아마 `pipe` 함수를 고도화하면 배열로 된 인자에도 대응할 수 있겠지요. 이번 시간에는 작게나마 제가 이해하고 있는 부분만 말씀드렸습니다.

## 이렇게도 해 보고, 저렇게도 해 보고
저도 요즘에야 이렇게 함수를 적극적으로 활용하여 주어진 문제를 풀어나가는 법을 연습하고 있습니다. 머리로 아무리 알고만 있어도 실제로 써먹지 않는다면 사용 가능한 지식이 아니겠지요. 위에 작성한 `replace`, `map`, `pipe` 함수는 원래대로라면 훨씬 고려해야 할 요소들이 많을지도 모릅니다. 제대로 된 인자가 들어왔는지, 더 재사용 가능한 방법이 있는지 등등... 저는 일단 실무에서 [Ramda.js](http://ramdajs.com) 를 활용하고 있습니다. 위에 작성한 함수 모두 `R.replace`, `R.map`, `R.pipe` 로 대체 가능합니다.

가능한 부분에 적극적으로 함수를 활용한 프로그래밍을 하자니 아직 모르는 점이 많습니다.

- 비동기 작업(Promise 등)을 일으키는 함수를 다른 함수와 조합하려면 어떻게 해야할까?
- 아무 생각없이 작성하는 클래스 상속도 함수의 조합만으로 해결 할 수 있어보이는데, 어떻게 해야할까?
- 함수만으로 코드를 작성하자니 어색하다. 뭔가 Class 같이 공통된 역할을 하는 함수를 모으는 일도 해야할까? 한다면 어떻게 해야할까?
- 재사용 가능한 함수를 어떻게 만들 수 있을까? 이 함수를 조합하는 방법은 더 다양할 것 같은데 어떤 게 있을까?

이미 제가 했던 고민을 거쳐온 분들이라면 조금이라도 조언을 부탁드리고 싶고, 위의 문제를 해결하는 방식이 생소한 분들이라면 한번 기존에 작성했던/앞으로 작성하실 코드에 저처럼 다양한 시도를 해 보시길 권하고 싶습니다. 반드시 함수형 프로그래밍이라는 개념을 익힐 필요는 없습니다. 기존의 틀을 벗어나 새로운 시각을 받아들이고 적용하고자 할 때, 더 좋은 프로그램을 만들 수 있는 가능성이 열린다고 생각합니다.

## 참고 자료
- [Ramda Documentation](http://ramdajs.com)
- [merong님의 함수형 자바스크립트 프로그래밍 강좌](http://merong.city)
- [Frisby 교수님의 함수형 적절한 함수형 프로그래밍 가이드 · GitBook](https://www.gitbook.com/book/mostly-adequate/mostly-adequate-guide)
- [Professor Frisby Introduces Composable Functional JavaScript from @drboolean on @eggheadio](https://egghead.io/courses/professor-frisby-introduces-composable-functional-javascript)
- [함수형 자바스크립트 - 모던 웹 개발에 충실한 실전 함수형 프로그래밍 안내서](http://aladin.kr/p/rUEvd)
