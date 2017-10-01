---
path: "/posts/hanami-webpack-config"
date: "2017-04-09"
title: "하나미 프로젝트에서 webpack 설정하기"
category: "Webpack"
tags:
  - Ruby
  - Hanami
  - Javascript
  - Webpack
---

기존에 [Learn Vue.js 2](https://laracasts.com/series/learn-vue-2-step-by-step/) 강좌를 보면서 Form 제출에 대한 프로젝트를 레일즈로 작성하는 부분까지 따라했었는데, 이번에 다시 익혀보면서 백엔드 구축을 하나미로 작성해보았다. 그 과정에서 webpack을 밑바닥부터 설정하는 에피소드를 참고하여 하나미를 기반으로 설정해 보았다.



## application.rb 설정하기

프로젝트를 작성하고 레일즈로 작성해놓았던 코드도 옮기고 한 건 좋은데 제대로 돌아가는 게 하나도 없었다. 브라우저 콘솔에 나타난 에러를 가만히 들여다보니 Content Security Policy를 미리 설정해둘 필요가 있었다.

```ruby
# application.rb
# ...
      security.content_security_policy %{
        form-action 'self';
        frame-ancestors 'self';
        base-uri 'self';
        default-src 'none';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https:;
        connect-src 'self';
        img-src 'self' https: data:;
        style-src 'self' 'unsafe-inline' https:;
        font-src 'self';
        object-src 'none';
        plugin-types application/pdf;
        child-src 'self';
        frame-src 'self';
        media-src 'self'
      }
# ...
```

`script-src` 부분에 주목해야한다. `unsafe-inline` 뿐 아니라 `unsafe-eval` 도 추가해주어야 한다. 그리고 애셋을 하나미에서 컴파일하지 않도록 설정해주어야 한다. 그렇지 않으면 자동적으로 하나미가 컴파일되지 않은 파일을 `public` 폴더로 옮겨버린다. 나중에 다시 설정하는 법을 찾을 수 있을지 모르겠지만 `fingerprint` 도 사용하지 않도록 체크해준다.

```ruby
    ##
    # DEVELOPMENT
    #
    configure :development do
      # Don't handle exceptions, render the stack trace
      handle_exceptions false

      assets do
        compile false
      end
    end

	# ...

    ##
    # PRODUCTION
    #
    configure :production do
      # scheme 'https'
      # host   'example.org'
      # port   443

      assets do
        # Don't compile static assets in production mode (eg. Sass, ES6)
        #
        # See: http://www.rubydoc.info/gems/hanami-assets#Configuration
        compile false
        
        # Use fingerprint file name for asset paths
        #
        # See: http://hanamirb.org/guides/assets/overview
        fingerprint false
        
        # ...
```



## yarn init

현재로서 `npm` 보다 `yarn` 이 더 나아보이니까 한번 적용해보았다. 이번 프로젝트와 관련된 모듈들은 다음의 커맨드로 설치하면 된다.

```
# 필수 모듈
$ yarn add axios vue

# 개발용 모듈
$ yarn add webpack babel-core babel-loader babel-preset-es2015 --dev
```



## webpack 설정 파일 생성

다음은 webpack을 설정하는 파일을 작성할 차례이다. 처음엔 아주 간단한 부분만 작성한다.

```javascript
// webpack.config.js
const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: './apps/web/assets/javascript/app.js', // 타겟 파일 지정
  output: {
  	path: path.resolve(__dirname + '/public/assets'), // 번들된 파일 저장 위치, path 모듈을 불러와야한다.
  	filename: 'app.js', // bundle.js를 많이 쓰는 경향이 있는데 이번엔 app.js로 지정
  	publicPath: './public'
  },
};
```

이렇게 설정을 해 주고 `app.js` 파일이 엔트리 포인트가 되도록 각 모듈 사이의 `import` 나 `export` 를 지정해준다.

번들된 파일을 생성하기 위해선 다음 커맨드를 입력해준다.

	$ node_modules/.bin/webpack --hide-modules
	# 계속 변화를 감지하기 위한 커맨드는 다음과 같다.
	$ node_modules/.bin/webpack --hide-modules --watch

하지만 저 커맨드를 굳이 매번 입력해 줄 필요는 없다. `package.json` 파일에 스크립트를 설정해줄 수 있다.

```json
// package.json
{
  // ...
  "scripts": {
    "webpack": "NODE_ENV=development webpack --hide-modules",
    "dev": "NODE_ENV=development webpack --hide-modules --watch",
    "build": "NODE_ENV=production webpack --hide-modules"
  }
}
```

`NODE_ENV` 에 대해서는 나중에 살펴 볼 것이다.

하나미의 `application.html.erb` 파일에서는 `javascript` 뷰 헬퍼로 자바스크립트 파일을 불러오는데, body  태그 마지막에 불러오도록 한다.

```erb
<!-- ... -->
  <body>
    <div class="container" id="app">
      <%= yield %>
    </div>

    <%= javascript 'app' %>
  </body>
<!-- ... -->
```

대신 css 파일은 수동으로 옮겨주어야 할 것이다. `scss` 같은 preprocessing이 필요한 파일들은 어떻게 처리하는지 아직 실험해보지 못했다. 어차피 전부 webpack으로 해결할 수 있다.

하지만 막상 번들된 파일을 불러와도 크롬에서 에러를 뿜으면서 랜더링이 되지 않았다. 왜인지 살펴보니 뷰의 모든 구성요소를 컴포넌트로 만들지 않고(Runtime-only), 기존에 작성한 html에 속성을 적용하려면(Full version) [별도의 설정](https://kr.vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only)을 해 주어야 한다.

```javascript
// webpack.config.js
module.exports = {
  // ...
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js'  webpack 1용 입니다
    }
  }
}
```

이렇게 하면 생각하던대로 작동한다. 나중에 다른 프로젝트에서 Vue 컴포넌트로만 빌드를 하게 되면 이 설정은 입력할 필요가 없을 것이다.



## 환경 변수 관리

윗부분에서 `NODE_ENV` 와 관련된 스크립트를 언급했는데, 프로덕션 모드에서는 번들된 패키지를 더 압축해주고, 프로덕션 모드임을 지정해주는 설정이 가능하다. 별도로 패키지를 설정해 줄 필요는 없고, webpack 설정 파일 제일 아랫부분에 스크립트를 더 추가해주어야 한다.

```javascript
// webpack.config.js
// ...
if (process.env.NODE_ENV === 'production') {
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    })
  );
  
  module.exports.plugins.push(
    new webpack.DefinePlugin({
      'process_env': {
        NODE_ENV: '"production"' // 오타가 아니고 따옴표 안에 겹따옴표 들어가는거 맞다
      }
    )}
  );
};
```



## babel 적용하기

최신 버전 크롬은 ES6 문법 대부분을 지원하기 때문에 별 신경을 쓰지 않아도 되곘지만.. 그래도 바벨을 적용해두는게 좋을 것이다. 

위에서 필요한 모듈은 설치되어있으니 `.babelrc` 파일부터 지정해준다.

```json
// .babelrc
{
  "presets": [
    ["es2015", { "modules": false }]
  ]
}
```

그리고 바벨에서 제공하는 [공식 문서를 따라](http://babeljs.io/docs/setup/#installation) webpack 설정 파일에 다음 코드를 추가해준다.

```javascript
// webpack.config.js
module.exports = {
  // ...
  module: {
    rules: [
      {
      	test: /\.js$/,
      	exclude: /node_modules/,
      	loader: "babel-loader"
      }
    ]
  },
  // ...
};
```

이제부터 webpack을 실행하면 바벨로 변환된 결과물이 나온다.



## 라이브러리 나누어서 적용하기

만약에 내가 자바스크립트 파일을 작성하다가 아주 일부분만 수정하고 다시 빌드를 해야하는 일이 있다고 할 때 계속 시간을 잡아먹는게 상당히 짜증날 것이다. 일단 기본적인 라이브러리는 내용이 변할 일이 없기 때문에 별도로 합쳐지도록 적용하고, 내가 실제로 작성하는 파일만 변화가 있을 때 다시 번들되도록 만들면 많은 시간을 단축할 수 있을 것이다.

```javascript
// webpack.config.js
module.exports = {
  entry: {
    app: './apps/web/assets/javascripts/app.js',
    vendor: ['vue', 'axios']
  },
  output: {
    path: path.resolve(__dirname + '/public/assets'),
    filename: '[name].js', // entry에 지정된 name(app, vendor)로 번들된 파일이 생성된다.
    publicPath: './public'
  },
  // ...
  plugins: [
    new webpack.optimize.CommonsChunckPlugin(
      { name: 'vendor' } // vendor 파일 덩어리를 따로 보관하고 캐싱한다.
    )
  ]
};
```

이러고 나서 빌드를 마치고 나면 `public/assets` 폴더에는 `app.js`, `vendor.js` 두 개의 파일이 생성된다. 당연하게 레이아웃 페이지에서 `vendor.js` 파일도 로딩해주어야 한다.

```erb
<!-- ... -->
  <body>
    <div class="container" id="app">
      <%= yield %>
    </div>

    <%= javascript 'vendor', 'app' %>
  </body>
<!-- ... -->
```



## CSS 파일도 관리하자

이래저래 잘 작동하길래 슬슬 코드를 올려볼까 했더니 CSS 파일이 문제가 되었다. 물론 CSS 파일의 내용은 몇 줄 없지만, 매번 내용을 수정한 다음에 일일이 파일을 `public` 폴더로 옮기는건 아주 비효율적이다. 당연히 webpack이 CSS 파일도 모아줄 수 있다.

먼저 필요한 모듈을 설치한다.

	$ yarn add css-loader extract-text-webpack-plugin --dev
	
그리고 설정파일에 CSS 관련 모듈 규칙과 플러그인을 추가해준다.

```javascript
// webpack.config.js
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// ...
module.exports = {
  // ...
  module: {
    rules: [
      // ...
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          use: 'css-loader'
        })
      }
    ]
  },
  plugins: [
    // ...
    new ExtractTextPlugin('styles.css') // 원하는 이름으로 지정
  ]
};
// ...
```

이후 webpack을 실행하면 `public/assets` 폴더에 `styles.css` 파일이 추가된다. 나머지는 레이아웃 파일에서 이 파일을 불러오도록 만들면 된다.

```erb
  <head>
    <%= stylesheet 'https://cdnjs.cloudflare.com/ajax/libs/bulma/0.3.1/css/bulma.min.css' %>
    <%= stylesheet 'styles' %>
    <!-- ... -->
  </head>
```



위 내용을 기반으로 작성한 간단한 프로젝트는 [Github](https://github.com/emaren84/hanami-webpack-config-example)에 업로드 되어있다.
