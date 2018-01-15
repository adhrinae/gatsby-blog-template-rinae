---
path: "/posts/typestyle-basic"
date: "2018-01-16"
title: "TypeStyle 사용하기"
category: "TypeStyle"
tags:
  - TypeScript
  - React
  - CSS
---

다음 프로젝트에서 본격적으로 타입스크립트를 사용한 리액트 애플리케이션을 도입하고자 하는데, CSS를 입히기 위한 도구로 [TypeStyle](https://typestyle.github.io)을 활용하는 방안을 검토중이다.

그래서 [egghead의 강좌](https://egghead.io/courses/maintainable-css-using-typestyle)를 가볍게 따라가며 내용을 정리해보았다. 이 정도면 충분히 도입할 만한 가치가 있어 보인다.

적어도 스타일 속성 이름으로 오타가 날 일은 없어 보이며 JS를 적극적으로 활용하여 동적인 스타일을 입힐 수 있으리라 기대한다.

참고로 아래의 예제 코드는 모두 리액트 애플리케이션을 개발한다는 전제하에 소개하고 있다. 하지만 TypeStyle 자체는 어느 환경에서나 사용 가능하다.

## 기본 사용법

```typescript
import { style } from 'typestyle';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

const className = style({
  color: 'red',
  position: 'relative' 
});

ReactDOM.render(
  <div className={className}>
    Hello TypeStyle!
  </div>,
  document.getElementById('root')
);
```

`style` 함수로 생성된 내용이 스타일이 적용된 임의의 클래스 이름을 만들게 되고 DOM은 바로 클래스 이름을 사용하면 되도록 구성되어 있다.

이 과정에서 객체 형식으로 되어있는 key-value 값은 이미 라이브러리에 CSS 스펙에 맞게 정의되어 있기 때문에 오타가 날 시 컴파일러가 친절하게 에러를 잡아준다.

## 스타일 믹스인

```typescript
// 위 코드와 동일한 DOM 랜더링
function fontSize(value: number | string) {
  const valueStr = typeof value === 'string'
    ? value
    : value + 'px';

  return {
    fontSize: valueStr
  };
}

const fontColor = { color: 'red' };

const className = style(
  fontSize('3em'),
  fontColor
);
// ...
```

위의 코드 처럼 `style` 함수는 객체를 믹스인 할 수 있다. 프로퍼티가 맞는 순수 객체가 들어가면 아무 없이 작동하기 때문에 위의 `fontSize` 함수처럼 상황에 맞게 적절한 객체를 리턴하는 함수를 만들어서 다양한 상황에 맞게 사용할 수 있다.

## 미디어 쿼리

`media` 함수로 간단히 미디어 쿼리를 생성할 수 있다. 생성된 쿼리를 `style` 함수 안에 넣으면 자동으로 Nested 쿼리 형식으로 생성된다. 수동으로 Nested 쿼리를 입력하고자 할 때는 `style` 함수 안에 넣는 객체에 `$nest` 속성을 사용하면 된다.

```typescript
// ...
import { style, media } from 'typestyle';

const className = style(
  { 
    color: 'red',
    transition: 'font-size .2s'
  },
  media({ minWidth: 500, maxWidth: 700 }, { fontSize: '30px' }),
  media({ minWidth: 701 }, { fontSize: '50px' })
);
// ...
```

## 수도 클래스(pseudo class) 작성

Sass, Less와 유사한 형태로 계층 화된 쿼리를 작성할 수 있다. 위에서 언급한 `$nest` 속성을 선택하면 해당 클래스의 계층 쿼리를 작성할 수 있다.

```typescript
const className = style(
  { 
    color: 'red',
    transition: 'font-size .2s',
    $nest: {
      '&:focus': { // .class:focus
        fontSize: '30px'
      },
      '&&:hover': { // .class.class:focus
        fontSize: '50px'
      }
    }
  }
);
// ...
```

## CSS 클래스 조합하기

클래스를 조합하는건 `style` 함수로 만들어진 클래스들을 분기에 따라 추가하고 제거하도록 만들면 된다. 다만 이 과정에서 있는 경우와 없는 경우에 따라 문자열을 조합하는게 번거로울 수 있는데, `classes` 함수가 귀찮은 부분을 쉽게 해결하도록 도와준다.

```typescript
const baseClassName = style(
  { color: '#333' }
);

const errorClassName = style(
  { backgroundColor: 'red' }
);

interface AppProps {
  className?: string;
  hasError?: boolean;
}

const App = ({ className, hasError }: AppProps) => (
  <div className={
    classes(
      baseClassName,
      className,
      hasError && errorClassName
    )
  }>
    Hello world
  </div>
);

// ...
```

## Keyframes 함수로 애니메이션 만들기

```typescript
import { style, keyframes } from 'typestyle';

const colorAnimationName = keyframes({
  '0%': { color: 'black' },
  '50%': { color: 'blue' }
});

const className = style(
  {
    fontSize: '20px',
    animationName: colorAnimationName,
    animationDuration: '1s',
    animationIterationCount: 'infinite'
  }
);
// ...
```

`colorAnimationName` 을 일일이 변수로 분리 할 필요는 없다. 한번만 사용할거면 `animationName` 속성에 바로 `keyframes` 를 사용한 객체를 리턴하도록 만들면 된다.

## 일반 CSS를 사용하기

`cssRaw` 함수를 사용하고 그 안에 일반 CSS를 문자열로 집어넣으면 그대로 글로벌 스타일로 변환된다. 그리고 그 파일안에 있는 컴포넌트에 전부 영향을 준다. 특정 이름을 가진 클래스를 만들고, 간단하게 기존 스타일을 마이그레이션 하거나 NormalizeCSS 등을 바로 가져올 때도 유용하게 사용할 수 있다.

```typescript
import { style, cssRaw } from 'typestyle';

cssRaw(`
.red {
  color: red;
}
`);

cssRaw(`
.bold {
  font-weight: bold;
}
`);

const className = style(
  { fontSize: '30px' }
);

ReactDOM.render(
  <div className={className + ' red bold'}> // red, bold 클래스 사용 가능
    Hello world
  </div>,
  document.getElementById('root')
);
```

## 구형 브라우저용 속성 사용하기

`rgba` 같은 구형 브라우저에서 지원되지 않는 속성을 사용하면서 구형 브라우저를 지원하는 용도로 `rgb` 를 사용하는 경우, CSS 파일에서는 보통 같은 속성을 두번 작성해서 문제를 해결할 수 있다. 하지만 TypeStyle은 객체를 파싱하기 때문에 같은 속성 값을 두번 선언할 수는 없다.

하지만 배열을 사용하면 한 속성에 배열의 요소를 순차적으로 따라 스타일을 적용하도록 만들 수 있으며, 비슷한 원리를 vendor prefix에도 적용할 수 있다.

```typescript
import { style, types } from 'typestyle';

const scroll: types.NestedCSSProperties = {
  '-webkit-overflow-scrolling': 'touch',
  overflow: 'auto'
};

const className = style(
  scroll,
  {
    fontSize: '30px',
    backgroundColor: [
      'rgb(200, 54, 54)', // 구형 브라우저용
      'rgba(200, 54, 54, 0.5)' // 요즘 브라우저용
    ]
  }
);
// ...
```

## 정적 페이지 만들어보기

`getStyles` 함수는 현재 작성된 파일 안에 정의된 TypeStyle 스타일을 문자열로 변환하는 기능을 한다. 이를 이용해서 간단한 HTML 페이지를 만들 수 있다.

```typescript
// app.tsx
import * as fs from 'fs';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { style, getStyles } from 'typestyle';

const className = style({
  color: 'red',
  fontSize: '30px'
});

const App = () => (
  <div className={className}>
    Hello World
  </div>
);

const html = ReactDOMServer.renderToStaticMarkup(<App />);
const css = getStyles();

const renderPage = ({ html, css }: { html: string; css: string; }) => `
<html>
  <head>
    <style>${css}</style>
  </head>
  <body>
    ${html}
  </body>
</html>
`;

const renderedPage = renderPage({ html, css });
fs.writeFileSync(__dirname + '/index.html', renderedPage);
```

```html
<!-- 결과물 -->
<html>
  <head>
    <style>.fyuerk{color:red;font-size:30px}</style>
  </head>
  <body>
    <div class="fyuerk">Hello World</div>
  </body>
</html>
```

위 방식을 응용하여 서버 사이드 랜더링에서도 스타일을 적용할 수 있다. [영상 참고.](https://egghead.io/lessons/css-render-html-css-server-side-using-typestyle)