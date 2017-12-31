---
path: "/posts/mobx-basic-concepts"
date: "2017-12-31"
title: "MobX로 상태 관리하기"
category: "MobX"
tags:
  - Javascript
  - MobX
  - React
---

MobX를 리액트에 쓰기 위해 필요한 기본 구성은 `mobx`, `mobx-react` 패키지이다. 그리고 각각 `observable`, `observer` 데코레이터(이자 그냥 함수)를 가져다 쓸 수 있다.

## Observer

생성한 스토어가 `observable` 로 구성되어 있고, 컴포넌트가 `observer` 데코레이터로 감싸져 있다면 스토어를 사용할 조건은 충족된다. 그래서 다음의 코드로 간단한 카운터를 만들 수 있다.

```js
const appState = observable({
  count: 0
});
appState.increment = function() {
  this.count++;
};
appState.decrement = function() {
  this.count--;
};

@observer
class Counter extends Component {
  handleInc = () => {
    this.props.store.increment();
  }

  handleDec = () => {
    this.props.store.decrement();
  }

  render() {
    return (
      <div>
        Counter: {this.props.store.count} <br/>
        <button onClick={this.handleInc}> + </button>
        <button onClick={this.handleDec}> - </button>
      </div>
    );
  }
}
```

MobX의 리액트 개발자 도구는 크롬 같은 브라우저의 확장으로 설치하는 것이 아니라 일종의 리액트 컴포넌트로 되어있다. 따라서 프로젝트에 `mobx-react-devtools` 를 설치하고 `<Devtools />` 같은 컴포넌트를 컴포넌트 트리에 삽입하면 된다.
Observable 스토어를 다룰 때 DOM을 그리는 등의 동작은 Side Effects(부가 동작)으로 처리된다. 이 때 스토어의 상태를 효율적으로 다루기 위해 `computed` 속성을 쓰면 필요한 부분만 스토어의 변경을 감지하여 효과적인 컴포넌트 랜더링이 가능하다.

## Action

`@action` 데코레이터는 리듀서의 액션 디스패치와 같은 역할을 한다. 데코레이터와 함께 메서드를 작성하고, 이에 따라 Observable 값이 변경되도록 하면 MobX가 알아서 처리 해줄 것이다. Observable한 값을 직접 변경해주는 것도 일종의 액션이다. 상태 변경의 방법을 밖으로 드러내어 실수를 미연에 방지하는 것이 액션의 역할 뿐 아니라, 상태 변경을 하나의 단위로 묶어 트랜잭션을 수행하는 역할도 가지고 있다. 또한 비동기 작업 수행을 효과적으로 제어할 때도 사용된다. 예를 들어 작업 시행 -> 작업 종료가 명료하게 동기화되어야 할 때 액션을 사용하면 의도치 않은 동작을 방지할 수 있다.

`@action(name: string)` 같은 형식으로 이름을 넣어서 개발 도구에서 손쉽게 액션을 파악할 수 있다. 그리고 액션을 쓰지 않고 직접 상태를 변경하는 일을 막기 위해 `useStrict` 함수로 strict mode를 설정할 수 있다. 이 때는 액션 데코레이터 없이는 상태 변경을 수행할 수 없다.


## Observable Data Structure

`observable` 함수로 배열, 객체, Map 등을 감싸서 활용할 수 있다. 이 세 가지는 MobX에서 가장 중요하게 여기는 자료구조이다. 여기서 객체나 배열에 들어갈 값은 기존 자바스크립트에서 쓰는 단순한 객체나 원시 타입의 값일 수도 있지만, 개발자가 MobX의 기능을 활용하여 만든 상태 모델의 인스턴스를 넣어서 조작할 수도 있다. 가령 위에서 이야기한 `computed`, `action` 등을 활용한 임의의 클래스를 만들고, 그 클래스의 인스턴스들을 배열에다 넣어서 다룰 수 있다는 이야기다.

`observable([])` 같은 명령어로 만들어진 배열은 유사 배열이기 때문에 실제 배열처럼 다루려면 `toJS` 같은 별도의 가공이 필요하다.


## 컴포넌트를 나누어 관리하기

