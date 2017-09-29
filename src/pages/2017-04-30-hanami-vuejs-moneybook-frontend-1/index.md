---
path: "/posts/hanami-vuejs-moneybook-frontend-1"
date: "2017-04-30"
title: "Hanamirb + Vue.js 로 간단 가계부 구현 (프론트엔드 편 - 1)"
category: Vue.js
tags:
  - Javascript
  - Vue.js
---

**Hanamirb + Vue.js 시리즈 목차**

1. [API 서버](https://emaren84.github.io/blog/archivers/hanami-vuejs-moneybook-api-server)

1. [로그인 & 회원가입 페이지](https://emaren84.github.io/blog/archivers/hanami-vuejs-moneybook-frontend-1)

1. [가계부 페이지](https://emaren84.github.io/blog/archivers/hanami-vuejs-moneybook-frontend-2)

---

지난 시간에 하나미로 JSON API 서버를 만들었습니다. 이제 가계부 클라이언트를 Vue.js로 구현해보겠습니다.
처음에는 vue-cli나 Nuxt같은 다양한 도구를 이용해서 프로젝트를 만들어야 하나 고민을 했는데, 굳이 그렇게 할 필요도 없이 쉽게 구현 가능하다는 사실을 깨달았습니다.

이번 프로젝트에서 우리가 필요한건 로그인 페이지와 가계부 페이지 html 두 장 뿐입니다. CSS와 자바스크립트는 같은 파일안에 작성하려는데, 가독성이 떨어지거나 번거롭게 느껴지신다면 따로 분리하여 작업하셔도 됩니다.

**이번에 만드는 프로젝트는 ES6(ECMAscript 2016) 문법을 적극적으로 활용하여 작성할 예정입니다. 크롬 최신버전 (현재 58) 기준으로 만들 예정이며, 더 낮은 버전의 브라우저는 제대로 작동하지 않을 확률이 큽니다(특히 IE).**


## Vue.js란?

여태까지 AngularJS, ReactJS가 프론트엔드 JS 프레임워크의 양대 산맥을 이루고 있었지만, Vue.js가 혜성처럼 등장하여 3대장과 같은 위치를 차지하게 되었습니다. 두 프레임워크의 장점을 적절히 가져오고 쉽게 익힐 수 있도록 설계되어 있는데다가, 복잡한 프로젝트 세팅 없이 바로 CDN에서 파일을 가져오기만 해도 충분히 쓸만할 만큼 가볍고 사용성이 좋습니다.

Vue.js에 관한 더 자세한 소개와 간단한 튜토리얼은 아래 링크를 참고하시기 바랍니다

[Vue.js 2.0 소개 및 시작하기 - velopert](https://velopert.com/3007)


## 회원 가입 & 로그인 페이지 만들기

지난 시간에 가계부 앱에 필요한 기능들을 말씀드렸을 때, 회원 가입을 하고 로그인을 하면 토큰을 받고 브라우저의 LocalStorage에 저장한다고 말씀드렸습니다. 두 기능 모두 거의 같은 로그인 Form을 공유하기 때문에 한 페이지로 만들고 `v-if` 같은 분기문을 사용해서 상태에 따라 조금씩 다른 모습이 나타나도록 만들면 되겠습니다.



### 기본 설정

하나미 프로젝트와 다른 곳 혹은 같은 곳에 폴더를 생성하고 `login.html` 파일을 만든 뒤에 필요한 파일들을 등록해두겠습니다.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.16.1/axios.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.3.0/vue.js"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.4.1/css/bulma.min.css">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
  <title>MoneyBook</title>
</head>
<body>

</body>
</html>
```

서버와 AJAX 통신을 위해 axios, 좀더 깔끔한 페이지 뷰를 위해 CSS 프레임워크인 Bulma를 사용하겠습니다.

```html
<style>
  html, body {
    height: 100%;
    padding: 0;
    margin: 0;
    overflow: hidden;
  }


  #app {
    height: 100%;
    margin: 0;
    padding: 0;
    background-color: #E6E6E6;
  }

  #app .column {
    margin-top: 10%;
  }

  #app .column > p {
    text-align: center;
  }

  #sign-up-button {
    float: right;
  }
</style>

