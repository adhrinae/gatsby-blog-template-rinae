---
path: '/posts/the-faster-you-unlearn-oop-the-better-for-you-and-your-software-kr'
date: '2018-12-25'
title: '[번역] OOP를 빨리 잊을 수록 여러분과 여러분의 소프트웨어에 좋습니다'
category: 'Object-Oriented Programming'
tags:
  - Translation
  - OOP
  - Programming
coverImageUrl: 'https://images.unsplash.com/photo-1514880448122-7e417213b996?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1953&q=80'
description: 'OOP를 향한 신랄한 비판 번역 (not about functional programming)'
---

## 번역 머리말

- [Dawid Ciężarkiewicz](https://dpc.pw/about) 의 [The faster you unlearn OOP, the better for you and your software](https://dpc.pw/the-faster-you-unlearn-oop-the-better-for-you-and-your-software) 를 번역한 글입니다.
- 여러 의견이 나오는 주제이니만큼 많은 피드백을 통해 더 좋은 지식 공유가 될 수 있기를 기대하며 번역하였습니다. 특정 프로그래밍 패러다임에 대한 무조건적인 비판 혹은 옹호를 위해 번역한 것이 아님을 미리 밝힙니다.

---

> 객체 지향 프로그래밍은 캘리포니아에서 시작 된 것 중 이례적으로 나쁜 아이디어입니다.  
> (Object-oriented programming is an exceptionally bad idea which could only have originated in California.)  
> -- Edsger W. Dijkstra  

그저 제 경험인지는 모르겠으나, 객체 지향 프로그래밍(이하 OOP)은 소프트웨어 엔지니어링에서 표준인 것처럼 가장 많이 활용되는 패러다임으로 보입니다. 일반적으로 온라인 자료의 영향을 받은 학생들에게 그렇게 인식되기도 하고, 의도하지 않았지만 자연스럽게 OOP를 적용한 사람들 덕분에 기본적인 패러다임이라고 인식되기도 했습니다.

저도 이 개념이 얼마나 압도적으로(succumbing) 사용되는지, 그리고 표면적으로 얼마나 대단해 보이는지는 알고 있습니다. 그런 주술을 깨고 OOP가 얼마나 무시무시한지, 왜 그런지 이해하는데 몇 년의 시간이 걸렸습니다. 이러한 관점 때문에 사람들이 OOP가 왜 틀렸는지, 그리고 그 대신 무엇을 해야 하는지 이해해야 한다는 강한 믿음을 가지게 되었습니다.

많은 사람이 이전부터 OOP의 문제에 대해 갑론을박한 내용이 있고, 그중에서 제가 좋아하는 글과 비디오 링크를 마지막에 첨부하겠습니다. 그때까진 제 개인 의견을 말씀드리고자 합니다.

## 데이터는 코드보다 중요하다

핵심만 생각해보면, 모든 소프트웨어는 특정 목표를 달성하기 위해 데이터를 조작하기 위해 만들어진 것이나 다름없습니다. 그 목표라는 게 데이터가 어떤 구조를 가져야 할지, 그리고 데이터의 구조화를 위해 어떤 코드가 필요할지 정의합니다.

이 부분은 굉장히 중요합니다. 그러니 다시 한번 말씀드리겠습니다. **목표 -> 데이터 설계(구조) -> 코드** 입니다. 여기서 어떠한 것도 이 순서를 바꿀 수 없습니다! 소프트웨어를 디자인할 때 언제나 무엇을 달성할지 먼저 생각하고 그다음에 최소한 가볍게라도 데이터를 설계하세요. 데이터 구조와 인프라스트럭처같이 목표를 효율적으로 달성하는 데 필요한 것들 말입니다. 목표가 바뀔 때면 설계를 변경하고, 그다음 코드를 바꾸세요.

제 경험상 OOP의 제일 큰 문제는 데이터 모델 설계를 무시하고 생각 없이 모든 것을 *객체로* 집어넣는 패턴을 쉽게 사용하게 한다는 겁니다. 그렇게 해서 얻는 이득이 모호한데 말이죠. 어떤 내용이 클래스로 치환될 것 같으면 클래스로 작성해버립니다. 내가 `Customer` 라는걸 구현해야 하던가? 그럼 `class Customer` 를 쓰고, 내가 렌더링 컨텍스트(rendering context)가 필요하던가? 그럼 `class RenderingContext` 클래스를 작성합니다.

좋은 데이터 설계를 다지는 대신에 개발자의 시선은 "좋은" 클래스를 만들고, 관계를 설정하고, 분류하고, 상속 계층을 설정하는 작업 등에 쏠립니다. 이런 일은 쓸모없는 노력일 뿐 아니라 실제로 아주 해롭습니다.

## 복잡하게 만들기를 권장한다

명시적으로 데이터를 설계할 때, 그 결과물은 일반적으로 목표를 달성하도록 돕는 최소한의 실행 가능한 자료구조의 모음이 됩니다. 추상 *클래스* 혹은 *객체* 등의 용어를 가지고 생각을 하고 있으면 어디까지 장황하고 복잡해질지 끝이 없습니다. [FizzBuzz Enterprise Edition](https://github.com/EnterpriseQualityCoding/FizzBuzzEnterpriseEdition) 을 보세요. (역주: [FizzBuzz 란 이런 알고리즘 문제입니다](https://dojang.io/mod/page/view.php?id=263)) 이렇게 간단한 문제가 OOP 방식으로 프로그램을 짰더니 엄청난 양의 코드가 되어버린 이유는 언제나 추상화할 구석이 남아있기 때문입니다.

OOP를 변호하는 사람들은 적절한 수준의 추상화를 유지해야 하는 개발자의 역량 문제라고 합니다. 그럴 수도 있겠죠. 하지만 실제로 OOP 프로그램들은 거대해지기만 하지 절대 줄어들지 않는 경향이 있습니다. OOP가 그렇게 하길 권장하니까요.

## 어디서나 그래프

OOP가 모든 것을 아주 작은 캡슐화 된 객체로 쪼개도록 하므로, 객체들의 참조(Reference)가 여기저기 퍼져나갑니다. OOP는 어디서나 많은 수의 인자 목록을 전달하거나 관련된 객체에 바로 접근하기 위해 참조를 붙들고 있으라고 합니다.

여러분의 `class Customer` 는 `class Order` 를 참조하고 있거나 그 반대일 겁니다. `class OrderManager` 는 모든 `Orders` 에 참조를 들고 있고, 따라서 직접적이진 않지만 `Customer` 의 참조와도 연결되어 있습니다. 모든 것들이 다른 것들을 가리키고 있으며, 시간이 지날수록 다른 객체들과 연결해야 하는 코드들이 늘어나게 됩니다.

> [당신은 바나나를 원했지만 실제로는 바나나를 들고 있는 고릴라와 정글 전체를 얻고 말았다.](https://www.johndcook.com/blog/2011/07/19/you-wanted-banana/)  
> (You wanted a banana but what you got was a gorilla holding the banana and the entire jungle.)  

잘 디자인된 데이터 스토어 대신에 OOP 프로젝트는 거대한 객체들의 스파게티 그래프가 되는 경향이 있습니다. 그 객체들이 서로를 가리키며 메서드는 많은 수의 인자 목록을 전달받게 되죠. 전달될 인자의 수를 줄이기 위해 `Context` 객체를 설계하기 시작하면 실제 위에서 본 **엔터프라이즈 수준의 소프트웨어** 를 작성하고 있다는 것을 깨닫게 될 겁니다.

## 횡단 관심사(Cross-cutting concerns)

대다수의 필수 코드는 그저 한 객체에서만 동작하지 않습니다. 실제로는 [횡단 관심사](https://ko.wikipedia.org/wiki/횡단_관심사)를 구현하고 있습니다. 예를 들자면 `class Player` 가 `hits()` 메서드로 `class Monster` 를 공격한다고 할 때, 데이터를 어디서 변형해야 할까요? `Monster` 의 `hp` 는 `Player` 의 `attackPower` 의 영향을 받아 줄어듭니다. `Player` 의 `xps` (경험치) 는 `Monster` 가 죽을 때 `Monster` 의 `level` 에 영향을 받아 증가합니다. 그렇다면 `Player.hits(Monster m)` 처럼 호출해야 할까요? 아니면 `Monster.isHitBy(Player p)` 처럼 호출해야 할까요? 여기다 `class Weapon` 이 끼어 있다면 `isHitBy` 같은 메서드에 인자로 넘겨주어야 할까요? 아니면 `Player` 에 `currentWeapon()` 게터(Getter)를 구현해야 할까요?

보시다시피 그저 3개의 상호작용하는 클래스로 만든 이 단순한 예제는 이미 일반적인 OOP의 악몽을 여실히 보여주고 있습니다. 간단한 데이터 변형을 하는데 이상하고, 배배 꼬인 메서드끼리 호출을 하게 만들고 있습니다. 그저 OOP 의 교리 중 하나인 캡슐화 때문에요. 여기다 상속 개념을 집어넣어 약간 양념을 치면 진부한 "엔터프라이즈급" 소프트웨어가 탄생합니다.

## 객체 캡슐화는 정신 분열증이다(Object encapsulation is schizophrenic)

[캡슐화](https://ko.wikipedia.org/wiki/캡슐화) 의 정의를 한번 살펴보죠.

> 캡슐화란 객체 지향 프로그래밍의 개념으로서 데이터와 데이터를 조작하는 함수를 엮어, 외부의 참조와 잘못된 사용으로부터 안전하게 보호하는 것을 의미한다. 데이터 캡슐화는 데이터를 숨기기 위한 중요한 OOP 개념으로 이어졌다.   
> (Encapsulation is an object-oriented programming concept that binds together the data and functions that manipulate the data, and that keeps both safe from outside interference and misuse. Data encapsulation led to the important OOP concept of data hiding.)  

의도는 좋습니다만, 현실적으로 과도하게 객체나 클래스가 사용된 곳에서 캡슐화를 하는 것은 종종 해당 객체의 모든 것을 나머지 전부와 격리하려는 코드로 이어집니다. 수많은 보일러플레이트를 만들게 되죠. 게터(getter), 세터(setter), 다중 생성자, 이상한 메서드들 모두 실제로는 거의 일어나지 않을 실수로부터 보호하기 위한 방책입니다. 그 실수라는 것도 막상 문제가 되지 않을 작은 규모일 때가 많고요. 비유하자면 왼쪽 주머니에 자물쇠를 넣고, 오른손이 아무것도 가져가지 않도록 하는 것과 같습니다.

오해하지 마세요. 제약을 거는 행위 자체는 좋습니다. 특히 [ADT(추상 자료형)](https://ko.wikipedia.org/wiki/추상_자료형) 에는 일반적으로 효과적인 방법입니다. 하지만 모든 객체 사이에 상호 참조가 있는 OOP에서 캡슐화는 종종 아무런 좋은 효과도 일으키지 못하고, 많은 클래스에 걸친 제약을 다루기도 어렵습니다.

제 의견을 말씀드리자면 클래스와 객체는 너무 나뉘어 있고, 제대로 '격리' 나 'API' 에 신경을 쓸 수 있는 지점은  "모듈" / "컴포넌트" / "라이브러리" 의 경계라고 생각합니다. 그리고 제 경험상 OOP(Java / Scala) 코드 베이스는 보통 모듈과 라이브러리가 시용되지 않는 경향이 있습니다. 개발자들은 어떤 클래스 묶음이 독립적이고, 재사용 가능하며 일관된 로직 단위를 이루는지 많은 생각을 하지 않고 각 클래스 주변에 경계를 만드는 데 초점을 맞추고 있습니다.

## 같은 데이터를 바라보는 여러 가지 방법이 있다

OOP는 경직된 데이터 구조를 요구합니다. 그리고 데이터 구조를 많은 논리적 객체로 쪼개고 연관된 행위(메서드)와 함께 객체 사이의 그래프를 구성합니다. 하지만 논리적으로 데이터를 다루는 방법을 여러 개 가지고 있는 것이 유용합니다.

만약 프로그램의 데이터가 표 같은 데이터 지향적인 형태로 저장되어 있다면, 같은 데이터 구조 위에서 각각 다른 방식으로 작동하는 두 개 이상의 모듈을 가질 수도 있습니다. 하지만 이 데이터가 메서드를 가진 객체 형태로 분리된다면 같은 데이터에 일괄적으로 접근할 수 있는 모듈을 구성할 수 없습니다.

이게 주로 [객체 관계형 임피던스 불일치(Object-relational impedance mismatch)](https://en.wikipedia.org/wiki/Object-relational_impedance_mismatch) 가 발생하는 원인입니다. (역주: 객체 관계형 임피던스 불일치는 OOP 언어 또는 OOP 스타일로 작성된 응용 프로그램이 관계형 데이터베이스 관리 시스템(RDBMS)과 함께 엮여 제공될 때 종종 접하게 되는 개념적 및 기술적 어려움의 모음입니다) 관계형 데이터 구조는 언제나 제일 나은 방법은 아니지만, 다른 패러다임의 방법을 다양하게 사용하며 데이터를 조작할 수 있을 만큼은 유연합니다. 하지만 빡빡한 OOP의 데이터 구성 방법은 다른 데이터 구조와 호환되지 않습니다.

## 나쁜 퍼포먼스

처음부터 올바른 데이터 설계를 하지 않은 채로 데이터를 작고 수많은 객체로 쪼개놓고, [간접 참조(Indirection)](https://en.wikipedia.org/wiki/Indirection) 와 포인터를 남발하다 보면 영 좋지 않은 런타임 퍼포먼스가 나옵니다. 당근빳다죠(Nuff said).

## 그럼 대신에 뭘 해야 하나?

저는 만능 해결책(silver bullet)이 있다고 생각하진 않습니다. 그래서 요즘 제가 일 할 때 코드를 작성하는 방법을 이야기로 풀어보겠습니다.

먼저 데이터를 깊게 고려하는 것부터 시작합니다. 무엇이 들어가고 나올지, 포맷은 어떻게 되고 크기는 어떨지 분석합니다. 런타임에 데이터가 어떻게 저장되고 유지되어야 할지, 어떤 동작이 지원되어야 하고 얼마나 빨라야 하는지(처리 속도, 지연 시간) 등을 생각합니다.

보통 이런 방식의 설계는 규모 있는 데이터를 가진 데이터베이스에 가깝습니다. 즉 `DataStore` 같은 객체가 데이터 쿼리나 저장하는 등 필요한 모든 동작을 API로 드러낸 형태가 됩니다. 데이터 자체는 ADT/PoD(Plain old Data) 형태를 가지며 데이터 레코드 사이의 모든 참조는 ID(숫자, uuid, 독립적인 해시)를 통해 이루어집니다. 내부 구조를 생각해보면(Under the hood) 일반적으로 관계형 데이터베이스와 매우 유사하거나 실제로 직접 연관되어 있기도 합니다. `Vector` 나 `HashMap` 는 인덱스나 ID로 대량의 데이터를 적용하고, 다른 자료 구조도 빠른 검색을 위해 "인덱스" 같은 걸 필요로 합니다. [LRU 캐시](http://bit.ly/2T3tQ6C)같은 다른 자료구조도 해당합니다.

실제 프로그램 로직의 대부분은 `DataStore`  같은 자료구조의 참조를 취하면서 필요한 동작을 실행하는 형태로 되어 있습니다. 저는 동시성과 멀티 스레딩을 위해 각기 다른 논리적 컴포넌트를 [액터(actor)](https://ko.wikipedia.org/wiki/행위자_모델) 스타일의 메시지 전달 방식으로 엮습니다. 액터의 예를 들자면 표준 스트림 리더, 입력된 데이터 처리기, 신뢰성 관리자, 게임 내부 상태 등을 말합니다. 이 "액터" 들은 스레드 풀로 구현될 수도 있고 파이프라인 요소로 구성될 수도 있습니다. 필요할 때면 자체적으로 `DataStore` 를 가지거나 다른 "액터" 와 공유할 수도 있습니다.

이런 설계는 제가 테스트를 더 쉽게 만들어주기도 합니다. `DataStore` 는 다형성을 통해 여러 구현체를 가질 수 있으며, 메시지로 통신하는 액터들은 별도로 인스턴스화 되고 테스트에서 작성한 순서대로 메시지를 보내면 그에 따라 움직입니다.

요점은 제 소프트웨어가 소비자나 주문과 같은 도메인 아래 움직인다고 해서 반드시 `Customer` 클래스와 그 안에 엮인 메서드가 필요한게 아니라는 겁니다. 오히려 그 반대입니다. `Customer` 라는 개념은 그저 하나 이상의 `DataStore` 에 있는 테이블 형태의 데이터 뭉치일 뿐이며 "비지니스 로직" 코드가 직접 데이터를 조작하는 겁니다.

## 더 읽어보기

소프트웨어 엔지니어링의 많은 부분에서 OOP에 대해 비판이 일어나는 것은 단순한 문제가 아닙니다. 여러분에게 제 시각을 명확하게 제공하거나 설득하는 데 실패했을 수도 있겠습니다. 이 주제에 대해 더 관심이 있으시다면 아래의 링크를 확인해주세요.

- Brian Will 이 OOP에 반대하며 꽤 중요한 점들을 짚어준 비디오가 두 개 있습니다 - [Object-Oriented Programming is Bad](https://www.youtube.com/watch?v=QM1iUe6IofM) 와 [Object-Oriented Programming is Garbage: 3800 SLOC example](https://www.youtube.com/watch?v=V6VP-2aIcSc) 입니다.
- [CppCon 2018: Stoyan Nikolov “OOP Is Dead, Long Live Data-oriented Design”](https://www.youtube.com/watch?v=yy8jQgmhbAU) - 이 영상에서 발표자는 아름답게 OOP 코드베이스를 파고들며 그 안의 문제를 지적합니다.
- [Arguments Against Oop on wiki c2.com](http://wiki.c2.com/?ArgumentsAgainstOop) - OOP 에 반하는 일반적인 논의 모음
- [Object Oriented Programming is an expensive disaster which must end by Lawrence Krubner](http://www.smashcompany.com/technology/object-oriented-programming-is-an-expensive-disaster-which-must-end) - 이 글은 길고(역주: 진짜 겁나게 깁니다) 많은 개념을 깊이 파고듭니다.

## 피드백

저는 이 글에 관한 코멘트와 링크 제보를 받고 있으며 아래에 내용을 추가하고자 합니다.
- [Simon Hardy-Francis's answer to Is C++ slower than C? If yes, is the difference significant? - Quora](https://www.quora.com/Is-C%2B%2B-slower-than-C-If-yes-is-the-difference-significant/answer/Simon-Hardy-Francis)

---

## 역주

이 글을 읽으신 모든 분들께 [아샬](https://twitter.com/ahastudio)님이 남기신 다음의 피드백을 같이 보시길 강력하게 권해드립니다. 글타래이기 때문에 트윗을 클릭하여 연결된 트윗을 다 보시면 됩니다.

<blockquote class="twitter-tweet" data-lang="ko"><p lang="ko" dir="ltr">“OOP를 빨리 잊을 수록 여러분과 여러분의 소프트웨어에 좋습니다”란 글에 대한 짧은 코멘트. <a href="https://t.co/pWixio8pm8">https://t.co/pWixio8pm8</a><br><br>1. 클래스가 해롭다고 하는데 특별한 논거가 없어서 공감하기도 어렵고 반론하기도 어려움. 클래스를 잘못 만드는 이유는 오히려 데이터 중심에서 못 벗어나서인 경우가 더 많음.</p>&mdash; Ashal aka JOKER (@ahastudio) <a href="https://twitter.com/ahastudio/status/1077247692223332353?ref_src=twsrc%5Etfw">2018년 12월 24일</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 
