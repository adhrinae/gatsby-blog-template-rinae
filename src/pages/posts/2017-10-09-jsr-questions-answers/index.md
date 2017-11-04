---
path: "/posts/jsr-questions-answers"
date: "2017-10-09"
title: "Javascript Roadmap Questions - 답안"
category: "Javascript"
tags:
  - Javascript
---

[앞서 제시된 질문들](/posts/javascript-roadmap-questions)

질문을 번역한 이후 따로 공부를 위해 가볍게 온라인 스터디를 진행하여 서로 조사한 부분을 이야기하고, 참고할만한 링크가 있다면 첨부하는 형식의 스터디를 진행하였습니다.

작성된 내용 중에 오답이 있을 수도 있으니 참고용으로 봐 주시기 바라며, 보충 설명 혹은 수정을 요청하시려면 하단 프로필의 이메일로 요청 부탁드립니다. (중복된 문제에 대한 답안은 작성하지 않았습니다.)

## Baby phase

1. 자바스크립트의 6가지 기본(원시) 타입은? (ES6에서 한개 더 늘어나서 총 여섯개입니다)
	* `Null`, `Number`, `Boolean`, `String`, `Undefined`, `Symbol`
2. 자바스크립트에서 변수를 선언하고 할당하는 방법은?
	* `const`, `let`, `var` 를 쓰고 한칸 뒤에 변수명 선언, 할당은 `=` 를 선언한 변수 뒤에 붙이고 필요한 값을 넣는다.
3. `const`, `let`, `var` 로 변수를 선언할 때의 차이점은?
	* `const` - 재할당 불가능한 변수 선언. 블록 단위 스코프
	* `let` - 재할당 가능한 변수를 선언. 블록 단위 스코프
	* `var` - 자바스크립트 초기부터 변수를 선언하는 방법. 재할당 가능하며 함수 단위 스코프를 가짐
4. 아래의 연산자는 어떤 역할을 하는가?
	1. `+`
	2. `-`
	3. `*`
	4. `/`
	5. `%`
5. 아래의 비교연산자의 역할은?
	1. `===`
	2. `!==`
	3. `>`
	4. `>=`
	5. `<`
	6. `<=`
6. 다음의 조건문은 어떻게 사용하는가?
	1. `if`
	2. `if else`
	3. `else`
7. `for` 루프를 사용하는 방법은?
	* `for (let i; i < array.length; i++) {}`
	* `for in`, `for of(ES6)`, `array.forEach`
8. **배열(Array)**은 무엇인가?: 순서가 있는 데이터의 집합, 0부터 시작하는 인덱스
	1. 배열에 값을 넣는 방법은? - `array.push`
	2. 배열의 값을 불러오는 방법은? - `[]`, `array.indexOf`
	3. 배열의 값을 제거하는 방법은? - `array.pop`, `array.shift`, `array.splice`
	4. 배열의 모든 값을 순회하는 방법은? - `array.forEach`
9. **객체(Object)**란 무엇인가?: 프로퍼티(속성, key)를 가지고 **순서가 없는** 데이터의 집합
	1. 객체에 값을 넣는 방법은?: `obj['prop'] = value`, `obj.prop = value`
	2. 객체의 값을 불러오는 방법은?: `obj['prop']`, `obj.prop`
	3. 객체의 속성을 제거하는 방법은?: `delete`
	4. 객체의 모든 값을 순회하는 방법은?: `for in`, `Object.keys(obj).forEach(prop => obj[prop])`
	5. 객체의 메서드(method)란 무엇인가?: 객체의 프로퍼티가 함수인 것 -> 객체의 기능(행동)을 정의한 것
	6. 메서드를 정의하는 방법은?
		* 객체의 프로퍼티를 함수로 정의
		* `const obj = { method() {} }`
	7. 메서드를 호출/실행하는 방법은?: 객체의 값을 불러오면서 `()` 괄호를 붙여준다. 인자가 필요하다면 괄호 안에 인자를 넣는다.
10. **함수(Function)**란 무엇인가?: 하나의 단위로 실행되는 코드의 집합
	1. 함수를 정의하는 방법은?
		* 일반 함수 정의: `function func() {}`
		* 변수에 함수 할당: `const func = () => {}`
	2. 함수를 호출/실행하는 방법은?: 정의한 함수명 끝에 괄호`()`를 붙인다.
	3. 함수에 인수(arguments)를 전달하는 방법은?: 함수를 호출할 때 괄호 안에 인자를 쉼표로 구분지어 전달한다.
		* 함수를 호출할 때 - 인수(arguments)
		* 함수 안으로 넘겨진 것 - 매개변수(parameters)
	4. 함수 안에서 `return` 키워드는 어떤 역할을 하는가?: 함수를 즉시 종료하고 값을 반환한다. 이 값은 함수 호출의 값이 된다.