<body>
  <!--main container-->
  <div class="columns is-mobile" id="app">
    <!--centered column-->
    <div class="column is-half is-offset-one-quarter">

      <p class="title is-2 is-spaced">MoneyBook</p>

      <!--login form-->
      <div class="box">
        <form>
          <div class="field">
            <p class="control has-icons-left">
              <input class="input" type="email" placeholder="Email">
              <span class="icon is-small is-left">
                <i class="fa fa-envelope"></i>
              </span>
            </p>
          </div>
          <div class="field">
            <p class="control has-icons-left">
              <input class="input" type="password" placeholder="Password">
              <span class="icon is-small is-left">
                <i class="fa fa-lock"></i>
              </span>
            </p>
          </div>
          <div class="field">
            <p class="control">
              <button class="button is-success" id="log-in-button">
                Login
              </button>

              <button class="button is-info" id="sign-up-button">
                Sign up
              </button>
            </p>
          </div>
        </form>
      </div>
      <!--end of form-->

    </div>
    <!--end of column-->
  </div>
  <!--end of container-->
</body>
```

위의 코드를 넣어주시면 다음과 같은 화면을 보실 수 있습니다.

![](./2017-04-30-sc1.png)

### 회원 가입 & 로그인 페이지 전환

형태를 잡았으니 본격적인 Vue 도입을 시작하겠습니다. 가장 먼저 `Vue` 인스턴스를 생성한 뒤, 필요한 데이터 필드를 설정하고, 회원 가입 버튼을 누를 때 다른 페이지가 나올 수 있도록 설정할 예정입니다.

```javascript
const app = new Vue({
  el: '#app',

  data: {
    isSignUp: false,
  },

  methods: {
    toggleSignUp() {
      this.isSignUp = !this.isSignUp;
    }
  }
});
```

`body` 태그 맨 아래에 `script` 태그를 삽입하고 위의 코드를 넣어줍니다. 먼저 어느 엘리먼트에서 Vue 앱이 구동될지 지정해주고, 앱 안에서 사용하고자 하는 데이터를 설정해준 뒤, 데이터를 조작할 수 있는 메서드를 지정해 주었습니다.

한 페이지 안에서 로그인 페이지와 회원가입 페이지를 버튼에 따라 다르게 나타나게 하려면 `v-if`, `v-else` 를 사용하면 됩니다. 자세한 내용은 [공식 가이드를 참고해주세요.](https://kr.vuejs.org/v2/guide/conditional.html)

```html
<!--password confirmation-->
<template v-if="isSignUp">
  <div class="field">
    <p class="control has-icons-left">
      <input class="input" type="password" placeholder="Password Confirmation">
      <span class="icon is-small is-left">
        <i class="fa fa-lock"></i>
      </span>
    </p>
  </div>
</template>

<!--buttons-->
<div class="field">
  <template v-if="!isSignUp">
    <p class="control">
      <button class="button is-success" id="log-in-button">
        Login
      </button>
      <button class="button is-info" id="sign-up-button" @click.prevent="toggleSignUp">
        Sign up
      </button>
    </p>
  </template>
  <template v-else>
    <p class="control">
      <button class="button is-success" id="log-in-button">
        Submit
      </button>
      <button class="button is-light" id="sign-up-button" @click.prevent="toggleSignUp">
        Back
      </button>
    </p>
  </template>
