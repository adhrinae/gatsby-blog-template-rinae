---
path: "/posts/helper-types-in-typescript"
date: "2018-07-08"
title: "타입스크립트에서 헬퍼 타입을 정의하고 활용하기"
category: "Typescript"
tags:
  - Typescript
---

타입스크립트를 사용한지 어느덧 6개월정도 지났습니다. 아직 타입을 잘 활용하고 있다는 생각이 들진 않지만, 리액트 + 타입스크립트로 작업하는데 별다른 어려움 없이 작업에는 더 도움이 되고 있다고 생각합니다. 지난 프로젝트에서도 React + Typescript + Next.js 를 활용하여 만들었는데 몇 가지 설정 면에서 애먹었던 경우를 제외하면 굉장히 만족스러운 작업을 할 수 있었습니다.

일을 할 때 다른 팀원들이 불편하게 느낄 수도 있으면서도 중요한 점이 있었는데, 우리가 서버에서 가져오는 데이터의 타입 정의를 최대한 명확하게 하는 것이었습니다. 문제는 한번 서버에 데이터를 요청하면 내려오는 데이터의 양이 어마어마해서 심한 경우 한번에 JSON 1300줄 이상이 내려온 적도 있었습니다. 여기서 우리가 필요한 정보를 추려내는 작업을 하고, 그 결과값에 대한 타입 정의를 해야 정제된 데이터를 쓰는 컴포넌트들에 정확히 어떤 데이터를 심어주어야 할 지 알 수 있겠지요.

