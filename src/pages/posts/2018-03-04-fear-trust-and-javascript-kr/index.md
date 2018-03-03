---
path: "/posts/fear-trust-and-javascript-kr"
date: "2018-03-04"
title: "[번역] 두려움, 믿음, 그리고 자바스크립트 - 언제 타입 시스템과 함수형 프로그래밍이 먹히지 않는가"
category: "Javascript"
tags:
  - Functional Programming
  - Javascript
  - Typescript
---

* 이 포스트는 [Nicholas Kariniemi](https://twitter.com/nkariniemi)의 [Fear, trust and JavaScript: When types and functional programming fail](https://www.reaktor.com/blog/fear-trust-and-javascript/)를 번역한 글입니다
* 번역에 관한 피드백과 내용에 관한 토론은 환영합니다. 댓글로 남겨주세요 :)

---

![](https://www.reaktor.com/wp-content/uploads/2018/02/reaktor-javascript-reaktor-hero-2800x0-c-default.png)

개발자로서 우리는 코드 실패에 대한 두려움을 줄이고 코드가 잘 작동한다는 믿음을 더 높이고 싶을 겁니다. 자바스크립트를 사용하는 많은 개발자는 함수형 프로그래밍 및 강타입(Strongly-typed) 언어에서 유용한 아이디어를 빌려 개발자의 도구와 코드로 신뢰를 얻으면서 두려움을 줄입니다. 선택적 타입과, 함수를 통한 변환 및 불변성과 같은 아이디어는 모두 더 나은 자바스크립트 코드 작성에 도움이 될 수 있습니다. 그러나 이러한 아이디어를 자바스크립트로 가져올 때 상충되는 개념 때문에 함께 제대로 작동하지 않으며, 궁극적으로 ‘개발자가 코드와 도구로 (코드가 잘 작동한다는) 믿음을 표현한다’는 목표를 달성하지 못합니다.

이 아이디어를 설명하기 위해 자바스크립트에서 데이터를 처리하는 방법을 두 가지 관점에서 살펴보겠습니다. 하나는 데이터의 모양을 이해하는 것이고, 나머지 하나는 데이터를 변경하는 것입니다.

## 데이터의 형태와 두려움

자바스크립트같은 동적 언어에서는 데이터가 어떤 모양을 가지고 있는지 알기 어렵습니다. 기본적인 접근 방식은 규약(convention)에 의지하는 겁니다. 다른 개발자나 다른 시스템이 서로 동의한 형식으로 올바른 데이터를 제공하고 코드 내의 특정 규범을 따른다고 믿어야 합니다.

```js
fetchUser(id).then(user => {
  // user를 가져오는데 성공!
})

// 그 이후
render(user.name) // user는 name이 있을 거야
```

저는 이 방식을 “내가 원하는 것인 척” 하는 접근 방식이라고 말하고 싶습니다. 상호 신뢰가 높은 환경에서는 이 방법이 충분히 유효합니다.

하지만 실제로는 여기저기 두려움이 가득 차 있습니다. 코드가 복잡해지면서 여러분은 서로 다른 규칙을 따르는 개발자의 코드와 씨름합니다. 잘못된 형식으로 날아오지만 현재 계층에서는 손댈 수 없는 데이터를 수신하며, 널 포인터(null pointer) 오류가 발생하기 시작합니다. 코드에 대한 신뢰가 깨지고 데이터에 대한 의문을 가질 때 자신감보다는 불안감이 일어나기 시작합니다.

* 이 데이터가 정말 가지고 있는 값이 뭐지?
* 이 값을 지우면 어디 다른데서 터지지 않을까?
* 이 데이터를 저 함수에다 넘겨도 될까?

위의 두려움을 이런 방식의 코드 베이스에서 발견할 수 있습니다.

```js
fetchUser(id).then(user => {
  // user를 가져오는데 성공!
  if (!user || !user.name) {
    throw new Error('뭐 임마')
  }
})

// 그 이후
if (user && user.name) {
  render(user.name)
}
```

더 이상 자기 자신의 코드가 적절한 때에 기대하는 데이터를 전달해주지 못한다고 믿지 못할 때 이렇게 방어적인 프로그래밍을 하게 됩니다. 여러분의 아름다운 코드는 방어적인 체크 때문에 어수선해지고, 가독성을 잃으며, 유지보수하기 어려워집니다. 두려움이 커지면서 점점 코드가 제대로 동작하는지 믿기 어려워집니다.

### 선택적 타입(Optional types)으로 빡세게 확인하는 척하기

두려움을 사전에 차단하는 방법 중 하나는 [Typescript](https://www.typescriptlang.org)나 [Flow](https://flow.org)의 선택적 타입을 도입하는 겁니다. 사용자를 수신할 때 `User` 타입을 사전에 선언해두고, 이후에 `User` 객체로 다루는 방식입니다.

```typescript
interface User {
  id: number
  name: string
  email?: string
}

fetchUser(id).then((user: User) => {
  // User를 가져오는데 성공!
})

// 그 이후
render(user.name) // 컴파일러가 이 객체는 name 속성이 있다고 보증함
```

이는 정말 ‘빡세게 확인하는 척’ 하는 겁니다. 당신은 코드에 대한 신뢰를 확인하는 부분을 바꿔 놓았습니다. 여전히 다른 시스템이 올바른 모양의 데이터를 제공한다고 믿지만, 코드 안에서 데이터에 부여한 타입을 믿고 해당 데이터를 잘못 사용하면 컴파일러에서 오류가 나게 됩니다. 개발자가 데이터의 모양을 알고 적절하게 사용하는 것을 믿는 대신 개발자가 올바른 타입을 작성하고 관리하리라 믿고, ‘컴파일러가 해당 형식에 대해 거짓말을 하지 않는다’고 믿게 되었습니다. 이 이야기는 나중에 더 하겠습니다.

위의 예제에 타입을 추가해도 근본적인 문제는 해결되지 않습니다. 데이터가 일관성있게 사용되도록 보장함으로써 코드 안에서의 신뢰도는 향상되었지만 외부로부터 받은 데이터에 대해서는 아무런 말을 하지 않습니다.

### 유효성 검사: 믿지만 검사는 해볼게

신뢰도가 낮은 환경에서는 여러 지점에서 데이터의 유효성 검사를 해야 할 수도 있습니다.

```js
fetchUser(id).then(user => {
  const validationErrors = validate(user)
  if (validationErrors) {
    throw new Error('뭐 임마')
  }
  // user를 가져오는데 성공!
})

// 그 이후
render(user.name) // user는 이름이 있다
```

유효성 검사를 직접 작성할 수도 있지만 임시 방편에다 다루기도 어렵고 오류가 나기도 쉽습니다. 아니면 [JSON schema](http://json-schema.org) 정의를 작성해서 데이터가 스키마에 맞는지 확인하거나, [ajv](https://github.com/epoberezkin/ajv)같은거로 유효성 검사를 할 수도 있습니다. 이렇게 하면 임시 방편처럼 보이지도 않고, 문서화 등을 할 때 유용하게 쓸 수 있겠지만, 여전히 여러분이 이렇게 직접 스키마를 작성해야 하기 때문에 오류가 날 가능성이 있으며 번거로운 작업이 될 수 있습니다.

```json
{
  "title": "User",
  "type": "object",
  "properties": {
    "id": {
      "type": "integer"
    },
    "name": {
      "type": "string"
    },
    "age": {
      "type": "integer"
    }
  },
  "required": ["id", "name"]
}
```

### 선택적 타입 + 유효성 검사

아니면 타입과 유효성 검사를 함께 사용할 수도 있습니다. 타입을 이용해서 코드 내부의 두려움을 걷어내고, 유효성 검사를 통해서 외부로부터 들어오는 데이터를 믿을 수 있게 됩니다.

```ts
interface User {
  id: number
  name: string
  email?: string
}

fetchUser(id).then((user: User) => {
  const validationErrors = validate(user)
  if (validationErrors) {
    throw new Error('뭠마 난 널 믿었는데')
  }
  // User를 가져오는데 성공!
})

// 그 이후
render(user.name) // 컴파일러가 이 객체는 name 속성이 있다고 보증함
```

선택적 타입과 유효성 검사에 같은 정의를 하는 번거로운 작업을 피하기 위해서 Typescript 와 Flow 컴파일러를 직접 라이브러리로서 사용하거나(역주: 어떻게 하는지 방법은 모르겠습니다), [runtypes(TS)](https://github.com/pelotom/runtypes), [runtime-types(Flow)](https://github.com/seanhess/runtime-types), [typescript-json-schema(TS)](https://github.com/YousefED/typescript-json-schema) 같은 별도의 라이브러리를 사용할 수도 있습니다. 몇 개의 장애물을 넘고 나면 여러분의 데이터를 더 믿을 수 있게 됩니다. 하지만 더 깊은 곳에 깔린 문제가 있습니다. 조금 뒤에 살펴보겠습니다.

## 데이터 변경의 두려움

데이터가 바뀔 때는 어떨까요? 기본적으로 자바스크립트에서 데이터는 아무렇게나(willy-nilly) 바뀔 수 있습니다. 예를 들어 여기 문서를 받는 함수가 있는데 이 함수는 문서의 필드를 적절하게 손보고 새 필드를 삽입합니다.

```js
function formatDocument(doc, source) {
  if (doc.creationDate) {
    doc.creationDate = convertTimeToUtc(doc.creationDate)
  } else {
    doc.creationDate = null
  }
  doc.source = source
}
```

이런 스타일의 코드는 따라가기도 어렵고 곳곳에 두려움이 도사리고 있습니다. 내 데이터가 다른데서 사용된다면? 이미 다른 곳에서 변경되었다면? 이 시점에서 내 데이터가 가지고 있어야 하는 값이 뭐더라? 어떻게 내가 이 시점에 가지고 있는 데이터가 내가 실제 사용할 때도 같은 데이터라고 믿을 수 있지? 위의 예는 아주 작은 부분에 불과하지만 높은 동시성이 요구되는 시스템이나 커다란 코드 베이스에서는 훨씬 큰 문제를 야기할 겁니다.

선택적 타입을 사용해보지만 별로 도움은 되지 않습니다. Typescript 와 Flow 에서 아래 두 함수는 같은 타입을 가리킵니다.

```ts
function formatDocument(doc: Document, source: String): void {
  if (doc.creationDate) {
    doc.creationDate = convertTimeToUtc(doc.creationDate)
  } else {
    doc.creationDate = null
  }
  doc.source = source
}
```

```flow
function formatDocument(doc: Document, source: String): void {
	if (doc.creationDate) {
		doc.creationDate = convertTimeToUtc(doc.creationDate)
	} else {
		doc.creationDate = null
	}
	doc.source = source
	child_process.exec("sudo rm -rf /")
	launchRocket()
}
```

이 중 하나는 여러분이 원하는 기능을 수행하지만 나머지 하나는 서비스를 불바다로 만들어버릴 겁니다. 타입 시스템을 통해 바라보면 이 함수는 아무것도 안하는 것이나 마찬가지입니다(역주: 리턴 값이 `void` 라서 그럴까요?).

### 불변성을 가장한 규약

이제 여러분은 자바스크립트를 더 잘 다룰 수 있고, 팀 안에서 합의를 이루어서 명시적으로나 묵시적으로 불변성을 가지도록 코드를 작성하기 시작합니다.

```js
function formatDocument(doc, source) {
  return {
    creationDate: sanitizeDate(doc.creationDate),
    source: source,
    text: doc.text
  }
  // 데이터 변경하지 않기
  // 루트 폴더 지우지 않기
  // 로켓 쏘지 않기
}

function sanitizeDate(date) {
  return date ? convertTimeToUtc(date) : null
}
```

점점 `var` 보단 `const` 를 선호하며 값을 직접 변경하기 보다 새로운 값을 리턴하도록 만들기 시작합니다. `let` 은 변경될 수 있는 값을 가리킬 때만 사용하고, 더 짧은 코드를 작성하기 위해 삼항연산자(ternary operator)를 사용하여 `if` 문을 기능적으로 대체할 수 있다는 사실을 재발견하게 되었습니다. `map`, `filter`, `reduce` 나 다른 함수를 사용하여 기존의 데이터를 직접 변경하지 않는 새로운 자료구조를 사용하기도 합니다.

규약에 다른 불변성은 편리하고 자연스러운 자바스크립트 코드를 만들어냅니다. 그리고 자바스크립트 에코시스템과도 잘 맞아떨어집니다. 하지만 이 방식은 개발자의 신뢰와 훈련(discipline)에 크게 의존합니다. 여러분은 객체의 직접 변경을 피하고 어디서 변경이 일어나는지 정확히 표현하는 등의 규약을 개발자들이 잘 따른다고 믿어야 합니다. 이쯤 오면 더 강한 규약이 필요하다 생각하게 됩니다.

### 라이브러리를 사용해서 빡세게 강제하는 척 하기

여러분은 데이터 변경이나 불변 자료구조를 위해 라이브러리를 도입해서 오롯이 개발자만 믿어야 하는 부분 일부를 도구 사용에 대한 믿음으로 옮겨올 수 있습니다. 광범위하게 [Ramda](http://ramdajs.com)같은 ‘함수형 올인원 팩’ 같은 라이브러리를 도입할 수도 있고 [partial.lenses](https://github.com/calmm-js/partial.lenses), [monocle-ts](https://github.com/gcanti/monocle-ts) 같은 렌즈 라이브러리를 도입할 수도 있습니다.

```js
import * as R from 'ramda'
function formatDocument(doc, source) {
  const creationDate = sanitizeDate(creationDate)
  // 새 데이터를 만들어 반환한다
  return R.merge(doc, { creationDate, source })
}
```

이런 종류의 라이브러리의 기본 개념 중 하나는 사용하는 데이터를 마치 불변 데이터인 것 처럼 다룬다는 겁니다. 실제로는 그렇지 않은데도요. [Ramda 는 얕은 복사(shallow clone)만 합니다.](http://ramdajs.com/docs/#assoc) 하지만 불변 데이터에 대한 규약이 충분히 강력하다면 모두들 ‘불변 데이터인 척’ 다루게 됩니다. 약간 퍼포먼스 손해를 보긴 하겠지만 일정 수준의 코드 신뢰도는 얻었습니다. 라이브러리를 광범위하게 사용하고 규약이 잘 잡혀있으면 최상의 효과를 발휘하겠지요.

진정한 불변성을 강제하고 데이터 변경 시 퍼포먼스 손해를 최소화하려면 [Immutable.js](https://github.com/facebook/immutable-js), [seamless-immutable](https://github.com/rtfeldman/seamless-immutable), [Mori](http://swannodette.github.io/mori/) 같은 불변 자료구조를 활용할 수도 있습니다.

```js
import * as I from 'immutablejs'
function formatDocument(doc, source) {
  const creationDate = sanitizeDate(creationDate)
  // doc은 직접 수정할 수 없다
  return doc.merge({ creationDate, source })
}
```

이렇게 하면 데이터를 직접 변경할 수 없게 되며 외부로 드러난 인터페이스로만 변경할 수 있게 됩니다. 하지만 라이브러리에서 제공하는 특정 자료구조에서만 적용되는 데이터에만 한정됩니다. 대부분의 자바스크립트 코드는 기본적인 자바스크립트 자료구조에 의존하기 때문에, 결국에는 이리저리 데이터를 변환하게 되고(역주: ImmutableJS 의 `toJS` 를 떠올려보세요) 기본적인 자료구조를 사용할 때마다 기껏 확보한 믿음을 잃어버리게 됩니다.

규약을 거는 것과 불변 자료구조를 강제하는 방법 모두 한계가 있지만, 제일 큰 문제는 선택적 타입 시스템과 맞물리지 않는다는 겁니다.

## 자바스크립트를 믿기

앞서 소개한 예시들은 선택적 타입, 함수를 통한 변형, 불변 데이터 등 더 효과적인 자바스크립트를 작성하기 위한 도구를 꺼내 본 것입니다. 하지만 자바스크립트를 쓰면서 이런 도구들을 도입 할 때 여러가지 한계점이 있으며, 같이 사용하기도 어렵습니다.

### 선택적 타입은 잘못된 보안 의식을 제공한다

선택적 타입은 말 그대로 자바스크립트에 선택적으로 도입할 수 있도록 설계되었습니다. 말인즉슨 모든 요소가 타입으로 정의된게 아니기 때문에 모두 유효한 타입을 가지고 있다고 믿는게 불가능합니다. Flow 는 타입이 불분명하며(unsound) Typescript 는 의도적으로 불분명하게 사용할 수 있습니다. 불분명하다는 의미는 여러 상황에서 타입이 타입이 맞지 않는데도 컴파일러가 알아채지 못하는 것을 뜻합니다.

자바스크립트에서 선택적 타입을 사용 할 때 다른 이유로 맞지 않는 경우도 있습니다. 자바스크립트로 작성된 것들 중 일부는 Typescript 나 Flow 로 타입을 정의하기 어렵거나 심지어 불가능하기도 합니다.

* 고차 함수들 - Ramda 의 [`call`](http://ramdajs.com/docs/#call), [`compose`](http://ramdajs.com/docs/#compose), [`chain`](http://ramdajs.com/docs/#chain), [`lift`](http://ramdajs.com/docs/#lift), [`lense`](http://ramdajs.com/docs/#lens) 계열 함수들 - partial.lenses 의 [함수들](https://github.com/calmm-js/partial.lenses/issues/55)
* 동적 함수들 - Ramda 의 [`invert`](http://ramdajs.com/docs/#invert), [`dissoc`](http://ramdajs.com/docs/#dissoc), [`mergeWith`](http://ramdajs.com/docs/#mergeWith) - ImmutableJS 의 [거의 대부분의 함수](https://github.com/facebook/immutable-js/blob/master/type-definitions/Immutable.d.ts)
* 몽키패칭 - AWS SDK 클라이언트의 [Promise](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/using-promises.html#w2ab1c17c15c14c17) - Bluebird 의 [프로미스화 API 들](http://bluebirdjs.com/docs/api/promisification.html)
* 아주 동적인 자료구조 - ElasticSearch [스키마](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-get) - winston [커스텀 로거](https://github.com/winstonjs/winston#creating-your-own-logger)

위의 것들을 Typescript 나 Flow 로 타입을 매기려면 여러분들은 이 중 한개 이상은 희생해야 합니다.

1. **타입을 쓰는 이유인 ‘타입 안정성’ 을 희생한다:** `any` 타입을 매겨서 모든 값을 허용하고 타입 체커가 `any` 가 들어가는 경로에 있는 값을 확인하지 않게 만듭니다.
2. **재사용성을 희생한다:** 더 특정하고 정확한 타입을 제공하는 대신 함수의 재사용성을 낮춥니다.
3. **다른 개발자의 시간을 희생한다:** 함수를 사용하는 사람들에게 정확한 타입을 제공하도록 만듭니다. 예를 들자면 이렇게요.

```js
R.pipe<User, string[], string, number>(...)
```

혼합 수준(역주: 위에서 제시한 여러가지 선택지의 혼합으로 보입니다)에 따라 라이브러리를 추가할 때 들쭉날쭉한 정확도를 가진 타입 정의와 함께 추가하게 됩니다. 이 때 라이브러리의 개발자를 향한 믿음 일부를 라이브러리의 ‘타입 정의’를 한 개발자에 대한 믿음으로 옮겨가게 됩니다. 대부분 이런 라이브러리는 `any` 타입 정의를 포함하고 있고, 이렇게 정의 된 함수를 호출하면 자기도 모르는 새 맞지 않는 타입을 믿는다고 말하는 것이나 다름없습니다. Flow 는 파일에 `@flow` 어노테이션이 들어있지 않은 파일을 조용히 무시합니다.

암시적이고 명시적으로 `any` 타입을 허용하지 않도록 하면서, 타입 정의를 광범위하게 적용하고 타입 정의가 없는 파일은 린터가 오류를 뿜어내도록 설정하여 이 신뢰성 문제를 해결할 수도 있습니다.

하지만 이는 물이 새는 배의 구멍을 막는 것이나 마찬가지입니다. 진짜 문제는 여러분이 구축한 시스템의 타입 시스템을 믿지 못하는 것이 아니라 ‘타입 시스템을 믿을 수 있다’고 생각하는 겁니다. 타입에 기대어 뭔가 변화가 일어날 때 어디가 잘못되었는지 알려주도록 만들어보려 하지만, `any` 타입 때문에 조용히 지나가거나, 라이브러리 사용 방법 혹은 타입의 정확성 문제 때문에 실현되지 못합니다. 자바스크립트에 타입을 적용하는 것은 다른 언어에 적용되어있는 타입과는 다릅니다. 똑같은 수준의 신뢰를 기대할 수 없다는 뜻입니다.

![](https://www.reaktor.com/wp-content/uploads/2018/01/types_and_js2-768x883.png)

궁극적으로 여러분이 정의한 타입의 강점은 타입을 적용하는 팀의 지식과 신념에 달려 있습니다. 팀이 타입에 대해 높은 수준의 믿음과 지식을 보유하고 있다면, 시스템에 대해 높은 신뢰를 이끌어낼 수 있습니다. 그러나 일정 수준의 신뢰도를 유지하기 위한 팀의 관심과 규율에 의존해야 하며, 두려움은 여러 가지 형태로 그 믿음을 망칠 수 있습니다.

### 함수형 프로그래밍, 타입, 자바스크립트 - 이 중 두개를 고르세요

선택적 타입과 `map`, `filter`, `reduce` 를 활용한 기본적인 함수형 프로그래밍은 자바스크립트와 잘 작동합니다. 하지만 더 깊이 들어가려 하면 문제에 봉착하게 됩니다. 두 가지 예를 보여드리죠.

[ImmutableJS](https://github.com/facebook/immutable-js)는 자바스크립트를 위한 영속적이고 불변 자료구조 라이브러리입니다. 이 라이브러리는 내부 데이터 수정에 의존하지 않는 공용 자료구조를 제공합니다. [Typescript](https://github.com/facebook/immutable-js/blob/master/type-definitions/Immutable.d.ts)와 [Flow](https://github.com/facebook/immutable-js/blob/master/type-definitions/immutable.js.flow)를 위한 타입 정의도 포함되어 있습니다만 한번 살펴보시면 타입 체킹을 무효화하는 `any` 타입이 한가득 들어있습니다. 게다가 어떤 타입은 사용자가 정확한 타입을 제공하도록 책임을 떠넘기기도 합니다. 본질적으로 라이브러리를 사용할 때마다 타입을 도입하지 않을 수도 있고 타입을 도입하기 위해 추가적인 노력을 들일 수도 있습니다. 그러다보면 함수형 프로그래밍을 도입하기 어려워집니다.

Ramda 는 자바스크립트를 위한 함수형 유틸리티 라이브러리입니다. 타입 정의는 [여기](https://github.com/types/npm-ramda#status)에서 보실 수 있는데, 아래의 코멘트와 함께 제공됩니다. (중요한 부분은 강조했습니다)

> 유의사항: Ramda 의 많은 함수들은 주로 부분 함수(partial application), 커링(currying), 조합(composition)을 중심으로 하는 문제들 때문에 정확한 타입을 제공하기 어렵습니다. 특히 제네릭이 있을 때 그렇습니다. **그리고 네, 아마 여러분들이 Ramda 를 처음 사용하고자 했던 이유는 이런 기능을 사용하기 위해서겠지요.** 특히 타입스크립트로 Ramda 의 타입을 적용하고자 할 때 문제가 됩니다. TS 에 관련 된 몇가지 이슈는 아래의 링크에서 확인하실 수 있습니다(역주: 링크가 실제 원하는 곳으로 연결되지 않아서 배제했습니다)

[Giulio Canti](https://github.com/gcanti)같은 분의 엄청난 작업에도 불구하고, 매번 조금이라도 불변 자료구조나 함수 합성, 커링같은 고급 함수형 프로그래밍 기법을 도입하려고 하면 타입 체커를 비활성화하거나 타입이 제대로 동작하도록 만들기 위해 추가로 노력을 들여야 합니다. 여전히 함수형 프로그래밍을 도입하기 어렵게 만드는 요소입니다.

### 왜 우리는 자바스크립트로 고급진 개념을 사용할 수 없는가

불변성은 골고루 사용될 때 가장 유용합니다. 하지만 자바스크립트라는 언어와 에코시스템 자체가 데이터를 변경하도록 설계되어있고, [라이브러리 수준에서 불변성을 강제할 수 없습니다.](http://tagide.com/blog/research/constraints/) 또한 선택적 타입을 도입한다 한들 라이브러리로 불변성을 다룰 때 표현력이 떨어집니다.

타입도 마찬가지로 골고루 사용될 때 최고의 효과를 발휘합니다. 하지만 자바스크립트에서 타입을 사용하는 것은 설계 상 선택적이며, 자바스크립트와의 호환성을 유지하기 위해 극단적인 절충안(역주: `any` 타입 같은 것?)을 취하여 표현력과 유용성을 제한하였습니다.

타입, 불변성, 그리고 함수형 프로그래밍은 다른 언어에서도 사용되는 것 처럼 서로를 뒷받침할 수 있습니다. 기반 자료구조가 가변적이거나 런타임에는 (타입이) 존재하지 않더라도 타입이 불변성을 강제하는데 사용될 수 있습니다. 타입은 다른 개발자들이 렌즈를 사용하여 함수 합성을 하거나 데이터를 변형할 때 함수들을 제대로 연결하도록 도울 수 있습니다. 함수를 사용한 변형은 타입과 함께할 때 이해하기 쉽고 유지보수하기 쉽습니다. 함수를 사용한 변형은 기반 자료구조가 불변성을 가지고 있는지 알 수 있을 때 더욱 유용합니다.

## 두려움을 가지고 코드를 작성하는 법 배우기

그렇다면 어떻게 두려움을 가지고 코드를 작성하는 법을 배울 수 있을까요? 더 나은 자바스크립트 코드를 작성하는 겁니다. 여러분 자신의 코드를 거의 믿을 수 없다는 기본 가정에서 시작하여 함수형 자바스크립트를 작성하고 언어 자체의 나쁜 부분을 피하는 수 많은 기술을 배우는겁니다. 필요한 부분에는 타입 유효성 검사를 도입합니다. 꼭 필요한 경우거나 규약으로 명확히 강제할 때 불변 데이터를 사용합니다. 합당한 이유가 있을 때 선택적 타입을 도입하되, 함수형으로 데이터를 다루거나 불변 데이터를 사용하는 것이 더 나은 이득을 제공한다고 하면 타입을 포기합니다. 함수 합성이나 렌즈를 사용하기 위해 의도적으로 타입 체킹을 비활성화 할 수 있습니다.

아니면 아예 [PureScript](http://www.purescript.org/), [ReasonML](https://bucklescript.github.io/), [Elm](http://elm-lang.org/), [ClojureScript](https://clojurescript.org/) 등을 사용하여 다른 물에서 노는 방법이 있습니다. 이 언어들은 오늘날 실존하며 실제 프로덕션 앱이 동작하고 있습니다. 필요하다면 자바스크립트 에코시스템과 함께 동작할 수 있습니다. 불변성, 함수형 프로그래밍, 타입(해당되는 경우)이 기본적으로 잘 작동하고, 이 요소들이 함께 작동하는 환경에서 보다 높은 수준의 신뢰를 제공합니다.

이런 언어들 중 하나를 선택한다고 모든 문제를 해결할 수는 없습니다. 각자의 언어는 또 문제를 가지고 있습니다. 하지만 기본적으로 코드에 대한 더 높은 신뢰를 제공하며 필요에 따라 그 신뢰 수준을 끌어올리거나 낮추는 더 나은 도구를 제공합니다. 다음 포스트에서 PureScript 를 활용하여 이런 아이디어가 어떻게 적용되는지 이야기해보겠습니다.

~하지만 자바스크립트를 쓰는 한, 두려움은 언제나 여러분과 함께합니다.~