</div>
```

`template` 태그는 Vue에서 사용하는 래퍼 태그입니다. `v-if` 나  `v-else` 는 기본적으로 하나의 태그에만 작동하고, 그 하위 태그들에는 동작하지 않기 때문에 이렇게 단위로 묶어줄 필요가 있습니다.

`@click.prevent` 는 `v-on:click.prevent` 와 같은 의미입니다. 이 버튼을 클릭하면 아까 지정해둔 `toggleSignIn` 메서드를 실행하게 되고, 이 메서드가 `isSignIn` 값을 변경하여 모든 템플릿에 영향을 줍니다.



### Form의 자료를 저장할 객체 생성

우리가 만들어놓은 Form에는 세 가지 필드가 있습니다. 이메일 주소, 비밀번호, 비밀번호 확인 필드입니다. 기존에 jQuery를 사용해 오셨다면, 필드의 변화를 바로바로 잡아내기 보다 폼을 제출할 때 이벤트 핸들러가 이런저런 일을 처리하도록 만드셨을 겁니다. Vue도 그렇게 하는게 가능은 하지만 그닥 추천하고 싶은 방법은 아닙니다.

이번에는 `v-model` 속성을 이용하여 데이터를 묶어두는(binding) 방법을 적용해 보겠습니다. 가장 기초적인 방법으로 Vue 인스턴스에 data를 다음과 같이 지정해둘 수 있을겁니다.

```javascript
const app = new Vue({
  el: '#app',
  data: {
    isSignIn: false,
    email: '',
    password: '',
    password_confirmation: ''
  }
  // ...
});
```

Vue 인스턴스의 `data` 속성은 해당 인스턴스의 스키마 역할을 하기도 하고, 이렇게 지정해두지 않은 데이터는 동적으로 제어하는게 불가능합니다. (API 문서를 보시면 이후에 추가하는 메서드가 있긴 하지만 그닥 추천드리고 싶지 않습니다) 지금은 필드가 단지 3개밖에 없으니까 이렇게 바로 데이터를 지정해둘 수 있을겁니다.

미리 서버에 요청을 보내는 과정을 알려드리면 **Form의 데이터를 객체로 모으기 -> axios로 post 요청 보내기 -> 서버의 응답 리턴** 일텐데, 첫 번째 과정을 눈여겨보셔야 합니다. 만약 우리가 회원 가입을 할 때 전화번호나 주소같이 추가적인 정보를 더 많이 받게 된다면, 이 모든 속성을 `data` 에 지정하는 일은 비효율적입니다. 아예 Form 데이터를 모아주고, 요청도 전송해주고, 특정 버튼을 눌렀을 때 input 값을 초기화해주는 등의 역할을 해 주는 객체를 새로 만들면 어떨까요?

먼저 해당 역할을 해 주는 Form 클래스를 만들고, `data` 속성에 지정해두겠습니다.

```javascript
class Form {
  constructor(data) {
    this.originalData = data;

    for (let field in data) {
      this[field] = data[field];
    }
  }
}

const app = new Vue({
  el: '#app',

  data: {
    isSignIn: false,
    form: new Form({
      email: '',
      password: '',
      password_confirmation: ''
    })
  }
});
```

참고로 자바스크립트 인터프리터는 코드를 위에서 아래 순서대로 읽기 때문에 Form 클래스의 정의를 Vue 인스턴스 아랫부분에 하게 되면 에러가 납니다.

Form의 `originalData` 속성은 단순히 필드 저장용으로 사용하게 됩니다. 지금은 `email`, `password`, `password_confirmation` 필드가 있지요. 그리고 for..in으로  Form 클래스의 속성에 필드를 추가합니다.

이제 input 태그에 데이터를 연결해보겠습니다.

```html
<!--email input-->
<div class="field">
  <p class="control has-icons-left">
    <input class="input" type="email" placeholder="Email" v-model="form.email">
    <span class="icon is-small is-left">
      <i class="fa fa-envelope"></i>
    </span>
  </p>
</div>

<!--password input-->
<div class="field">
  <p class="control has-icons-left">
    <input class="input" type="password" placeholder="Password" v-model="form.password">
    <span class="icon is-small is-left">
      <i class="fa fa-lock"></i>
    </span>
  </p>
</div>

<!--password confirmation-->
<template v-if="isSignUp">
  <div class="field">
    <p class="control has-icons-left">
      <input class="input" type="password" placeholder="Password Confirmation" v-model="form.password_confirmation">
      <span class="icon is-small is-left">
        <i class="fa fa-lock"></i>
      </span>
    </p>
  </div>
</template>
```

각 input 태그에 `v-model` 속성과 함께, 어느 속성이 연결되어야 할 지 지정되어있는 모습을 보실 수 있습니다. 이제 각 필드의 값에 변화가 일어날 때 마다 Form 객체의 속성이 변하게 됩니다.

![](./2017-04-30-sc2.gif)

이제 작동 원리가 눈에 들어오셨다면 Form 클래스에 몇 가지 메서드를 추가해 보겠습니다.

```javascript
class Form {
  constructor(data) {
    this.originalData = data;

    for (let field in data) {
      this[field] = data[field];
    }
  }

  data() {
    let data = {};

    for (let field in this.originalData) {
      if (field.match(/^password/) && data[field] !== '') {
        data[field] = sha256(`moneybook:${this[field]}`);
      } else {
        data[field] = this[field];
      }
    }

    return data;
  }

