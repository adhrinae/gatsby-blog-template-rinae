---
path: "/posts/advanced-react-component-patterns-summary"
date: "2017-12-10"
title: "Advanced React Component Patterns 내용 정리"
category: "React"
tags:
  - React
---

- [Advanced React Component Patterns 강좌](https://egghead.io/courses/advanced-react-component-patterns)
- [강좌에 수록된 코드](https://github.com/kentcdodds/advanced-react-patterns)

[Kent C. Dodds](https://kentcdodds.com/)의 강좌가 egghead에 한정된 기간동안 무료로 올라왔다. 때문에 다른 강의들을 제쳐두고 일단 이 강의부터 끝내기로 했다. HOC, Render props같은 고급 리액트 개발 방법론에 관심은 있었으나 대강 글만 봐서는 이해가 되지 않았기 때문이다.

강의에 들어가는 코드는 복잡한 개발환경을 설정하는데 시간을 낭비하지 않기 위해 html페이지 하나로 모든 작업을 다 할 수 있도록 만들어져있다. React, ReactDOM, Babel을 unpkg로 불러온 뒤 수업을 따라가면 된다. 처음에는 강의 코드를 제공하지 않는 줄 알고 토글 버튼의 스타일은 [구글링해서 넣었었다](https://codepen.io/designcouch/pen/qdBErE).

이후에 작성된 코드는 강의에서 나온 코드 중 핵심 부분을 발췌해서 넣어둔 것이며, 맥락을 파악하기 위해서 강의 자료를 보거나 코드 저장소에 있는 완결된 코드를 살펴보기 바란다.

---

## Compound Components

만약 `Toggle` 컴포넌트를 랜더할 때 현재 켜졌는지 꺼졌는지 텍스트를 표시하면서도 그 위치를 때에 따라 조절하고자 한다면 단순히 `render` 메서드 안에 삼항연산자 등을 쓸 수 있을 것이다. 하지만 이 경우 텍스트를 표시하지 않으면서 컴포넌트를 재사용하기 어려워진다. 이 때 `React.Children.map` 함수를 이용해서 자손 컴포넌트를 생성함과 동시에 컴포넌트의 state, prop을 전달할 수 있고, 자손 컴포넌트는 이를 받아 상태에 따라 랜더할 수 있다.

```jsx
function ToggleOn({ on, children }) {
  return on ? children : null;
}

function ToggleOff({ on, children }) {
  return on ? null : children;
}

function ToggleButton({ on, toggle, ...props }) {
  return <Switch on={on} onClick={toggle} {...props} />;
}

class Toggle extends React.Component {
  static On = ToggleOn;
  static Off = ToggleOff;
  static Button = ToggleButton;
  static defaultProps = { onToggle: () => {} };
  state = { on: false };
  
  toggle = () => 
    this.setState(
      ({ on }) => ({ on: !on }),
      () => {
        this.props.onToggle(this.state.on);
      }
    );
  
  render() {
    const children = React.Children.map(
      this.props.children,
      child =>
        React.cloneElement(child, {
          on: this.state.on,
          toggle: this.toggle,
        })
    );

    return <div>{children}</div>;
  }
}

function App() {
  return (
    <Toggle onToggle={on => console.log('toggle', on)}>
      <Toggle.On>The Button is on</Toggle.On>
      <Toggle.Button />
      <Toggle.Off>The Button is off</Toggle.Off>
    </Toggle>
  );
}
```

## Context로 확장성을 더하기

[Context란?](https://reactjs.org/docs/context.html#how-to-use-context)

위의 코드에는 약간의 문제가 있는데, children은 바로 하위 컴포넌트만 처리하기 때문에 계층을 조금 더 복잡하게 만드는 순간 전혀 작동하지 않는다. 예를 들자면

```jsx
function App() {
  return (
    <Toggle onToggle={on => console.log('toggle', on)}>
      <div>
        <Toggle.On>The Button is on</Toggle.On>
      </div>
      <Toggle.Button />
      <Toggle.Off>The Button is off</Toggle.Off>
    </Toggle>
  );
}
```

이렇게 `div`로 감싸진 `child`는 작동하지 않는다. 이 때 Context 속성을 사용하는데, 예전에 [Dan의 Redux 직강](https://egghead.io/courses/getting-started-with-redux)에서 리덕스를 직접 구현하는 방법을 보여줄 때 사용했던 요소이다. 사실 Context API는 실제로 사용자가 이를 직접 쓰기보단 라이브러리 등에서 유용하게 쓰기 위한 목적으로 만들어진 것으로 보인다.

혹시나 Context가 중복되지 않도록 고유의 context key를 선언한 다음, 부모 컴포넌트에는 `getChildContext` 메서드를 선언해서 key에 맞는 값을 돌려주는 객체를 리턴하도록 만든다. 그리고 `contextTypes`라는 PropTypes 검사를 항상 마련해두어야 하는 것으로 보인다.

```jsx
function ToggleOn({ children }, context) {
  const { on } = context[TOGGLE_CONTEXT];
  return on ? children : null;
}
ToggleOn.contextTypes = {
  [TOGGLE_CONTEXT]: PropTypes.object.isRequired
}
// ...
// 부모 컴포넌트의 메서드 정의
getChildContext() {
  return {
    [TOGGLE_CONTEXT]: {
      on: this.state.on,
      toggle: this.toggle
    }
  }
}
// ...
```

이러면 얼마나 깊이 해당 컴포넌트가 묻혀있는지 상관없이 자손 컴포넌트이기만 하고, 알맞은 context key를 가져올 수 있다면 원하는 상태를 추출할 수 있다.

---

## Higher Order Components

### HOC 만들기

이번에는 더 작은 규모의 `MyToggle` 이라는 버튼으로만 이루어진 컴포넌트를 만들면서 시작한다. 버튼 자체는 `on` 속성에 따라 다른 텍스트를 보여주는 정도인데, 이 버튼이 손쉽게 Context의 속성을 받기 위해 새로운 함수를 만든다. 

```jsx
// Higher order component
function withToggle(Component) {
  function Wrapper(props, context) {
    const toggleContext = context[TOGGLE_CONTEXT];
    return <Component {...toggleContext} {...props} />;
  }
  Wrapper.contextTypes = {
    [TOGGLE_CONTEXT]: PropTypes.object.isRequired
  };

  return Wrapper;
}

const MyToggle = withToggle(({ on, toggle }) => (
  <button onClick={toggle}>
    {on ? 'on' : 'off'}
  </button>
));
```

`withToggle` 함수가 컴포넌트를 인자로 받은 뒤 이를 `toggleContext` 속성이 추가된 컴포넌트로 돌려주고 있다. 결과적으로 toggleContext가 필요한 컴포넌트는 모두 `withToggle` 함수로 감싸면 되도록 만들었다.

### 네임스페이스 충돌을 방지하기

하지만 나중에 이 HOC를 이용하는 사용자가 우리가 미리 정의해놓은 속성과 같은 이름의 속성을 사용하는 경우 충돌이 날 수 있다. 지금의 경우는 `on`  속성이 문제가 될 수 있을 것이다. 따라서 HOC를 위한 네임스페이스를 별도로 지정해주어 문제를 해결한다. 다만 이 때는 객체 분해 시 별도의 이름을 지정해주어야하는 번거로움이 있다.

```jsx
// Higher order component with their own namespace
function withToggle(Component) {
  function Wrapper(props, context) {
    const toggleContext = context[TOGGLE_CONTEXT];
    return (
    <Component
      toggle={toggleContext}
      {...props}
    />;
    );
  }
  Wrapper.contextTypes = {
    [TOGGLE_CONTEXT]: PropTypes.object.isRequired
  };

  return Wrapper;
}

// extract toggle context from HOC
const MyToggle = withToggle(({ toggle: { on, toggle } }) => (
  <button onClick={toggle}>
    {on ? 'on' : 'off'}
  </button>
));
```

### 개발자 도구의 사용성 높이기

HOC를 쓰게 되는 경우 브라우저의 리액트 개발자 도구로 디버깅을 할 때 예기치 못한 문제가 발생하는데, 개발자 도구에 표시되는 컴포넌트 이름은 함수 이름 기반이기 때문에 `Wrapper` 라는 이름으로 감싸는 컴포넌트가 표시되고, 감싸지는 컴포넌트는 익명함수를 전달했기 때문에 `Unknown` 이라는 이름으로 표시된다. 이러면 아주 복잡한 컴포넌트 트리에서 원하는 이름의 컴포넌트를 찾고자 검색을 이용하고자 해도 원하는 결과를 찾을 수 없다.

그러면 두 가지 문제를 해결해야 하는데 먼저 `withToggle(something)` 이라고 HOC의 명확한 이름을 지정해주는 것과, 감싸지는 컴포넌트에도 명확한 이름을 지정해주는 것이다.

첫 번째 문제는 HOC에 `displayName` 속성을 지정해주어 해결할 수 있다. 두 번째 문제는 익명함수들을 명확한 이름을 가진 함수로 분리하고, `withToggle` 로 따로 감싸서 해결하면 된다.

```jsx
// displayName 속성 추가
function withToggle(Component) {
  function Wrapper(props, context) {
    const toggleContext = context[TOGGLE_CONTEXT];
    return <Component toggle={toggleContext} {...props} />;
  }
  Wrapper.contextTypes = {
    [TOGGLE_CONTEXT]: PropTypes.object.isRequired
  };
  // displayName이 지정되지 않은 컴포넌트는 각자 함수의 이름을 name 속성으로 가진다
  Wrapper.displayName = `withToggle(${Component.displayName || Component.name})`;

  return Wrapper;
}

const MyToggle = ({ toggle: { on, toggle } }) => (
  <button onClick={toggle}>
    {on ? 'on' : 'off'}
  </button>
);

const MyToggleWrapper = withToggle(MyToggle);
```

### ref 속성 제어

만약 토글 상태에 따라 버튼의 포커스를 조절하고 싶을 때는 `ref` 를 이용해서 컴포넌트를 제어할 수 있을 것이다. 하지만 `ref` 속성은 SFC(Stateless Functional Component)에는 사용할 수 없다. 게다가 클래스 컴포넌트를 만들었다 하더라도 HOC로 감싸게 되면 `Wrapper` 함수가 SFC를 리턴하기 때문에 제대로 써 먹을 수가 없다. 

간단한 해법은 `ref` 를 HOC로 전달하는건데, 유의할 점은 `ref` 는 그 이름 바로 전달할 수가 없다. 따라서 `innerRef` 같은 별도의 이름을 지정해서 전달하면 된다.

```jsx
// handle innerRef
function withToggle(Component) {
  function Wrapper({ innerRef, ...props }, context) {
    const toggleContext = context[TOGGLE_CONTEXT];
    return (
      <Component
        {...props}
        ref={innerRef}
        toggle={toggleContext}
      />
    );
  }
  Wrapper.contextTypes = {
    [TOGGLE_CONTEXT]: PropTypes.object.isRequired
  };
  Wrapper.displayName = `withToggle(${Component.displayName || Component.name})`;

  return Wrapper;
}

class MyToggle extends React.Component {
  focus = () => this.button.focus();

  render() {
    const { toggle : { on, toggle } } = this.props;
    return (
      <button
        onClick={toggle}
        ref={button => (this.button = button)}
      >
        {on ? 'on' : 'off'}
      </button>
    );
  }
}

const MyToggleWrapper = withToggle(MyToggle);

// ...
class App extends React.Component {
  render () {
    return (
      <Toggle onToggle={on => on ? this.myToggle.focus() : null}>
        <div>
          <Toggle.On>The Button is on</Toggle.On>
          <Toggle.Off>The Button is off</Toggle.Off>
          <Toggle.Button />
          <hr />
          {/* inject ref */}
          <MyToggleWrapper
            innerRef={myToggle => (this.myToggle = myToggle)}
          />
        </div>
      </Toggle>
    );
  }
}
```

### 테스트를 용이하게 만들기

컴포넌트가 제대로 랜더링 되는지 테스트를 한다고 할 때도 문제가 생길 수 있다. 왜냐면 실질적으로 랜더링되는 컴포넌트는 **감싸진** 컴포넌트이기 때문이다. 이 때는 `Wrapper` 에 `WrappedComponent` 라는 속성을 지정해주고, 테스트 시 컴포넌트 랜더링을 할 대는 `HOC.WrappedComponent` 같은 방식으로 불러오면 된다.

```jsx
function withToggle(Component) {
  function Wrapper({ innerRef, ...props }, context) {
    const toggleContext = context[TOGGLE_CONTEXT];
    return (
      <Component
        {...props}
        ref={innerRef}
        toggle={toggleContext}
      />
    );
  }
  Wrapper.contextTypes = {
    [TOGGLE_CONTEXT]: PropTypes.object.isRequired
  };
  Wrapper.displayName = `withToggle(${Component.displayName || Component.name})`;
  // Set wrapped component so that can be easily tested.
  Wrapper.WrappedComponnet = Component;

  return Wrapper;
}
```

### Static 속성과 함께 사용하기

마지막으로 누군가 HOC를 이용해서 또 다른 Compound component를 만들었을 때 그 컴포넌트는 제대로 표현되지 않을 것이다. HOC 안에서 일일이 Static 속성을 지정해주어야 할 텐데 현실적으로 불가능하다. 그래서 React에서 기본적으로 사용하고 있는 속성을 제외한 이름의 속성을 끌어올려주는 라이브러리(hoist-non-react-statics)를 사용한다.

```jsx
function withToggle(Component) {
  function Wrapper({ innerRef, ...props }, context) {
    const toggleContext = context[TOGGLE_CONTEXT];
    return (
      <Component
        {...props}
        ref={innerRef}
        toggle={toggleContext}
      />
    );
  }
  Wrapper.contextTypes = {
    [TOGGLE_CONTEXT]: PropTypes.object.isRequired
  };
  Wrapper.displayName = `withToggle(${Component.displayName || Component.name})`;
  Wrapper.WrappedComponnet = Component;

  // use host-non-react-static library
  return hoistNonReactStatics(Wrapper, Component);
}

class MyToggle extends React.Component {
  static ToggleMessage = withToggle(
    ({ toggle: { on }}) =>
      on
        ? 'Warning: The button is toggled on'
        : null
  );

  render() {
    const { toggle: { on, toggle } } = this.props;
    return (
      <button onClick={toggle}>
        {on ? 'on' : 'off'}
      </button>
    );
  }
}
```

---

## Render props

앞서 해결한 많은 양의 HOC 문제를 Render props를 사용하면 별 문제 없이 해결할 수 있다. 물론 만능은 아니지만, 확연한 차이점은 앞에서 해결한 Compound 컴포넌트의 Context 문제, Wrapper의 속성 지정 같은 문제들로부터 자유로워진다는 점이다.

- HOC
  - 필요한 컴포넌트를 일일이 다 HOC로 감싸주어야 한다
  - Static 속성의 문제
  - HOC가 중첩될 경우 문제가 생길 때 디버깅이 어렵다
  - 중간에 추가적인 속성이 들어갈 경우 일일이 HOC의 구현을 살펴보아야 한다
  - Typescript, Flow 등의 도움을 받기 힘들다
  - 컴포넌트의 조합이 `render` 메서드 전에 발생한다 -> 때문에 동적인 상태를 활용할 때 Context 같은 부가적인 작업이 필요하다
- Render Props
  - 위에 제기된 문제로부터 자유롭다
  - 컴포넌트의 조합이 일반적인 `render` 메서드 시점에서 발생하기 때문에 동적인 조합을 만들어내기 쉽다

### Prop Collections 만들어서 재사용성 높이기

Render props 안의 여러 컴포넌트에게 같은 속성을 주입해주고자 할 때는 감싸는 컴포넌트에서 컬렉션을 만들어서 전달해주면 된다.

```jsx
class Toggle extends React.Component {
  state = { on: false };

  toggle = () => 
    this.setState(
      ({ on }) => ({ on: !on }),
      () => {
        this.props.onToggle(this.state.on);
      }
    );

  render() {
    return this.props.render({
      on: this.state.on,
      toggle: this.toggle,
      // 여러 하위 컴포넌트에 공통되는 속성을 한꺼번에 넘겨주기 위해 사용
      togglerProps: {
        'aria-expanded': this.state.on,
        onClick: this.toggle
      }
    })
  }
}

function App() {
  return (
    <Toggle
      onToggle={on => console.log('toggle', on)}
      render={({ on, toggle, togglerProps }) => (
        <div>
          <Switch on={on} {...togglerProps} />
          <hr />
          <button {...togglerProps}>
            {on ? 'on' : 'off'}
          </button>
        </div>
      )}
    />
  )
}
```

### Prop Getters 만들기

`togglerProps` 에 이미 정의된 속성(함수)에 별도의 추가 동작과 속성을 얹으려면 별도의 함수를 만들어야 한다. Props Getter 패턴으로 불리는 것 같다. 먼저 `getTogglerProps` 함수를 만들어보고 거기에 기존 toggle 동작 이전에 alert을 띄우도록 만들어본다.

```jsx
// ... Toggle Class
  getTogglerProps = ({ onClick, ...props } = {}) => ({
    'aria-expanded': this.state.on,
    onClick: (...args) => {
      onClick(...args);
      this.toggle(...args);
    },
    ...props
  });

  render() {
    return this.props.render({
      on: this.state.on,
      toggle: this.toggle,
      getTogglerProps: this.getTogglerProps
    })
  }
}

function App() {
  return (
    <Toggle
      onToggle={on => console.log('toggle', on)}
      render={({ on, toggle, getTogglerProps }) => (
        <div>
          {/* 이 Switch 버튼은 클릭 시 동작하지 않는다. onClick이 정의되어있지 않으니까. */}
          <Switch on={on} {...getTogglerProps()} />
          <hr />
          <button {...getTogglerProps({
            onClick: () => alert('HI')
          })}>
            {on ? 'on' : 'off'}
          </button>
        </div>
      )}
    />
  )
}
```

`Switch` 컴포넌트는 `onClick` 에 새 함수를 조합할 필요가 없었기 때문에 아무 값도 넣지 않았는데, 문제가 발생했다. `getTogglerProps`  함수가 실행시킬 `onClick` 이 없어서 에러가 나는 것이다. 간단히 문제를 해결하려면 `onClick && onClick()` 같은 방식으로 해결할 수 있지만 매번 이런 식의 코드를 넣어줄 수는 없다. 그래서 별도로  `compose` 함수를 만들어 적용하면 된다.

```jsx
const compose = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args));

// ...
getTogglerProps = ({ onClick, ...props } = {}) => {
  return {
    // ...
    onClick: compose(onClick, this.toggle),
  };
}
```

### 초기 상태 설정하기

이번에는 토글 하고 나서 리셋 버튼을 만들고자 한다. 리셋을 하려면 기본이 되는 상태를 가지고 있어야 할텐데 컴포넌트 내부에 기본 상태를 지정해두는 것 보다 속성으로 내려받도록 해야 더 유연한 구현을 할 수 있다. 또한 그 속성을 `initialState` 같은 맴버 변수로 보관하고 있으면 컴포넌트에 메서드를 정의할 때 ‘초기 상태로 되돌릴 필요가 있다면’ 언제든지 이 변수를 가져다 쓰면 된다.

```jsx
class Toggle extends React.Component {
  static defaultProps = {
    defaultOn: false,
    onToggle: () => {},
    onReset: () => {}
  };

  initialState = { on: this.props.defaultOn };
  state = this.initialState;

  reset = () => {
    this.setState(
      this.initialState,
      () => this.props.onReset(this.state.on)
    );
  };
// ...
```

### Controlled Props 설정하기

특정 상태를 컴포넌트 외부에서 다룰지 내부에서 다룰지 조절할 수도 있다. 외부에서 다루어질 경우 Controlled props라고 한다.

같은 컴포넌트를 재사용하는데 어떤 컴포넌트는 사용자가 4번 클릭하면 동작하지 않도록 막고, 어떤 컴포넌트는 경고만 띄운 채로 계속 동작할 수 있도록  만든다고 가정해보자. 그러면 부모 컴포넌트에 별도의 상태를 정의한 뒤 자손 컴포넌트에 상태를 주입할 경우에는 동작을 제어하고, 그렇지 않은 경우 자손 컴포넌트의 자체 상태를 이용하게 만들 수 있다.

```jsx
// Toogle 컴포넌트
// ...
  isOnControlled = () =>
    this.props.on !== undefined;

  // 부모 컴포넌트로부터 상태를 받았는지 아닌지에 따라 다른 행동 정의
  reset = () => {
    if (this.isOnControlled()) {
      this.props.onReset(!this.props.on);
    } else {
      this.setState(
        this.initialState,
        () => this.props.onReset(this.state.on)
      );
    }
  };
// ...

// App 컴포넌트
class App extends React.Component {
  initialState = { timesClicked: 0, on: false };
  state = this.initialState;

  handleToggle = () => {
    this.setState(({ timesClicked, on }) => ({
      timesClicked: timesClicked + 1,
      on: timesClicked >= 4 ? false : !on
    }));
  };

  handleReset = () => {
    this.setState(this.initialState);
  };

  render() {
    const { timesClicked, on } = this.state;
    return (
      <Toggle
        {/* on이 있으면 부모가 통제, 없으면 자손이 통제 */}
        on={on} 
        onToggle={this.handleToggle}
        onReset={this.handleReset}
// ...
```

### Provider 컴포넌트 만들기

애플리케이션의 규모가 더 커져서 컴포넌트는 여러개로 나누었는데, `toggle` 속성을 일일이 주입해주는 구현을 해 버렸다고 할 때, 리팩터링을 하기 위해서 다시 한번 Context가 등장한다. 이번에는 HOC로 감싸는게 아니라 Render props를 이용해서 Provider를 만든다.

```jsx
// ...
// Provider 정의
class ToggleProvider extends React.Component {
  static contextName = '__toggle__'
  static Renderer = class extends React.Component {
    static childContextTypes = {
      [ToggleProvider.contextName]:
        PropTypes.object.isRequired,
    }
    getChildContext() {
      return {
        [ToggleProvider.contextName]: this.props
          .toggle,
      }
    }
    render() {
      return this.props.children
    }
  }
  render() {
    const {
      children,
      ...remainingProps
    } = this.props
    return (
      <Toggle
        {...remainingProps}
        render={toggle => (
          <ToggleProvider.Renderer
            toggle={toggle}
            children={children}
          />
        )}
      />
    )
  }
}

// Toggle 속성과 연결  
function ConnectedToggle(props, context) {
  return props.render(
    context[ToggleProvider.contextName],
  )
}
ConnectedToggle.contextTypes = {
  [ToggleProvider.contextName]:
    PropTypes.object.isRequired,
}
// ...
// 컴포넌트와 연결하는 방법
function Title() {
  return (
    <div>
      <h1>
        <ConnectedToggle
          render={toggle =>
            `Who is ${toggle.on
              ? '🕶❓'
              : 'awesome?'}`}
        />
      </h1>
      <Subtitle />
    </div>
  )
}
```

실제 구현에서는 컴포넌트 최상단에서 `ToggleProvider` 로 감싸두었기 때문에 `ConnectedToggle` 컴포넌트를 사용할 시 자연스럽게 Context에 접근할 수 있다.

### 자손 컴포넌트의 리랜더링(Rerendering)과 shouldComponentUpdate

리액트의 퍼포먼스에서 제일 신경써야 할 점은 컴포넌트가 업데이트되면서 화면을 다시 그리는 일을 최소화하는 것이다. `shouldComponentUpdate` 라이프사이클 훅을 사용하는 방법이 가장 일반적이겠지만 Provider로 감싸진 컴포넌트에 사용하면 예기치 못한 결과를 초래할 수 있다. [react-broadcast](https://github.com/ReactTraining/react-broadcast) 라이브러리를 사용하여 채널을 설정하고, 값을 설정하면 새로 내려지는 값이 변화했는지 아닌지에 따라 랜더링을 제어해준다.

---

강좌 마지막에는 Redux와 Redner props를 함께 활용하는 방법 등이 있었지만 바로 이해가 되지 않아서 나중에 활용 가능할 때 업데이트 할 예정이다. 또한 Provider 패턴에 들어서면서도 내용이 조금 복잡해져서 잘못 정리된 정보를 전달할 수 있는 여지가 있으니 글 내용이 확실해보이지 않을 경우 강좌를 참고하기 바란다.