## Child phase

1. 자바스크립트의 스코프(Scope)란?: 현재 접근할 수 있는 변수들의 범위
	1. 왜 전역 변수를 최소화해야 하는가?
		* 소스와 데이터가 외부에 쉽게 노출된다
		* 비동기 로직의 구현을 용이하게 하고 잘 구분되게 한다. 비동기 로직을 실행하기 위한 변수가 글로벌에 있을 시 예상치 못한 동작이 발생할 우려가 있다.
		* 다양한 사양의 브라우징 환경에서 미리 정의된 글로벌 변수가 많을 수록 퍼포먼스에 영향을 미치게 된다.
	2. 클로저(Closure)란 무엇인가?: 특정 함수가 참조하는 변수들은 선언된 환경을 계속 유지하는데, 이 함수와 스코프를 묶어서 클로저라고 한다.
		* [Unikys :: 속깊은 자바스크립트 강좌 Closure 쉽게 이해하기/실용 예제 소스](http://unikys.tistory.com/309)
	3. 클로저를 왜 사용하는가?
		* (옛날) 자바스크립트의 스코프 문제를 해결하기 위한 방법 중 하나
		* private 변수를 활용해야 할 때 사용
		* 별도의 스코프를 가지지만 로직은 공유하는 객체를 생성
		* 반복적으로 같은 작업을 할 때, 같은 초기화 작업이 지속적으로 필요할 때, 콜백 함수에 동적인 데이터를 넘겨주고 싶을 때 활용
2. 콜백이란 무엇인가?: 함수에 인자로 전달하는 함수로 **함수를 실행한 뒤에** 실행하기 위해 사용
	1. 콜백을 어떻게 사용하는가?
		* 인자로 콜백(혹은 함수)를 받는 함수에 콜백 함수를 전달
	2. 콜백을 어떻게 작성하는가?
		* 그냥 함수를 작성한다. 인자가 필요하면 인자를 넣고.
	3. 콜백을 받아들이는 함수를 작성하는 방법은?
		* 함수를 작성하되, 인자로 함수를 받도록 하고 특정 시점에서 인자로 받은 함수를 실행한다.
		* `fn` 을 인자로 받았으면 `fn()`
	4. `setTimeout` 은 콜백을 받는 함수인가?: Yes
3. 비동기 자바스크립트
	1. 자바스크립트에서 **동기**와 **비동기**의 의미는 무엇인가?
		* 동기: 앞서 실행되고있는 작업이 끝날때까지 대기하고 다음 작업을 실행한다.
		* 비동기: 특정 작업이 실행되는데 시간이 더 걸린다면 나머지 작업을 먼저 수행하고, 그 특정 작업이 끝난 시점에 후속 처리를 한다.
	2. 자바스크립트로 **비동기** 코드를 작성하는 방법은?
		* `setTimeout`
		* Promise
		* async - await
		* Generators
	3. 이벤트 루프가 무엇인가?: 비동기 자바스크립트 이벤트가 처리되는 과정
	4. 이벤트 루프가 어떻게 동작하는가?: (브라우저의 경우) 콜스택에서 비동기 함수 호출 -> Web APIs에서 실행 완료를 대기 -> 콜백은 이벤트 큐에서 실행을 대기 -> 콜스택이 비면 실행 대기중인 이벤트 큐 가장 앞에 있는 콜백이 실행
4. DOM 메서드에 관한 질문들
	1. 엘리먼트(Element)란?: 페이지에서 HTML 태그로 나타나는 DOM 요소들
	2. 노드(Node)란?: 위의 엘리먼트와 중복으로 사용되는 용어지만 정확히는 엘리먼트보다 넓은 범위를 나타낸다. DOM API를 실행하기 위한 인터페이스의 모음이기도 하다.
	3. 엘리먼트를 선택하는 방법은?
		* `document.querySelector`, `document.getElementBy`
	4. 여러 엘리먼트를 선택하는 방법은?: `document.querySelectorAll`
	5. **모든 브라우저**에서 엘리먼트를 순회하는 방법은?: `document.createNodeIterator`
	6. 부모 엘리먼트를 선택하는 방법은?: `Node.parentNode`
	7. 형제 엘리먼트를 선택하는 방법은?: `Node.nextSibiling`, `Node.previousSibiling`
	8. 엘리먼트에 클래스를 추가/제거하는 방법은?: `element.classList.add`
	9. 엘리먼트에 특정 클래스가 있는지 확인하는 방법은?: `element.classList.contains`
	10. 어떤 상황에서 엘리먼트에 클래스를 추가하는가?: 특정 이벤트의 결과로 다른 스타일을 적용하고 싶을 때
	11. 엘리먼트에 속성을 추가/제거하는 방법은?: `element.setAttribute`, `element.removeAttribute`
	12. 엘리먼트에 특정 속성이 있는지 확인하는 방법은?: `element.hasAttribute`
	13. 어떤 상황에서 엘리먼트에 속성을 추가/제거하는가?: 특정 엘리먼트에 `active`, 혹은 `disabled` 같은 속성을 부여해서 엘리먼트 사용 자체를 제어할 수 있다.
	14. HTML 엘리먼트를 자바스크립트로 생성하는 방법은?: `document.createElement`
	15. 특정 엘리먼트 바로 앞에 새로운 엘리먼트를 생성하는 방법은? `Node.appendChild`
	16. 엘리먼트의 스타일을 변경하는 방법은?: `HTMLElement.style`
	17. 엘리먼트의 스타일을 자바스크립트로 바꾸어도 되는가? 왜 되는가/되지 않는가?: 그닥 권장하지 않는다. 자바스크립트로 스타일은 변경하는 경우 무조건 인라인 스타일로 지정되게 되는데 이러면 최상위 우선권을 갖기 때문에 기존에 지정된 CSS가 모두 제 기능을 못하는 경우가 생긴다.
	18. 엘리먼트의 내용을 가져오는 방법은?: `Node.textContent`, `element.innerHTML`
5. 이벤트
	1. 이벤트 리스너(Event listener)를 추가하는 방법은?: `element.addEventListener`
	2. 왜 이벤트 리스너를 추가하는가?: 정적 페이지만 보여주는 것이 아니라 DOM을 동적으로 제어 및 표현하기 위해
	3. 이벤트 리스너를 제거하는 방법은?: `EventTarget(element).removeEventListener`
	4. 언제 이벤트 리스너를 제거하는가? 왜 제거하는가?: 특정 DOM 엘리먼트의 사용 주기가 이벤트 리스너와 다르다면 메모리 누수를 방지하기 위해 이벤트 리스너를 제거한다.
	5. 자주 사용되는 마우스 이벤트의 종류는?: `click`, `mouseup`, `mousedown`
	6. 자주 사용되는 키보드 이벤트의 종류는?: `keydown`, `keyup`
	7. 자주 사용되는 폼(Form) 이벤트의 종류는?: `submit`, `reset`
	8. 이벤트 대상의 값을 가져오는 방법은?: `e.target.value`

## Teenage phase

1. OOP
	1. `this` 의 컨텍스트는 어떻게 바뀌는가? 얼마나 많은 컨텍스트가 있는가?
		* [this - JavaScript | MDN](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/this)
		* 함수가 호출되는 방법에 따라 결정된다.
		* 전역 컨텍스트: `window`
		* 객체의 메서드일 경우: 바로 가까이 있는 객체에 바인딩됨. 즉 객체가 계층화되어있을 경우에 유의해야함.
		* 프로토타입 체인에서: 해당 객체의 인스턴스
		* `call`, `apply`, `bind` 로 임의의 컨텍스트 지정 가능
		* 이벤트 핸들러: 이벤트가 발생한 타겟 자체
		* inline 이벤트 핸들러: 해당 DOM 엘리먼트
	2. 자바스크립트의 **프로토타입**이란 무엇인가?: 특정 객체의 원형을 의미
		* [쉽게 이해하는 자바스크립트 프로토타입 체인 : TOAST Meetup](http://meetup.toast.com/posts/104)
		* [Javascript 기초 - Object prototype 이해하기 |  Insanehong’s Incorrect Note](http://insanehong.kr/post/javascript-prototype/)
	3. 자바스크립트에서 객체를 생성하는 방법은?
		* `new` 생성자
		* `Object.create`
		* `{}`
	4. 모듈 패턴은 무엇이며 어떻게 사용하는가?
		* 모듈 단위로 소스를 나누어 의존성 파악을 용이하게 함.
		* [디자인 패턴 for javascript Module Pattern :: Yuby’s Lab.](http://yubylab.tistory.com/entry/%EB%94%94%EC%9E%90%EC%9D%B8-%ED%8C%A8%ED%84%B4-for-javascript-Module-Pattern)
	5. 팩토리 패턴은 무엇이며 어떻게 사용하는가?:  정해진 인자를 받아서 원하는 형태의 객체를 반환하는 패턴. 비슷한 객체를 반복해서 생성할 수 있도록 해 주며, 사용자가 구체적인 타입을 모르고도 객체를 생성할 수 있도록 해 준다.
		* [Javascript Pattern 요약 - 디자인 패턴 • Captain Pangyo](https://joshua1988.github.io/web_dev/javascript-pattern-design/)
2. 함수형 프로그래밍
	1. 불변성(Immutability)란 무엇인가?: 할당된 변수 혹은 값이 외부로 인해 변하지 않는 것 혹은 변하지 않도록 하는 것
	2. 배열의 어떤 메서드가 불변성을 가지고 있는가?: `slice`, `map`, `concat`, `filter`, `reduce` ...
	3. 자바스크립트의 객체를 직접 수정하지 않고 속성을 변경하는 방법은?: `Object.assign`
	4. 순수 함수(Pure function)란?
		* 같은 값을 입력하면 같은 값이 출력되는 함수
		* 부작용(Side effects)를 일으키지 않는 함수
		* 외부 상태 변화에 기대지 않는 함수
	5. 한 개의 함수는 얼마나 많은 행동을 담고 있는게 좋은가?: **Only One**
	6. 함수의 부작용(Side effects)이란?: 의도하던 함수의 기능 외에 부가적인 작업이 발생하는 것. 주로 외부 상태를 변경하는 일을 이야기한다.
	7. 순수 함수를 작성할 때 부작용을 다루는 방법은?: 불변성을 가진 함수를 사용하여 새로운 상태를 반환한다. / 모든 함수가 순수 함수가 되는것은 현실적으로 불가능하기 때문에 부작용을 다루는 함수는 구분해서 사용한다.
3. AJAX
	1. 자바스크립트 프라미스(Promise)란?: 콜백 문제를 해결하기 위한 객체로, 프로미스 기반 비동기적 함수를 호출하면 **성공**혹은 **실패**가 발생하는 상황에 따라 이어서 처리할 수 있게 해준다.
		* [Async vs Promise](https://engineering.huiseoul.com/async-vs-promise-11ea761a98c4)
		* [JavaScript 바보들을 위한 Promise 강의 - 도대체 Promise는 어떻게 쓰는거야? | 감성 프로그래밍](http://programmingsummaries.tistory.com/325)
	2. 프라미스를 연결하는 방법은?: 함수에서 Promise 인스턴스를 리턴한다. 그리고...
		* `.then()`
		* `.catch()`
	3. 프라미스를 사용할 때 에러를 처리하는 방법은?: 프로미스 객체를 생성하고 그 안에서 `reject` 를 리턴하도록 한다.
		* `return reject(new Error('Error message'))` => `.catch(err => {})`
	4. Fetch API를 사용하는 방법은?: `fetch('url').then(result => result.json()).then(json => ...)`
	5. CRUD란 무엇인가?: Create, Read, Update, Delete
	6. Github에서 자신의 저장소 목록을 가져오는 API를 어떻게 호출하는가?: `GET /user/repos`
4. Best practices
	1. 전역 변수를 피해야 하는 이유는?
	2. 비교 연산자에서 `==` 대신 `===` 를 사용해야 하는 이유는?:  `==` 는 자바스크립트 임의의 형 변환이 일어남
	3. 간결한 코드를 작성하기 위해 삼항연산자를 어떻게 사용하는가?: `bool ? true : false`
	4. 간결한 코드 작성을 돕는 ES6 기능은 무엇이 있는가?: Arrow function, Class, Object destructuring, Spread operator …
	5. 이벤트 버블링/캡처링이란?
		* 버블링: 특정 DOM에서 이벤트가 발생하면 가장 하위 DOM부터 상위의 부모 DOM으로 한단계씩 전파되는 것.
		* 캡처링: 최상위 부모 DOM부터 가장 하위의 DOM까지 부모에서부터 전파되는 것
	6. 이벤트 전달(delegate)이란?: 모든 DOM에 이벤트 리스너를 할당하기보다 하나의 부모 DOM에 이벤트 처리를 위임하도록 만드는 것
		* [Javascript EventDelegation](https://eclatant.github.io/2017-10-08/EventDelegation/)
	7. 이벤트 리스너를 제거하는 방법은? 언제 제거하는가?