  reset() {
    for (let field in this.originalData) {
      this[field] = '';
    }
  }
}
```

`reset` 메서드는 말 그대로 각 필드를 비우는 메서드이고, `data` 필드는 새로운 객체에 각 필드에 입력된 값을 모아주는 역할을 합니다. 서버에 패스워드를 전송할 때는 반드시 암호화되어야 하기 때문에 [SHA-256 라이브러리](https://github.com/emn178/js-sha256)를 적용했습니다. 단순히 작동되는 모습을 보기만 하시려면 굳이 적용하지 않으셔도 됩니다.

`reset` 메서드는 `toggleSignIn` 메서드가 실행될 때 같이 실행되도록 하여 회원가입<->로그인 전환 시 필드 값을 초기화하겠습니다.

```javascript
// ...
	methods: {
      toggleSignUp() {
          this.isSignUp = !this.isSignUp;
          this.form.reset();
      }
    }
// ...
```



### 서버와 통신하기

사실 Form 을 다루는 이야기를 더 하자면 내용이 꽤 길어집니다. 유효성 검사라던가, 서버로부터 들어온 에러를 다루는 방법이라던가.. 이 부분은 나중에 소스코드에는 구현 할 예정이니 업로드 된 소스코드를 직접 살펴보시길 바랍니다.

지금은 서버에 데이터를 전송한 뒤에 리턴된 토큰을 저장하는 방법을 살펴보겠습니다. 같은 Form 안에서 조건에 따라 다른 요청을 하도록 구성되어 있기 때문에 Login, Submit 버튼에 다른 메서드를 연결하겠습니다.

```html
<!--buttons-->
<div class="field">
  <template v-if="!isSignUp">
    <p class="control">
      <button class="button is-success" id="log-in-button" @click.prevent="submitLogin">
        Login
      </button>
      <button class="button is-info" id="sign-up-button" @click.prevent="toggleSignUp">
        Sign up
      </button>
    </p>
  </template>
  <template v-else>
    <p class="control">
      <button class="button is-success" id="log-in-button" @click.prevent="submitSignUp">
        Submit
      </button>
      <button class="button is-light" id="sign-up-button" @click.prevent="toggleSignUp">
        Back
      </button>
    </p>
  </template>
</div>
```

```javascript
// ...
	methods: {
      // ...
        submitLogin() {
          this.form.submit('http://localhost:2300/api/auth/sign_in');
        },

        submitSignUp() {
          this.form.submit('http://localhost:2300/api/auth/sign_up');
        },
      // ...
    }
```

요청 주소는 하나미 기본 서버 주소 및 포트를 기준으로 했습니다. 별도로 하나미쪽에 CORS를 신경 써 주어야 하는데 미처 신경 쓰지 못했네요, 추후에 업데이트 하겠습니다.

`submit` 메서드는 지정한 url을 받아서 서버에 POST요청을 하고, 응답에 따라 토큰을 저장하거나, 메세지를 띄우면서 Login 페이지로 돌아오는 역할을 합니다.

```javascript
class Form {
  // ...
      submit(url) {
        let data = { user: this.data() };
        axios.post(url, data)
          .then(response => {
            if(response.data['auth_token']) {
              localStorage.setItem('auth_token', response.data['auth_token']);
              location.href = './content.html';
            } else {
              app.renderNotification('Successfully Singed Up');
              app.toggleSignUp();
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
  // ...
}
```

axios 라이브러리를 이용하여 요청을 하고, 성공하거나 실패한 요청을 각각 `then`, `catch` 로 다룰 수 있습니다. API 서버 구현 파트에서 보셨다시피 사용자가 가입을 할 때는 해당 사용자의 정보를 리턴하고, 가입된 계정으로 로그인을 할 때만 `auth_token` 을 반환합니다. 그리고 받은 토큰을 브라우저의 `localStorage` 에 저장합니다. 그 뒤에 자연스럽게 가계부  앱 페이지로 이동하게 만들면 됩니다.

회원 가입이 정상적으로 처리 된 뒤에는 다시 로그인 페이지로 돌아도록 만들었습니다. `renderNotification` 메서드는 오른쪽 구석에 알림을 띄우도록 만든 메서드인데, 이를 활용하여 에러 메세지도 손쉽게 표현하실 수 있을겁니다.

다음 포스팅에서 로그인 이후에 실제 가계부 앱을 Vue.js로 구현해보겠습니다.

---

Source Code: [Github](https://github.com/emaren84/moneybook_client)