다행히 백엔드 서버도 타입스크립트 기반으로 되어있어서, 보내주는 데이터에 대한 인터페이스 정의가 되어있었습니다. 우리는 그 인터페이스를 사용하기 위해 npm 패키지를 설치하고 불러올 수 있어서, 데이터 정제 시 기본이 되는 타입을 일일이 손으로 정제할 필요는 없게 되었습니다. 만약 필요하시다면 [이런 도구](https://quicktype.io)를 한번 살펴보시기 바랍니다.

하지만 여기서부터 문제가 시작됩니다. 우리가 정의할 타입은 기존에 주어진 타입에서 일부를 **뽑아내고, 덮어써서 만들어야 할 때가 있습니다**. `Pick` 이라는 타입이 아주 유용하게 사용되기도 하지만 그것만으론 부족해서 실무에 조금 더 유용하게 활용할 수 있는 서브 타입(헬퍼 타입?)을 만들고 활용했습니다. 이번 글에서 그 일부를 안내해드리고, 괜찮으시다면 사용해보시고 댓글로 여러분들이 사용하는 헬퍼 타입을 공유해주시는 것도 좋겠습니다.

**본문의 헬퍼 타입은 타입스크립트 2.8 이상에서 사용하셔야 합니다. conditional types는 2.8 이상에서만 동작합니다. (최신버전인 2.9.2 권장)**

- - - -

## Diff, Omit 타입
가장 간단한 것 부터 시작해보겠습니다. 2.8 버전에서 conditional types(조건부 타입 정의) 덕분에 위 두 타입을 정의하기 아주 쉬워졌습니다. [공식 문서에 따르면](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html) 조건부 타입은 이렇게 동작합니다.

```
T extends U ? X : Y
```

삼항연산자랑 같다고 생각하시면 됩니다. 일단 앞의 조건이 맞다면 `X` 가 정의되는 타입이고, 그렇지 않다면 `Y` 가 정의되는 타입입니다.

이를 활용하여 두 타입 혹은 객체 사이에서 다른 것을 추릴 때 가장 기본이 되는 `Diff` 타입을 만들어보겠습니다.

```typescript
type Diff<T, U> = T extends U ? never : T

// Example
type DiffExample = Diff<'a' | 'b' | 'c' | 'd', 'a' | 'c' | 'f'>;  // 'b' | 'd'
```

위 예제를 보면 바로 이해하실 수 있으리라 생각합니다. 기준이 되는 앞의 타입과 뒤에 정의한 타입 사이에 겹치지 않는 결과물만 정의되었습니다. 아직은 이 `Diff` 타입만 가지고는 인터페이스를 마음대로 주무를 수 없습니다. 가장 먼저 특정 인터페이스에서 원하지 않는 속성을 제외하는 `Omit` 타입을 만들어보겠습니다. 그 반대인 `Pick` 타입은 이미 있으니까요.

```typescript
type Omit<T, U extends keyof T> = Pick<T, Exclude<keyof T, U>>

// Example
type OmitExample = Omit<{
  a: 'string',
  b: 'number',
  c: 'symbol'
}, 'b' | 'c'> // { a: 'string' }
```

`Exclude` 타입도 2.8버전에서 새로 등장한 선탑재(Predefined) 타입입니다. 위에 링크한 공식 문서를 한번 살펴보시면 이해하시는데 많은 도움이 됩니다.

## Dig 타입
`Pick`  타입은 특정 인터페이스의 원하는 키만 뽑아와서 새 타입을 만들 때 굉장히 유용하지만, 만약에 중첩된 객체 형식으로 있을 때 그 내부를 뽑아 쓰기 힘들 때가 있습니다.

```typescript
const obj = {
  a: {
    first: '1',
    second: '2',
    thrid: '3',
  },
  b: 'b',
  c: {
    fourth: '4',
    fifth: '5'
  }
}

type InsideA = Pick<typeof obj, 'a'>
/* 결과
 * a: {
 *  first: string;
 *  second: string;
 *  thrid: string;
 * };
*/

/**
  * 하지만 내가 원하는건..
  * {
  *   first: string;
  *   second: string;
  *   thrid: string;
  * }
  */
```

지극히 정상적인 동작입니다만, 제가 원하는 결과물은 달랐습니다. 저 위에 `a` 라는 객체 정의는 필요가 없거든요. 타입스크립트의 타입 정의는 대부분 ‘자바스크립트 객체의 키-값을 어떻게 정의하고 넣어주냐’로 이해하시면 쉽습니다. 그래서 타입을 정의할 때 객체의 값을 뽑아올 때 쓰는 `obj[‘key’]` 같은 방식의 정의가 잘 작동합니다.

```typescript
// 위의 obj에 이어서
type InsideA = Pick<typeof obj, 'a'>['a']
/**
  * 결과
  * {
  *   first: string;
  *   second: string;
  *   thrid: string;
  * }
  */
```

이제 원하는 결과가 제대로 나왔습니다. 하지만 저렇게 일일이 `['a']`  라고 붙이는것도 번거롭고 예쁘지가 않으니 하나의 헬퍼 타입으로 정의해보겠습니다. 저는 중첩된 객체를 파낸다는 데 착안해서 Dig라고 정의합니다.

```typescript
type Dig<T, U extends keyof T> = Pick<T, U>[U]
```

동작 특성상 중첩 객체 탐색용으로 쓰시는걸 권장합니다. 대부분의 경우는 `Pick` 타입만으로도 충분합니다.

## Overwrite 타입
주어진 인터페이스를 활용하면서 특정 속성만 새로운 타입으로 덮어씌우고 싶을 땐 어떻게 할까요? `extends`, `&` 기호는 제대로 동작하지 않습니다. 인터페이스의 `extends` 는 애초에 에러가 나며, `&` 는 예상하지 못한 결과가 나옵니다.

```typescript
type A = {
  a: string;
  b: string;
}
type B = A & { b: number }

const b1: B = {
  a: 'string',
  b: 'string' // Error
}

const b2: B = {
  a: 'string',
  b: 100 // Error
}
```

위의 예시는 `b` 속성을 `&` 연산자로 덮어씌워버렸다고 생각했으나 두 조건 모두 충족되지 않는 결과물이 나와버렸습니다. `&` 연산자를 쓰실 때는 새로운 속성을 덧붙일때만 쓰셔야 한다는 점을 명심하시기 바랍니다.

그렇다면 속성을 덮어씌우기 위해 먼저 정의된 타입의 key를 빼 버리고, 우리가 새로 덮어쓸 정의와 합쳐주면 되겠군요. 이 때 앞서 정의한 `Diff` 타입을 활용하게 됩니다.

```typescript
type Overwrite<T, U> = {
  [P in Diff<keyof T, keyof U>]: T[P]
} & U

type B = Overwrite<A, { b: number }>

const b1: B = {
  a: 'string',
  b: 100 // No Error
}
```

## SubType 타입
지금까지 만든 헬퍼 타입은 모두 속성값(혹은 키값)이 중심이 되는 타입 정의였습니다. 이번에는 반대로 **특정 타입을 입력하면 그에 맞는 속성-타입 쌍을 추리는** 헬퍼 타입을 만들어보겠습니다. 만약 아래의 `Person` 인터페이스에서 `string` 타입을 가지고 있는 속성만 추릴 땐 어떻게 해야할까요?

```typescript
interface Person {
  id: number;
  firstName: string;
  lastName: string;
  load(): Promise<Person>;
}

// SubType<Person, string>을 써서 원하는 결과
type PersonName = {
  firstName: string;
  lastName: string;
}
```

조금 복잡하겠지만 이렇게 됩니다.

```typescript
type SubType<BaseType, ConditionType> = Pick<BaseType, {
  [Key in keyof BaseType]: BaseType[Key] extends ConditionType ? Key : never
}[keyof BaseType]>
```

이런 타입은 함수 시그니처도 인식합니다.

```typescript
type PersonLoader = SubType<Person, (_: any) => any>
/** 결과
 * {
 *   load: () => Promise<Person>;
 * }
 */
```

만들어지는 과정은 [이 글](https://medium.com/dailyjs/typescript-create-a-condition-based-subset-types-9d902cea5b8c)을 참고해주시기 바랍니다. 조건부 타입 정의에 많은 도움이 됩니다. 이 타입은 `null` 타입에 대응이 안된다는 문제가 있지만 링크된 글의 댓글을 참고하면 어느정도 유효한 답을 얻을 수 있습니다. 그 답은 각자 필요에 따라 조사해보시기 바랍니다.

- - - -

본문에 비해 서론이 길긴 했지만 이런 헬퍼 타입들은 필요한 경우가 극히 드물 수 있습니다. 하지만 프로젝트 규모가 커지거나 복잡해질 수록 굉장히 유용하게 사용될 수 있으므로 한번 훑어보시고 기존에 정의해둔 타입에서 중복되는 부분을 줄일 수 있는지 확인해보셔도 좋습니다.

## 참고자료
- [TypeScript 2.8 · TypeScript](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html)
- [Advanced TypeScript Types with Examples – gitconnected - The Developer Learning Community](https://levelup.gitconnected.com/advanced-typescript-types-with-examples-1d144e4eda9e)
- [TypeScript: Create a condition-based subset types – DailyJS – Medium](https://medium.com/dailyjs/typescript-create-a-condition-based-subset-types-9d902cea5b8c)
