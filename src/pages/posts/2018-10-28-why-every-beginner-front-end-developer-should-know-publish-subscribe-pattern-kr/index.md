---
path: '/posts/why-every-beginner-front-end-developer-should-know-publish-subscribe-pattern-kr'
date: '2018-10-28'
title: '[번역] 초보 프론트엔드 개발자들을 위한 Pub-Sub(Publish-Subscribe) 패턴을 알아보기'
category: 'Design Pattern'
tags:
  - Translation
  - Javascript
coverImageUrl: 'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=64a7f5e870e2c0286c20c3f8e5572927&auto=format&fit=crop&w=1953&q=80'
description: '비동기 자바스크립트 코드를 덜 괴롭게 이해하는 방법'
---

## 번역 머리말

- 이 글은 [Hubert Zub](https://softwarehut.com/blog/author/hubert-zub/)의 [Why every beginner front-end developer should know publish-subscribe pattern?](https://itnext.io/why-every-beginner-front-end-developer-should-know-publish-subscribe-pattern-72a12cd68d44)을 번역한 글입니다.
- 일부 삽화의 내용은 직접 번역하여 새로 첨부했습니다. 가독성에 문제가 있다면 피드백 부탁드립니다.

---

여러분이 처음 프론트엔드 개발을 배우고 나서 스타일이나 그리드 시스템 등 미적인 부분에만 집중을 하다가 비지니스 로직, 프레임워크 등을 공부하면서 본격적으로 자바스크립트 코드를 작성하기 시작할 때를 떠올려 보겠습니다.

![it starts...](https://cl.ly/036052db80a5/pub-sub-01.png)
[처음 시작은 이렇지만..]

이 시점에서 단순히 jQuery 트릭을 조금 쓰거나 시각적 효과 일부를 JS 로 구현하는 정도를 벗어나게 됩니다. 단순히 웹페이지가 아니라 **웹 애플리케이션** 을 만들기 위한 큰 그림을 그리게 되죠.

JS 코드를 작성하는데 많은 노력을 들이면서 상호작용, 세부 시스템이나 로직을 생각하기 시작하겠죠. 앱이 잘 동작하기 시작하면서 살아움직이는 듯한 기분이 듭니다. 완전히 새롭고 신나는 세계가 펼쳐집니다. 하지만 그러면서 새로운 문제를 마주하게 됩니다.

![it ends...](https://cl.ly/61b7363de936/pub-sub-01-2.png)
[...결국은 이렇게 끝이 납니다. 그리고 끝이 없어요!]

하지만 여러분은 실망하지 않습니다. 새로운 아이디어는 계속 떠오르고, 더욱 많은 코드를 작성합니다. 블로그 포스트에서 본 다양한 기술이나 방법론을 적용하고, 문제 해결을 위한 온갖 접근법들을 (어설프게나마) 주물럭거려봅니다.

그러다 갑자기 가려운 기분을 느끼기 시작합니다.

![feels itches](https://cl.ly/ae55fa6615d0/pub-sub-02.png)

처음 작성한 `script.js` 파일이 커지면서 한 시간 전에는 200 줄 정도였던 코드가 이제 500 줄이 넘어가기 시작했습니다. "흠, 별 문제는 아냐" 라고 생각합니다. 깔끔하고 유지보수가 용이한 코드에 대한 글을 읽어봤으니, 문제를 해결하기 위해 로직이나 블록, 컴포넌트별로 파일을 분리하기 시작합니다. 다시 그럴싸한 모양새의 프로젝트가 되었습니다. 모든 것은 꼼꼼하게 정리된 라이브러리처럼 보입니다. 여러 파일이 **적절하게 이름이 붙어있고 적절한 디렉토리에 있기 때문** 입니다.

코드는 모듈화하고 유지보수하기 좋게 되었는데도 갑자기 또 가려운 기분이 들기 시작합니다. 하지만 이번에는 뭐가 문제인지 잘 파악이 안됩니다.

---

웹 애플리케이션(웹 앱)은 선형적으로 동작하는 일이 거의 없습니다. 사실 어떤 웹 앱이든 많은 액션은 갑자기 (때로는 기대하지 않았을 때나 자발적으로) 발생합니다.

앱은 네트워크 이벤트, 사용자의 조작, 타이밍이 설정된 동작 등 여러 종류의 비동기적인 동작에 적절하게 응답해야 합니다. 그렇게 갑자기 "비동기" 와 "경합 상태" 라 불리는 괴물들이 문을 두드립니다.

![event flow](https://cl.ly/c5b573ef01c7/pub-sub-1-modified.png)

멋지게 모듈화된 코드가 비동기 코드라는 못난 배우자와 짝을 맺어야하는 상황이 되었습니다. 이제 가려운 기분이 어디서 오는지 명확해졌습니다. _"대체 이놈의 비동기 코드를 어느 부분에 두어야 하지?"_ 라고 어려운 질문이 고개를 들기 시작합니다.

지금 앱은 아름답게 블록 단위로 구성되어 있을 겁니다. 페이지 이동 및 컨텐츠를 구성하는 컴포넌트는 적절한 디렉토리에 깔끔하게 놓일 수 있고, 자그마한 헬퍼 스크립트 파일들은 코드를 반복해서 쓰지 않고 자잘한 일들을 처리할 수 있습니다. 모든 것은 `app.js` 라는 하나의 엔트리 파일로 관리되고 구동됩니다. 깔끔하죠.

하지만 여러분의 목표는 비동기 코드를 **앱의 한 부분에서 실행하여 처리하고 다른 부분으로 보내는 것입니다.**

비동기 코드가 UI 컴포넌트 안에 있어야 할까요? 아니면 메인 파일에? 앱의 어떤 부분에서 반응(reaction)을 다루는 책임을 가지고 있어야 할까요? 데이터 처리는? 에러 처리는? 마음속에서 다양한 접근 방식을 시도해보지만 불편한 기분은 가시지 않습니다. 앱을 더 확장하고 싶어도 쉽지 않으리라는 사실도 알고 알고 있습니다. 가려운 기분은 여전히 사라지지 않았고, 더 이상적이고 다양한 상황에 대응 가능한 해답이 필요해졌습니다.

> 안심하세요. 여러분이 뭘 잘못한 것은 아닙니다. 사실 더 구조화될수록 생각을 할 수록 가려운 기분은 더욱 심해지게 됩니다.

이제 위의 문제를 해결하기 위한 글을 찾아서 읽어보거나 이미 준비된 솔루션들을 찾아보게 됩니다. 처음에는 프라미스(Promise)가 콜백보다 낫다는 글을 보게 되고, 그 다음에는 RxJS 가 무엇인지 이해하려고 머리를 싸매게 됩니다(그리고 인터넷의 어떤 사람이 "RxJS 는 인류가 웹 개발을 하는데 있어 정당한 구원자" 라고 주장하는 이유를 찾기도 합니다). 더 많은 글을 읽다 보니 왜 어떤 사람은 `redux` 를 `redux-thunk` 없이 쓴다는건 말이 안된다고 이야기하고, 다른 사람은 `redux-saga` 를 가지고 똑같은 소리를 하는지 이해하려고 아둥바둥하게 됩니다.

결국에는 혼란스러운 말들만 머리 속에 가득 차서 두통이 생길 지경이 되었습니다. 문제 해결을 위한 방대한 양의 접근 방법 때문에 멘탈은 터져나갈 것 같고요. 왜 이렇게 많은 방법이 있는걸까요? 좀 쉽게 해결할 수 없을까요? 아니면 인터넷에 있는 사람들이 하나의 좋은 패턴을 사용하는 대신에 치고박고 싸우는 것을 좋아하는 걸까요?

이 주제가 사소하지 않기 때문입니다.

> 어떤 프레임워크를 사용하더라도, 비동기 코드를 적절하게 배치하는 일은 지금도, 앞으로도 결코 간단하지 않을 것입니다. 모든 목적에 부합하는 하나의 완성된 솔루션은 존재하지 않습니다. 요구사항, 환경, 필요로 하는 결과 등 다양한 요소에 크게 달라지기 때문입니다.

그리고 이 글을 통해 모든 문제를 해결하는 완벽한 방법을 제공하는 것도 아닙니다. 하지만 여러분들이 비동기 코드를 조금 더 쉽게 생각할 수 있도록 도움이 되었으면 합니다. 왜냐면 위에 나온 모든 기술들은 아주 간단한 원칙을 기반으로 하고 있기 때문입니다.

---

## 공통적인 부분

특정한 관점에서, 프로그래밍 언어들은 구조적으로 복잡하게 되어있지 않습니다. 어쨌든 값을 어딘가에 저장하고 `if` 문들이나 함수 호출을 통해 흐름을 제어하여 계산을 처리해주는 단순한 기계들(dumb calculator-like machines)에 불과합니다. 명령형이면서 약간은 객체지향형인 언어*(역주: 그리고 함수형)*로서 자바스크립트도 저 기계들의 한 종류에 불과합니다.

말인 즉슨 기본적으로 모든 비동기 세계에서 나온 물건들은 (redux-saga 건, RxJS 건, observable 이나 또 다른 변종이던) 반드시 같은 기본 원리에 의존한다는 뜻입니다. 이 라이브러리들의 마법같아 보이는 동작은 실제로 마법이 아닙니다. 그저 잘 알려진 기초 위에 만들어졌으며, 아주 심층적인 부분은 새로 발명된 것이 아닙니다.

이 사실을 아는게 뭐가 그리 중요할까요? 예를 한번 들어보겠습니다.

---

## 뭔가 만들어(그리고 부숴)봅시다

아주 간단한 애플리케이션을 생각해봅시다. _아주 간단한_ 걸로요. 예를 들어 지도에 우리가 제일 좋아하는 장소를 표시해 두는 작은 앱이 있습니다. 특별히 대단한 구석은 없어요. 그냥 오른쪽에는 지도가 있고 왼쪽에는 단순히 사이드바가 있는 형태입니다. 지도를 클릭하면 그 위에 새로운 마커가 표시됩니다.

![what we are going to build](https://cl.ly/c285ab16c86f/pub-sub-03.png)

물론 약간 욕심을 가지고 조금 기능을 추가할 예정입니다. 점찍어둔 장소의 리스트를 로컬 스토리지에 저장하려 합니다.

이제 세부 사항을 기반으로 앱의 기본적인 동작 흐름을 차트로 그려보겠습니다.

![our first user story](https://cl.ly/4a2966b1b79a/pub-sub-2-modified.png)

보시다시피 그리 복잡하진 않을겁니다.

> 튜토리얼을 간략히 하기 위해 아래의 예는 어떠한 프레임워크나 UI 라이브러리도 사용하지 않을 예정입니다. 그저 바닐라 자바스크립트만 들어있습니다. 그리고 Google Maps API 를 일부 사용합니다. 비슷한 앱을 직접 만들고자 하시면 [이 링크를 통해](https://cloud.google.com/maps-platform/#get-started) API 키를 등록하셔야 합니다.

자 그러면 코딩을 좀 해서 간단한 프로토타입을 만들어보겠습니다.

```javascript
/* map.js */
let googleMap;
let myPlaces = [];

function init() {
  googleMap = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 0, lng: 0 },
    zoom: 3
  });

  googleMap.markerList = [];
  googleMap.addListener('click', addPlace);

  const placesFromLocalstorage = JSON.parse(localStorage.getItem('myPlaces'));
  // localStorage에 뭔가 있으면 현재 장소 리스트로 설정한다
  if (Array.isArray(placesFromLocalstorage)) {
    myPlaces = placesFromLocalstorage;
    renderMarkers();
  }
}

function addPlace(event) {
  myPlaces.push({
    position: event.latLng
  });

  // 마커가 추가되면 랜더링하면서 localStorage와 동기화한다
  localStorage.setItem('myPlaces', JSON.stringify(myPlaces));
  renderMarkers();
}

function renderMarkers() {
  googleMap.markerList.forEach(m => m.setMap(null)); // 모든 마커 제거
  googleMap.markerList = [];

  // myPlaces 배열의 요소를 기반으로 마커를 추가한다
  myPlaces.forEach(place => {
    const marker = new google.maps.Marker({
      position: place.position,
      map: googleMap
    });

    googleMap.markerList.push(marker);
  }):
}

init();
```

잽싸게 분석해봅시다.

- `init()` 함수는 Google Maps API 를 사용하여 지도를 활성화하고, 지도에 클릭 액션을 설정한 뒤 `localStorage` 에 있는 마커들을 불러오려 합니다.
- `addPlace()` 는 지도를 클릭할 때 리스트에 새로운 장소를 추가하고 마커 랜더링을 실행합니다.
- `renderMarkers()` 는 배열 안에 있는 장소들을 순회하여 지도를 정리한 다음에 그 위에 마커를 그립니다.

좀 불완전해 보이는 부분은 잠시 치워두겠습니다(몽키 패칭이라거나, 에러 처리가 없다거나). 이정도면 충분히 깔끔하게 프로토타입 역할을 합니다. 이제 마크업을 좀 추가하겠습니다.

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Favorite Places</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <div class="sidebar">
    <h1>My fav places on earth v1.0</h1>
    <!-- footer를 여기에 둔다 -->
  </div>
  <div class="main-content-area">
    <div id="map"></div>
  </div>
  <script src="https://maps.googleapis.com/maps/api/js?key=API_KEY_HERE"></script>
  <script src="map.js"></script>
</body>
</html>
```

약간의 스타일을 추가했다고 가정하고 만들었습니다. (스타일은 이번 글에 직접적인 관련은 없으므로 따로 올리지 않겠습니다.) 믿거나 말거나 이 앱은 제대로 동작합니다.

![first app prototype](https://cl.ly/ed0cfb9df8b4/pub-sub-04.png)

좀 못생겼지만 잘 동작합니다. **하지만 확장할 수가 없습니다.** 아이고야.

먼저, 함수들의 책임이 서로 뒤섞여있습니다. [SOLID 원칙](http://bit.ly/2Ptbaiw)에 대해 들어보신 적 있다면, 벌써부터 [단일 책임 원칙](https://ko.wikipedia.org/wiki/단일_책임_원칙)을 위배하고 있다는 것을 이미 파악하셨을 겁니다. 예제 코드 자체는 단순하지만 하나의 코드 파일이 사용자 액션과 데이터 다루기, 그리고 동기화를 모두 담당하고 있습니다. 이렇게 하면 안 됩니다. 왜냐고요? _에이, 그래도 잘 동작 하잖아요_ 라고 할 수도 있겠습니다. 하지만 다음에 추가할 기능을 생각해보면 유지보수하기 아주 어려운 형태입니다.

다른 방식으로 설득해보겠습니다. 우리가 앱을 확장하여 아래와 같은 새 기능을 추가한다고 합시다.

![what we are going to build next](https://cl.ly/d20eba6d7fbd/pub-sub-05.png)

첫 번째로 우리는 사이드바에 표시 된 장소들의 리스트를 놓고, 두 번째로 Google API 를 사용하여 도시 이름을 표시하고 싶습니다. 여기서 비동기 메커니즘(동작 원리, mechanism)이 사용됩니다.

그러면 새로운 플로우차트는 이렇게 됩니다.

![next user story](https://cl.ly/fced73ac4cb7/pub-sub-3-modified.png)
[참고: 도시 이름을 찾는 방법은 아주 어려운게 아닙니다. 아주 쉬운 Google Maps API 가 제공됩니다. [여기서 확인해보세요!](https://developers.google.com/maps/documentation/geocoding/intro#ReverseGeocoding)]

Google API 로 도시 이름을 가져올 때 주요한 특징이 있습니다. **즉시 가져오는게 아니라는 겁니다.** Google 의 자바스크립트 라이브러리에서 적절한 서비스를 호출하면 응답이 돌아올 때까지 약간의 시간이 걸립니다. 덕분에 조금 혼란스럽지만, 배우는데 확실히 도움이 되는 문제가 나타났습니다.

UI 이야기로 돌아가서 확실히 보이는 문제를 하나 짚어보겠습니다. 보기에는 두 개로 나뉜 인터페이스 영역이 있습니다. 사이드바와 메인 컨텐츠 영역입니다. 절대로 둘을 한꺼번에 다루는 **거대한 코드 덩어리 하나만 작성하면 안됩니다.** 이유는 명백합니다. 만약 시간이 조금 흘러 네 개의 컴포넌트를 만들어야 한다면? 아니면 여섯 개? 백 개가 된다면? 그러므로 코드를 조각조각 나누어야 합니다. 아래의 방식으로 자바스크립트 파일을 두 개로 나눌 것입니다. 하나는 사이드바를 담당하고, 다른 하나는 지도 부분을 담당합니다. 그런데 어떤 파일이 지역을 담아놓는 배열을 다루어야 할까요?

![data handling approaches](https://cl.ly/9f1abbcd0705/pub-sub4.png)

어떤 접근 방식이 더 옳을까요? 첫 번째일까요, 두 번째일까요? 사실 답은 **둘 다 아닙니다.** 단일 책임 원칙 기억나시죠? 깔끔하고 모듈화된 (그리고 멋진) 코드를 유지하기 위해서 어딘가 다른 곳에 관심사(concerns)를 분리하고 데이터 로직을 두어야 합니다. 이렇게요.

![valid data handling approach](https://cl.ly/7d82de5e7328/pub-sub5.png)

코드 분리의 성배(Holy grail)가 완성되었습니다. _(역주: 원글 작성자가 성배라는 표현을 사용한 것은 아마 [이 용어 사용](http://bit.ly/2RjISUZ)에서 따온 것과 유사하다고 생각합니다)_ 데이터를 저장하고 다루는 로직을 다른 파일로 옮길 수 있게 되었습니다. 이 서비스 파일은 로컬 스토리지와 동기화를 하는 등의 매커니즘과 관심사를 다루는 책임을 가지게 됩니다. 그 반대로 컴포넌트들은 오로지 인터페이스 부분만 담당하게 됩니다. 말 그대로 단단한 구조(SOLID)를 이루었네요. 이제 설명한 패턴을 코드에 적용해보겠습니다.

**데이터 서비스 파일**

```javascript
/* dataService.js */
let myPlaces = [];
const geocoder = new google.maps.Geocoder();

export function addPlace(latLng) {
  // Google API 를 실행하여 도시 이름을 검색한다.
  // 두 번째 인자는 요청한 결과에 따른 응답이 왔을 때 처리를 담당하는 콜백 함수
  geocoder.geocode({ location: latLng }, function(results) {
    try {
      // 콜백 안에서 결과에 따른 도시 이름을 추출한다
      const cityName = results
        .find(result => result.types.includes('locality'))
        .address_components[0]
        .long_name;

      // 그리고 우리가 준비해놓은 변수에 집어넣는다
      myPlaces.push({ position: latLng, name: cityName });

      // 그 다음 localStorage와 동기화한다
      localStorage.setItem('myPlaces', JSON.stringify(myPlaces));
    } catch (e) {
      // 도시를 찾을 수 없을 때 콘솔에 메세지를 출력한다
      console.error('No city found in this location! :(');
    }
  });
}

// 현재 가지고 있는 장소의 목록을 출력
export function getPlaces() {
  return myPlaces;
}

// localStorage에 있는 정보를 꺼내 콜렉션에 넣는 함수
function initLocalStorage() {
  const placesFromLocalStorage = JSON.parse(localStorage.getItem('myPlaces'));
  if (Array.isArray(placesFromLocalStorage)) {
    myPlaces = placesFromLocalStorage;
    publish(); // 지금은 만들어지지 않은 함수. 나중에 적용될 예정
  }
}

initLocalStorage();
```

**맵 컴포넌트 파일**

```javascript
/* map.js */
let googleMap;

import { addPlace, getPlaces } from './dataService.js';

function init() {
  googleMap = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 0, lng: 0 },
    zoom: 3
  });

  googleMap.markerList = [];
  googleMap.addListener('click', addMarker);
}

function addMarker(event) {
  addPlace(event.latLng);
  renderMarkers();
}

function renderMarkers() {
  googleMap.markerList.forEach(m => m.setMap(null)); // 모든 마커 제거
  googleMap.markerList = [];

  // myPlaces 배열의 요소를 기반으로 마커를 추가한다
  getPlaces().forEach(place => {
    const marker = new google.maps.Marker({
      position: place.position,
      map: googleMap
    });

    googleMap.markerList.push(marker);
  });
}

init();
```

**사이드바 컴포넌트 파일**

```javascript
/* sidebar.js */
import { getPlaces } from './dataService.js';

function renderCities() {
  // 도시 목록을 표현하기 위한 DOM 엘리먼트를 가져온다
  const cityListElement = document.getElementById('citiesList');

  // 먼저 클리어 하고
  cityListElement.innerHTML = '';

  // forEach 함수를 써서 하나씩 다시 리스트를 그려낸다.
  getPlaces().forEach(place => {
    const cityElement = document.createElement('div');
    cityElement.innerText = place.name;
    cityListElement.appendChild(cityElement);
  });
}

renderCities();
```

이제 우리를 가렵게 만들었던 큰 부분은 사라졌습니다. 코드는 다시 깔끔하게 알맞은 위치에 놓였습니다. 하지만 무작정 기뻐하지 말고 코드를 한번 실행시켜 봅시다.

…이런  
_어떤 액션을 실행해도 인터페이스가 반응하지 않네요._

왜 그럴까요? 음, 아직 동기화에 관련된 어떤 것도 구현하지 않았습니다. 불러온 함수를 사용하여 장소를 추가하고 장소가 추가되었다는 신호를 어디에도 보내지 않았습니다. 또한 `addPlaces()` 함수를 실행하고 바로 뒤에 `getPlaces()` 함수를 실행하도록 하지도 않았습니다. 왜냐면 도시 이름을 찾는 기능은 비동기적으로 동작하여 약간 시간이 걸리기 때문입니다.

뭔가 뒤에서 돌아가는데 인터페이스는 그 결과를 모르고 있습니다. 마커는 지도에 추가되더라도 사이드바에는 어떠한 변화도 일어나지 않고 있습니다. 어떻게 이 문제를 해결해야 할까요?

아주 간단한 방법은 주기적으로 서비스에 자료를 요청하는(poll) 겁니다. 예를 들어 모든 컴포넌트가 서비스로부터 매 초마다 자료를 가져오도록 만들 수도 있겠지요. 이렇게요.

```javascript
// ...
setInterval(() => {
  renderCities();
}, 1000);
// ...
```

어떻게든 작동은 하겠지만 최선의 방법일까요? 전혀 그렇지 않죠. 대부분의 경우 특별한 영향을 주지도 않는 액션으로 앱의 이벤트 루프를 가득 채우고 있습니다.

보통 여러분은 우편물이나 택배가 도착했는지 확인하려고 매 시간마다 우체국에 들르지 않습니다. 비슷하게 자동차 수리를 맡겨놓았다면 정비공에게 매 30 분마다 수리가 완료되었는지 전화를 하지도 않습니다. (최소한 여러분이 그런 사람이 아니길 바랍니다) 대신 전화가 오는 것을 기다립니다. 부탁한 일이 마무리되었을 때 정비공은 어떻게 우리에게 전화를 할 수 있을까요? 당연하게도 정비공에게 우리의 전화번호를 남겨 놓았기 때문입니다.

이제 “우리의 전화번호를 남겨 둔다” 는 비유를 자바스크립트 안에서 실현해보겠습니다.

---

자바스크립트는 굉장히 근사한 언어입니다. 한 가지 독특한 특징은 함수를 여느 다른 값들과 같이 취급한다는 것입니다. 전문적인 표현으로 “함수는 [일급 객체(first-class citizens)](https://medium.com/@lazysoul/functional-programming-에서-1급-객체란-ba1aeb048059)이다” 라고 합니다. 어떠한 함수도 변수에 할당할 수 있고, 다른 함수의 인자로 넘길 수 있다는 뜻입니다. 이미 이런 동작방식을 알고 있으리라 생각합니다. `setTimeout`, `setInterval` 같은 함수 혹은 다양한 이벤트 리스너가 콜백을 받는 것을 기억하시나요? 그런 방식이 함수를 인자로 사용하는 대표적인 예입니다.

**이 특징이 바로 비동기 시나리오 처리의 기본이 됩니다.**

UI 를 업데이트하는 함수를 정의하고 완전히 다른 부분으로 전달한 뒤에 호출되도록 만들 수 있는겁니다.

![pub-sub pattern](https://cl.ly/d5c1b227bc36/pub-sub6.png)

이 매커니즘을 사용하여 `renderCities` 함수를 `dataService` 어딘가로 전달할 수 있습니다. 그리고 필요할 때 실행되도록 만들면 되는거죠. 어쨌든 서비스는 언제 데이터가 컴포넌트로 전달되어야 할지 정확히 알고 있으니까요.

까짓거 한 번 해보죠! 서비스 쪽에 함수를 기억할 수 있는 공간을 마련해두고 특정한 시점에 실행되도록 만들어보겠습니다.

```javascript{3,5-7,20-22}
/* dataService.js */
// ...
let changeListener = null;

export function subscribe(callbackFunction) {
  changeListener = callbackFunction;
}

export function addPlace(latLng) {
  geocoder.geocode({ location: latLng }, function(results) {
    try {
      const cityName = results
        .find(result => result.types.includes('locality'))
        .address_components[0]
        .long_name;

      myPlaces.push({ position: latLng, name: cityName });

      // 추가된 부분
      if (changeListener) {
        changeListener();
      }

      localStorage.setItem('myPlaces', JSON.stringify(myPlaces));
    } catch (e) {
      console.error('No city found in this location! :(');
    }
  });
}
// ...
```

그리고 사이드바쪽 코드에 추가합니다.

```javascript
/* sidebar.js */
import { getPlaces, subscribe } from './dataService';
// ...
renderCities();
subscribe(renderCities);
```

어떻게 동작하는지 보이시나요? 사이드바를 다루는 코드가 실행되면서 **`renderCities` 함수를 `dataService` 안에 등록했습니다.**

그리고 `dataService` 는 실행 될 필요가 있을 때 실행됩니다. 이 경우에는 **데이터가 변경되었을 때** (`addPlaces()` 함수가 호출되면서) 실행됩니다.

정확히 말씀드리면, 코드의 한 부분은 이벤트의 **수신자(SUBSCRIBER, 여기서는 사이드바 컴포넌트)** 가 되고, 다른 한 부분은 **발행자(PUBLISHER, 서비스 메서드)** 가 됩니다. 짠짜짠, 우리는 발행-구독 패턴(publish-subscribe pattern)의 가장 기본적인 형태를 구현했습니다. 이 패턴이 거의 모든 고급 비동기 처리 방식의 기본 개념이 되지요.

더 살펴볼 게 있을까요?

지금 구현된 코드로는 오로지 하나의 컴포넌트만 데이터 처리 결과를 수신할 수 있습니다. (다른 말로는 하나의 수신자만 있다는 뜻입니다) 만약 다른 함수를 `subscribe()` 함수에 넘기게 되면 현재 설정된 `changeListener` 를 덮어쓰게 됩니다. 이 문제를 해결하기 위해 배열로 바꾸어서 함수를 받도록 처리하겠습니다.

```javascript
/* dataService.js */
// ...
let changeListeners = [];

export function subscribe(callbackFunction) {
  changeListeners.push(callbackFunction);
}
// ...
```

이제 코드를 좀 정리하고 모든 리스너를 실행하는 함수를 작성하겠습니다.

```javascript{3-5,18}
/* dataService.js */
// 위에 작성한 코드 바로 아래에
function publish() {
  changeListeners.forEach(changeListener => changeListener());
}

export function addPlace(latLng) {
  geocoder.geocode({ location: latLng }, function(results) {
    try {
      const cityName = results
        .find(result => result.types.includes('locality'))
        .address_components[0]
        .long_name;

      myPlaces.push({ position: latLng, name: cityName });

      // 변경된 부분
      publish();

      localStorage.setItem('myPlaces', JSON.stringify(myPlaces));
    } catch (e) {
      console.error('No city found in this location! :(');
    }
  })
}
```

이런 방식으로 `map.js` 컴포넌트가 서비스에서 일어난 모든 액션에 반응할 수 있도록 연결할 수 있습니다.

```javascript
/* map.js */
import { addPlace, getPlaces, subscribe } from './dataService';

let googleMap;
// ...
init();
renderMarkers();

subscribe(renderMarkers);
```

수신자를 데이터를 전송하는데 사용하려면 어떻게 해야할까요? 이런 식으로 _리스너에 직접 인자로_ 전달해 줄 수 있습니다.

```javascript{2-4,16}
/* dataService.js */
function publish(data) {
  changeListeners.forEach(changeListener => changeListener(data));
}
// ...
export function addPlace(latLng) {
  geocoder.geocode({location: latLng}, function(results) {
    try {
      const cityName = results
        .find(result => result.types.includes('locality'))
        .address_components[0]
        .long_name;

      myPlaces.push({position: latLng, name: cityName});

      publish(myPlaces);
      // ...
    }
  // ...
}
```

이렇게 하면 쉽게 컴포넌트에 데이터를 전달할 수 있습니다.

```javascript{4,10,18}
/* sidebar.js */
import { getPlaces, subscribe } from './dataService';

function renderCities(placesArray) {
  const cityListElement = document.getElementById('citiesList');

  cityListElement.innerHTML = '';

  // getPlaces 함수 호출을 placesArray로 교체
  placesArray.forEach(place => {
    const cityElement = document.createElement('div');
    cityElement.innerText = place.name;
    cityListElement.appendChild(cityElement);
  });
}

// 초기 값으로 getPlaces() 전달
renderCities(getPlaces());

subscribe(renderCities);
```

이렇게 다양한 활용 방법이 있습니다. 다른 액션을 처리하기 위해 새로운 주제(혹은 채널)을 만들 수도 있습니다. 마찬가지로 `publish` 와 `subscribe` 함수를 전혀 다른 코드 파일로 분리하여 활용할 수도 있습니다. 하지만 지금 단계에선 그렇게 하지 않아도 충분합니다. 아래의 영상은 여태 작성한 예제로 만들어진 앱을 시연하는 영상입니다.

<iframe width="560" height="315" src="https://www.youtube.com/embed/unSv4BkIbQs" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

---

여태까지 살펴 본 발행-구독 패턴이 원래 알고 있던 듯한 기분이 들지 않나요? 조금 더 생각을 해 보면 여태 사용해왔던 `element.addEventListener(action, callback)` 의 형태와 상당히 유사한 작동 원리를 가지고 있습니다. 특정 이벤트에 어떤 함수를 **구독하도록** 만들고, DOM 요소에 의해 액션이 **발행되면** 그 함수가 호출되는 거죠. 똑같네요.

제목을 되짚어보면, _왜 이 패턴이 오지게(bloody) 중요한걸까요?_ 장기적으로 바라보면 바닐라 자바스크립트를 고수하면서 수동으로 DOM 을 수정하는 일은 거의 의미가 없습니다. 이벤트를 전달하고 수신하는데 수동으로 제어하는 매커니즘과 유사하죠. 다양한 프레임워크들은 이미 사용하고 있는 솔루션이 있습니다. 앵귤러는 RxJS 를 사용하고, 리액트는 state-props 기반으로 하며 Redux 를 사용하여 이 구조를 강화할 수도 있고요. 말 그대로 쓸만한 모든 라이브러리나 프레임워크들이 각자의 데이터 동기화 방법을 가지고 있습니다.

솔직히 이야기하자면 **위의 모든 것들이 발행-수신 패턴(Pub-Sub Pattern)의 다양한 변종을 사용하고 있습니다.**

이미 이야기했듯이 DOM 이벤트 리스너는 UI 액션을 **발행하고** **구독하는** 정도에 불과합니다. 조금 더 나아가서 `Promise` 는 뭘까요? 특정 관점에서 바라보면 단순히 우리가 미뤄둔 어떠한 액션이 완료되는 것을 **구독할 수 있게 하고**, 데이터가 준비되면 **발행하는** 것입니다.

리액트의 state 와 props 가 변경되는 것은 어떨까요? 컴포넌트들이 업데이트 되는 원리는 데이터 변화를 **구독하는** 것입니다. 웹소켓의 `on()` 은요? Fetch API 는? 특정한 네트워크 액션을 **구독하는** 것이죠. 리덕스? 이건 스토어의 변화를 **구독하도록** 하죠. 그렇다면 RxJS 는? 말 할 것도 없이 하나의 거대한 **구독** 패턴입니다.

모두 같은 원리를 가지고 있습니다. 그 뒤에 마법의 유니콘같은게 숨어있는 것도 아니고요. 뻔한 시트콤 엔딩이나 마찬가집니다*(역주: ending of the Scooby-Doo episode 라는 표현이 사용되었지만 맥락 상 뻔하다는 표현에 중점을 두었습니다)*.

![we are not afraid of async anymore](https://cl.ly/29ed2443d69d/pub-sub-06.png)

대단한 발견은 아니지만 꼭 알아두면 좋습니다.

> 어떠한 비동기 처리 방법을 사용하든지, 언제나 같은 패턴의 변종일 뿐입니다. 무언가는 구독을 하고, 무언가는 발행을 하는거죠.

그렇기 때문에 이 개념이 필수요소라고 말씀드리는 겁니다. 언제나 발행과 구독에 대해 생각할 수 있습니다. 마음에 새겨두고 다양하게 학습해보세요. 다양한 비동기 처리 방법으로 더 크고 복잡한 애플리케이션을 만들어 보세요. 아무리 어려워 보일지라도 발행자와 구독자로 모든 것을 동기화하도록 노력해보세요.

---

여전히 이번 글에서 다루지 못한 몇 가지 주제들이 있습니다.

- 리스너가 더 이상 필요하지 않을 때 구독을 해지(unsubscribe)하는 방법
- 다양한 주제(Multi-topic)를 구독하는 방법 (`addEventListener` 로 다른 이벤트에 구독을 수행하는 것 처럼)
- 확장된 아이디어: 이벤트 버스 등

이번에 배운 지식을 확장하기 위해서 Pub-Sub 패턴을 구현한 몇 가지 자바스크립트 라이브러리를 살펴보실 수 있습니다.

- [GitHub - mroderick/PubSubJS: Dependency free publish/subscribe for JavaScript](https://github.com/mroderick/PubSubJS)
- [GitHub - Sahadar/pubsub.js: Dependency free JavaScript pubsub implementation with wildcards, inheritance and multisubscriptions.](https://github.com/Sahadar/pubsub.js)
- [GitHub - shystruk/publish-subscribe-js: Publish/Subscribe UMD package](https://github.com/shystruk/publish-subscribe-js)

한 번 살펴보시고 사용해보세요. 이리저리 만져보고 디버거를 사용해서 라이브러리를 사용할 때 무슨 일이 일어나는지도 살펴보세요. 또한 [이 개념을 잘 설명한](https://en.wikipedia.org/wiki/Publish–subscribe_pattern) [여러 가지 글이 있습니다.](https://davidwalsh.name/pubsub-javascript)

예제로 사용 된 코드는 아래의 깃헙 저장소에 올려두었습니다.

[GitHub - hzub/pubsub-demo: Code for article: https://medium.com/@hubert.zub/why-every-beginner-front-end-developer-should-know-publish-subscribe-pattern-72a12cd68d44](https://github.com/hzub/pubsub-demo/)

계속 실험해보고 건드려보세요. 다양한 용어들에 겁 먹지 마세요. 어렵게 포장된 보통의 코드인 경우가 많습니다.

계속 생각하세요. 그럼 이만!

---

## 번역 후기

내용이 무척 길어서 쉽사리 접근할 엄두를 내지 못했지만 마치고 나니 뿌듯하네요. 정말 중요한 개념이라고 생각하며 내용을 살펴보았고, 많은 분들에게 도움이 될 수 있으리라 생각하여 망설이지 않고 번역 작업을 진행했습니다. 삽화가 다양하게 들어있어서, 이해를 돕고자 삽화의 내용도 직접 다시 그려봤는데 글씨를 더 잘 쓰지 못해 조금 아쉬웠네요.

참고로 디자인 패턴에 대해 조금이라도 들어 보신 분들은 옵저버 패턴(Observer Pattern)에 대해 들어보셨을 겁니다. 그 패턴과 Pub-Sub 가 어떻게 다른가? 라고 궁금해하실 수도 있으리라 생각해서 아래의 첨부자료를 남깁니다.

- [Observer 패턴과 Publisher/Subscriber(Pub-Sub) 패턴의 차이점 · Jistol Github Page](https://jistol.github.io/software%20engineering/2018/04/11/observer-pubsub-pattern/)
- [Observer vs Pub-Sub pattern – Hacker Noon](https://hackernoon.com/observer-vs-pub-sub-pattern-50d3b27f838c)