Observable 상태를 `map` 함수로 순회하며 하위 컴포넌트를 생성할 때 고려해야 할 점이 있다. 아무 처리도 없이 `map` 함수로 생성한 하위 컴포넌트에서 `onClick` 등으로 상태를 바꾸면, 겉으로 보기에는 상태가 변한 부분만 다시 랜더링 되는 것으로 보이지만 실제로 모든 하위 컴포넌트가 다시 랜더링된다. 이런 구조가 누적되면 결과적으로 큰 자원 낭비를 초래하기 때문에 최적화헤야 한다.
가장 간단한 방법은 `map` 함수 안에서 생성되는 하위 컴포넌트가 `@observer` 임을 명시해주고, 상태 변화 액션도 `@action` 으로 관리해주면 된다. 최적화는 MobX가 알아서 해 준다.

```js
const App = observer(({ temperatures }) => (
  <ul>
    {temperatures.map(t =>
      <TView Key={t.id} temperature={t} />
    )}
    <DevTools />
  </ul>
));

@observer
class TView extends React.Component {
  render(){
    const t = this.props.temperature;
    return (
      <li onClick={this.onTempClick}>
        {t.temperature}
      </li>
    );
  }

  @action onTempClick = () => {
    this.props.temperature.inc();
  }
}
```

## Provider 컴포넌트 사용하기

`mobx-react` 는 `react-redux` 처럼 `Provider` 컴포넌트를 제공한다. 사실 MobX의 스토어는 한번 선언되어있으면 어디서 어떻게 가져다쓰던 `observer`, `observable` 선언만 제대로 되어있으면 동적으로 연결된다. 하지만 기존에 리덕스를 사용할 때 처럼 최상단 컴포넌트를 Provider 컴포넌트로 감싸기만 하면 `connect`, `mapStateToProps` 같은 함수를 사용하지 않아도 바로 자유자재로 사용할 수 있다. 단지 `@observer` 데코레이터 선언 시 어떤 스토어를 사용할지만 명시하면 된다.

```js
// 스토어 선언 및 Provider 감싸기
const temps = observable([])

ReactDOM.render(
  <Provider temperatures={temps}>
    <App />
  </Provider>,
  document.getElementById("app")
);

// App 컴포넌트
const App = observer(
  ["temperatures"],
  ({ temperatures }) => (
    <ul>
      <TemperatureInput />
      {temperatures.map(t =>
        <TView key={t.id} temperature={t} />
      )}
      <DevTools />
    </ul>
));

// temperatures를 사용하는 컴포넌트
// 위의 App 컴포넌트를 보면 알겠지만 따로 props 선언이 없었음에도 바로 사용 가능하다.
@observer(["temperatures"])
class TemperatureInput extends React.Component {
  @observable input = "";

  render() {
    return (
      <li>
        Destination
        <input onChange={this.onChange}
        value={this.input}
        />
        <button onClick={this.onSubmit}>Add</button>
      </li>
    );
  }
}
```

## 특정 상황에서 반응하는 액션 작성하기

작성해놓은 스토어를 사용할 때 특정 조건에 맞추어 원하는 동작이 발생하도록 훅을 걸거나(`when`), 모든 상태 변화마다 실행되는 함수를 지정할 수도 있다(`autorun`).

```js
// when의 사용 예
function isNice(t) {
  return t.temperatureCelsius > 25
}

when(
  () => temps.some(isNice),
  () => {
    const t = temps.find(isNice)
    alert("Book now! " + t.location)
  }
);

// autorun의 사용 예
const numbers = observable([1,2,3]);
const sum = computed(() => numbers.reduce((a, b) => a + b, 0));

autorun(() => console.log(sum.get()));
// prints '6'
numbers.push(4);
// prints '10'
```

[공식 문서](https://mobx.js.org/refguide/computed-decorator.html)에 따르면 `autorun` 함수는 상태 값을 변화시키지 않으면서 항상 실행되어야 하는 상황(로깅, UI 업데이트)에서 사용되며 그 이외의 경우는 전부 `computed` 사용을 권장하고 있다.

> Don't confuse computed with autorun. They are both reactively invoked expressions, but use @computed if you want to reactively produce a value that can be used by other observers and autorun if you don't want to produce a new value but rather want to achieve an effect. For example imperative side effects like logging, making network requests etc.

## 참고 자료

- [Manage Complex State in React Apps with MobX from @mweststrate on @eggheadio](https://egghead.io/courses/manage-complex-state-in-react-apps-with-mobx)
- [Manage Application State with Mobx-state-tree from @mweststrate on @eggheadio](https://egghead.io/courses/manage-application-state-with-mobx-state-tree)
- [Mobx Documentation](https://mobx.js.org/)