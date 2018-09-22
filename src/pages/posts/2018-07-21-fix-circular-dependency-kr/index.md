---
path: '/posts/fix-circular-dependency-kr'
date: '2018-07-21'
title: '[번역] 자바스크립트 & 타입스크립트의 순환 참조를 한방에 해결하는 방법'
category: 'Typescript'
tags:
  - Translation
  - Typescript
  - Javascript
  - Node.js
---

부제: 시행착오를 거쳐 모듈 로딩 순서를 이해하기

**[Michel Weststrate](https://twitter.com/mweststrate)의 [How to fix nasty circular dependency issues once and for all in JavaScript & TypeScript](https://medium.com/visual-development/how-to-fix-nasty-circular-dependency-issues-once-and-for-all-in-javascript-typescript-a04c987cf0de)를 번역한 글입니다**

---

제가 관리해왔던 많은 프로젝트들은 빠르거나 늦거나 언제나 같은 문제에 부딪혔습니다. 바로 순환 모듈 의존 문제입니다. _(역주: circular module dependency 를 순환 참조로 번역하자니 번역이 조금 이상하게 느껴지는데 일반적으로 많이 사용되고 있는 용어임을 감안하여 앞으로 순환 참조라는 용어를 사용하겠습니다. 피드백 환영합니다.)_ 순환 참조를 피하는 방법을 설명하는 모범 규약이나 전략들이 많이 있지만, 제대로 지속적이고 예측 가능한 방법으로 문제를 해결하는 방법은 거의 없었습니다. 사람들은 보통 ‘어쩌다 갑자기 작동하기를’ 빌면서 `import` 문이나 코드 블록을 이리저리 움직여봅니다. 사실 아래의 트윗을 보면 저만 고통받은건 아닌가 봅니다.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">&quot;How to fix nasty circular dependency issues for once and for all in javascript / <a href="https://twitter.com/typescriptlang?ref_src=twsrc%5Etfw">@typescriptlang</a>&quot; is on my to-write list for a long time. Would you be interested in / helped by such a blog post?</p>&mdash; Michel Weststrate (@mweststrate) <a href="https://twitter.com/mweststrate/status/1018945541424779264?ref_src=twsrc%5Etfw">July 16, 2018</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 
<blockquote class="twitter-tweet" data-conversation="none" data-lang="en"><p lang="en" dir="ltr">Yes. Yes. Yes.<br><br>...<br><br>Yes.</p>&mdash; Josh Goldberg 😍 (@JoshuaKGoldberg) <a href="https://twitter.com/JoshuaKGoldberg/status/1018964066302189568?ref_src=twsrc%5Etfw">July 16, 2018</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

저는 이 문제를 일관되게 해결하는 방법을 보여드리겠습니다.

## 예시(The case)

자바스크립트의 모듈 로딩 순서는 결정적(deterministic)입니다. 여전히 거대한 프로젝트에서는 파악하기가 어렵지요. (간접적으로) 순환 참조 문제가 발생하면 여러분의 코드는 반쯤만 불러와진 모듈 때문에 문제가 발생합니다. 이번 예제로 아직 초기화되지 않은 기본 클래스(base class)를 가져오거나 불러온 변수를 읽어들이려 할 때 생기는 문제를 확인하실 수 있습니다.

가령 자바스크립트 객체 트리를 YAML 형식으로 바꾸어주는 가상의 애플리케이션이 있다고 해 보겠습니다.

![예제 - 객체 트리를 문자열로 예쁘게 출력하기](https://cl.ly/30233q260824/fix-circular-dependency-1.png)

예제 코드는 [codesandbox](https://codesandbox.io/s/7jp0x7lrjq)에서 직접 실험해보실 수 있습니다. 앱의 구현 방식은 직관적입니다. 기본 클래스 `AbstractNode` 가 있고, 그 클래스에는 기본 구현체와 `parent` 나 `getDepth()` 처럼 공통적으로 사용되는 함수를 제공합니다. 그 다음에는 `Node` 와 `Leaf` 라는 세부 구현체들이 있습니다. 지금은 잘 동작하지만 세 개의 클래스를 한 파일에서 관리하는 것은 이상적인 방법이 아닙니다. 그러니 개선한 뒤에 어떻게 되나 살펴보겠습니다.

```js
export class AbstractNode {
  constructor(parent) {
    this.parent = parent
  }

  getDepth() {
    if (this.parent) return this.parent.getDepth() + 1
    return 0
  }

  print() {
    throw 'abstract; not implemented'
  }

  static from(thing, parent) {
    if (thing && typeof thing === 'object') return new Node(parent, thing)
    else return new Leaf(parent, thing)
  }
}

export class Node extends AbstractNode {
  constructor(parent, thing) {
    super(parent)
    this.children = {}
    Object.keys(thing).forEach(key => {
      this.children[key] = AbstractNode.from(thing[key], this)
    })
  }

  print() {
    return (
      '\n' +
      Object.keys(this.children)
        .map(
          key =>
            `${''.padStart(this.getDepth() * 2)}${key}: ${this.children[
              key
            ].print()}`
        )
        .join('\n')
    )
  }
}

export class Leaf extends AbstractNode {
  constructor(parent, value) {
    super(parent)
    this.value = value
  }

  print() {
    return this.value
  }
}
```

## 문제

일단 클래스들을 각자의 파일로 분리하면, 똑같이 작동할거라 생각했던 애플리케이션이 확 죽어버립니다. 에러 메세지는 `TypeError: Super expression must either be null or a function, not undefined` 라고 나옵니다. 너무 모호한 표현이라 문제를 파악할 수 조차 없습니다 ¯\_(ツ)\_/¯!

![순환 참조로 인해 생긴 예외의 예](https://cl.ly/1r1k010W3W3S/fix-circular-dependency-2.png)

아래 코드에서 보시다시피 변경점은 거의 없었습니다. ([여기](https://codesandbox.io/s/xjyj0ol3mq)에 들어가 보시면 깨진 상태의 샌드박스를 보실 수 있습니다)

```js
// -- AbstractNode.js --
import { Leaf } from './Leaf'
import { Node } from './Node'

export class AbstractNode {
  /* 그대로 */
}

// -- Node.js --
import { AbstractNode } from './Node'

export class Node extends AbstractNode {
  /* 그대로 */
}

// -- Leaf.js --
import { AbstractNode } from './AbstractNode'

export class Leaf extends AbstractNode {
  /* 그대로 */
}
```

이정도의 변경만 가해도 애플리케이션은 충분히 고장납니다. `Node` 와 `Leaf` 클래스는 `AbstractNode.js` 파일을 모듈로 불러와서 그 클래스의 `from` 스태틱 메서드를 사용하고 있습니다.

애플리케이션이 동작하지 않는 이유는 `AbstractNode` 를 `Leaf` 클래스에서 불러오려고 할 때 아직 정의되지 않았기 때문입니다. 신기하게도 우리는 `Leaf` 클래스 파일에 `import` 문을 정확히 써 줬는데도 이런 일이 일어났지요. 실제로 모듈이 로드되는 순서는 이렇습니다.

![모듈 로딩 순서가 순환 참조를 일으킬 수 있는 경우](https://cl.ly/233N0X3A321F/fix-circular-dependency-3.png)

1.  `index.js` 는 `AbstractNode.js` 파일을 불러옵니다(require).
2.  모듈 로더는 `AbstractNode.js` 파일을 불러오기 시작하고 모듈 코드를 실행합니다. 이 파일에서 처음 맞딱드리는 코드는 `Leaf` 를 `require(import)` 하는 구문입니다.
3.  그래서 모듈 로더는 `Leaf.js` 파일을 불러들이기 시작합니다. 그런데 이 파일도 `AbstractNode.js` 파일을 불러들이는 일부터 시작합니다.
4.  `AbstractNode.js` 는 이미 로드되었기 때문에 모듈 캐쉬에서 즉시 리턴해줍니다. 하지만 이 모듈은 `Leaf` 를 불러오는 첫 번째 줄의 코드가 실행되지 않은 상태이기 때문에 `AbstractNode` 클래스의 구현부는 실행되지 않았습니다!
5.  그래서 `Leaf` 클래스는 제대로 된 클래스가 아닌 `undefined` 값을 상속합니다. 그리고 위 그림처럼 예외가 터지겠죠. BAAM!

## 해결 시도 1

이렇게 우리의 순환 참조가 불쾌한 문제를 일으킨다는게 발견되었습니다. 하지만 자세히 들여다보면 원래 어떻게 파일을 불러와야 할 지 결정하는 것은 매우 쉽습니다.

1.  `AbstractNode` 클래스를 먼저 불러온다.
2.  `Node` 와 `Leaf` 클래스를 그 다음에 불러온다.

그러니까 먼저 `AbstractNode` 클래스를 먼저 불러온 다음 `Node`, `Leaf` 클래스를 불러오면 되겠네요. `AbstractNode` 클래스가 정의될 때 `Node` 와 `Leaf` 클래스는 아직 알려질 필요가 없기 때문에 잘 작동할겁니다. `AbstractNode.from` 가 처음으로 호출 되기 전에 두 클래스가 정의되어 있는 한 문제없이 작동할겁니다. 이렇게 바꿔보죠.

```js
export class AbstractNode {
  /* 그대로 */
}

import { Node } from './Node'
import { Leaf } from './Leaf'
```

이 방법은 몇 가지 문제가 있습니다.

먼저 못생긴데다 확장하기 어렵습니다. 거대한 코드베이스에 이 방법을 적용한다면 어쩌다 작동할때까지 `import` 문을 이리저리 움직봐야 할 겁니다. 하지만 어디까지나 임시 방편에 불과한게, 조금만 리팩터링을 하거나 `import` 문의 위치를 바꾸게 되면 미묘하게 모듈 로딩 순서가 바뀌어 또 문제가 일어나게 됩니다.

두 번째로 이 방법은 모듈 번들러에 크게 의존하는 방법입니다. 예를 들어 codesandbox 에서 Parcel 로 앱을 번들링할 때(아니면 Webpack 이나 Rollup), 제대로 [작동하지 않습니다](https://codesandbox.io/s/7oxxrqwoq6). 하지만 로컬 Node.js 환경에서 commonJS 모듈 방식으로 실행하면 잘 동작합니다.

## 문제를 피하기

보아하니 이 문제는 쉽게 해결할 수 없어 보입니다. 문제가 발생하지 않도록 할 순 없을까요? 물론 가능합니다. 몇 가지 방법이 있는데, 먼저 모든 코드를 한 파일에 두는 방법이 있습니다. 예시를 소개할 때 처음 파일처럼요. 모듈 초기화 코드가 실행되는 순서를 완전히 제어할 수 있기 때문에 문제가 해결됩니다.

두 번째로, 어떤 사람들은 "클래스를 사용해서는 안된다” 또는 "상속을 사용하지 말라" 같은 주장을 펼치기 위해 위와 같은 문제를 예시로 사용합니다. 그러나 이런 논의는 문제를 너무 단순하게 바라보는 겁니다. 저도 프로그래머가 상속에 너무 빨리 손을 대는 경향이 있다는데 동의하지만, 어떤 문제의 경우 상속을 통해 코드 구조, 재사용 또는 성능면에서 큰 이득을 얻을 수 있습니다. 하지만 가장 중요한 것은 이 문제가 클래스 상속에만 국한되지 않는다는 것입니다. 모듈 초기화 중에 실행되는 모듈 변수와 함수 사이에 순환 참조가 생기는 등 똑같은 문제가 발생할 수 있습니다!

`AbstractNode` 를 쪼개서 `Node` 와 `Leaf` 를 의존하지 않도록 만들 수도 있습니다. 이 [샌드박스](https://codesandbox.io/s/6z2rkvj8v3)에서 `from` 메서드는 `AbstractNode` 클래스로부터 떨어져 별도의 파일로 분리되었습니다. 문제는 해결되었지만 우리의 프로젝트와 API 구조는 달라졌습니다. 거대한 프로젝트에서는 이 방법을 사용하기 매우 어렵거나 불가능할 수도 있습니다! 예를 들어 추가 구현을 하면서 `Node#print` 메서드가 `Node` 나 `Leaf` 에 의존하는 경우가 생길 수도 있겠죠...

_보너스:_ [제가 이런 이상한 방법도 사용해봤습니다.](https://github.com/mobxjs/mobx/commit/f75812355d1529f237f7116ad56a199ae5a90252) 함수에서 기본 클래스를 리턴하고, 함수 호이스팅을 활용하여 원하는 순서대로 호출될 수 있도록 만듭니다. 이걸 어떻게 적절하게 설명해야 할지도 모르겠네요.

## 내부 모듈 패턴(Internal module pattern)으로 해결하기

저는 많은 프로젝트에 걸쳐 순환 참조 문제를 여러 번 겪었습니다. 제가 일하고 있는 [Mendix](https://medium.com/@Mendix)나, MobX, MobX-state-tree 를 비롯하여 일부 개인 프로젝트까지 포함해서요. 심지어 저는 몇년 전에 [스크립트를](https://github.com/mobxjs/mobx/blob/247c443fcf5210dabf4c850a6312e48c5f1d5d3b/scripts/single-file-build.sh#L17-L29) 짜서 모든 소스 파일을 이어붙인 다음 `import` 문을 없애버리는 방법도 써 봤습니다. 모듈 로딩 순서를 잡기 위한 흙수저판(poor man’s) 모듈 번들러였죠.

하지만 문제를 몇 번 해결하고 나서 하나의 패턴을 발견했습니다. 프로젝트를 재구성하거나 이상한 트릭을 쓰지 않고도 모듈 로딩 순서를 전부 컨트롤할 수 있는 방법이죠! 이 패턴은 제가 확인해본 어느 환경에서나 잘 동작했습니다. (Rollup, Webpack, Parcel, Node)

이 패턴의 핵심은 `index.js` 와 `internal.js` 파일입니다. 주요 규칙은 이렇습니다.

1.  `internal.js` 모듈은 프로젝트 전체의 로컬 모듈을 불러모은 다음 전부 내보내는 역할을 합니다.
2.  다른 모듈들은 모두 반드시 `internal.js` 파일만 불러와서 사용합니다. 다른 모듈을 직접적으로 불러오지 않도록 합니다.
3.  `index.js` 파일은 주요 시작점이 됩니다. `internal.js` 파일에서 내보낸 모든 모듈을 불러온 다음, 외부로 노출하고자 하는 것만 내보냅니다. 이 과정은 다른 사람들이 사용할 라이브러리를 배포할 때만 유효한 방법입니다. 따라서 이번 예제에서는 만들지 않고 넘어가겠습니다.

위의 규칙은 로컬 모듈에만 적용되어야 합니다. 외부 모듈 `import` 는 순환 참조 문제와 전혀 연관이 없기 때문에 그대로 두시면 됩니다. 우리의 데모 애플리케이션에 적용을 해보면 이렇게 바뀔겁니다.

```js
// -- app.js --
import { AbstractNode } from './internal'

/* 그대로 */

// -- internal.js --
export * from './AbstractNode'
export * from './Node'
export * from './Leaf'

// -- AbstractNode.js --
import { Node, Leaf } from './internal'

export class AbstractNode {
  /* 그대로 */
}

// -- Node.js --
import { AbstractNode } from './internal'

export class Node extends AbstractNode {
  /* 그대로 */
}

// -- Leaf.js --
import { AbstractNode } from './internal'

export class Leaf extends AbstractNode {
  /* as is */
}
```

이 패턴을 처음 적용하면 굉장히 어색하게 느껴지실겁니다. 하지만 익숙해지기만 하면 몇 가지 큰 이득을 얻을 수 있습니다!

1.  당연하지만 우리가 머리를 싸매던 문제가 해결되었습니다! [여기](https://codesandbox.io/s/oqro83jpk6)에 보이는 대로 우리의 앱은 아주 잘 돌아갑니다.
2.  문제가 해결된 이유는 _이제 우리가 모듈 로딩 순서를 완전히 통제할 수 있기 때문입니다_. `internal.js` 가 파일을 불러오는 것은 순서에 관계 없이 우리의 모듈 로딩 구조 안에 포함됩니다. (아래쪽의 그림을 참고하시거나 위에 말씀드린 모듈 로딩 순서에 대한 내용을 다시 살펴봐주세요)
3.  더 이상 `require(import)` 문을 파일의 바닥으로 옮기는 등 우리가 원치 않는 형태의 리팩터링이나 못생긴 트릭을 쓸 필요가 없습니다. 코드베이스의 설계나 API 를 고민할 때 타협할 필요도 없습니다.
4.  _보너스_ : 더 적은 파일을 불러올수록 `import` 구문도 훨씬 적어집니다. 예를 들어 지금 `AbstractNode.js` 는 오로지 하나의 `import` 문만 가지고 있습니다. 그 전에는 두개였지만요.
5.  _보너스_: `index.js` 를 통해 우리는 [유일한 중앙 자료(Single source of truth)](https://en.wikipedia.org/wiki/Single_source_of_truth)를 확보했습니다. 그리고 이를 이용해 외부로 내보내고자 하는 모듈을 조절할 수 있습니다.

![internal module pattern을 도입하고 나서 모듈 로딩 순서](https://cl.ly/0E0A3B44270E/fix-circular-dependency-4.png)

## 결론

지금까지 제가 최근에 순환 참조 문제를 해결하는 방법을 보셨습니다. 기존에 있는 프로젝트에 적용하시려면 `import` 문을 고치기 위한 작업이 좀 필요하실 겁니다. 하지만 이 단순하고 직관적인 방법을 적용하고 난 뒤에, 여러분들은 모듈 로딩 순서를 완전히 통제하고 앞으로도 발생할 수 있는 어떠한 순환 참조 문제도 해결할 수 있습니다. 위의 방법을 적용하기 위한 리팩터링 예시를 몇 개 보여드리자면

- [MobX](https://github.com/mobxjs/mobx/commit/e7f32aa0c2f6295b84270587285ab793b52d8643) (큰 변경점이었으나 직관적이라 별 문제가 안됨)
- [MobX-state-tree](https://github.com/mobxjs/mobx-state-tree/commit/5ae34850f026cab88da826ee97d4e0a623f25108) (파일 마지막의 `import` 문이 어떻게 제거되었는지 봐 주세요)
- 작은 [개인 프로젝트](https://github.com/mweststrate/remmi/commit/ea3db28dde500e6a61aae330b7abfcbcd5740efb)

아직까진 이 패턴을 라이브러리에만 적용해봤고 더 큰 프로젝트에 적용해보진 않았습니다. 하지만 거대한 프로젝트에는 순환 참조 문제가 발생하는 특정 하위 폴더에 패턴을 적용하여 별도의 라이브러리마냥 다룰 수 있을겁니다.

이 패턴이 잘 적용된다면 저한테도 알려주세요! 그리고 패턴을 좀 더 쉽게 도입하도록 도와주는 도구가 있다면 소개해주세요(힌트라도 좋습니다) :-)
