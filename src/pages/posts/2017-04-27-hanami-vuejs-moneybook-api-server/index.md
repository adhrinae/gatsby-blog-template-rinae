---
path: "/posts/hanami-vuejs-moneybook-api-server"
date: "2017-04-27"
title: "Hanamirb + Vue.js 로 간단 가계부 구현 (API 서버 편)"
category: "Hanami"
tags:
  - Ruby
  - Hanami
  - Vue.js
---

**Hanamirb + Vue.js 시리즈 목차**

1. [API 서버](https://emaren84.github.io/posts/hanami-vuejs-moneybook-api-server)

1. [로그인 & 회원가입 페이지](https://emaren84.github.io/posts/hanami-vuejs-moneybook-frontend-1)

1. [가계부 페이지](https://emaren84.github.io/posts/hanami-vuejs-moneybook-frontend-2)

---

**업데이트**

- BCrypt 관련 설명 수정 (2017-05-02)

---

## 들어가며

하나미 정식 버전이 지난 4월 6일에 발표되었습니다. 기존에 레일즈에 여러모로 아쉬움을 느끼고 있던 해외의 루비 개발자들은 많은 관심을 가지고 있나봅니다. 제가 처음 하나미를 접했을 때 버전이 0.7.2였는데 어느새 1.0.0 버전이 발매되었고, 아직도 쓰고있다보니 감개무량합니다.

요즘 프론트엔드 JS 프레임워크에 많은 관심을 가지고 ReactJS, Vue.js를 공부하고 있는데, 간단히 배운 내용을 적용해볼 겸 간단 가계부를 구현해보도록 하겠습니다. 백엔드 JSON API 서버는 하나미로 구현하고, 프론트엔드는 Vue.js로 구현하는 과정을 보여드리겠습니다.

최대한 간단히 설명해드리려 노력하겠지만, 기존에 루비로 웹 개발을 해보신분이 이해하시기 쉬울 겁니다. 사실 JSON API 서버는 어떤 언어나 프레임워크로 제공해도 되니까요 :) 구현방법에 약간씩 차이가 있을 뿐이지 제가 보여드리는 정도의 앱은 그렇게 어렵지 않게 작성하실 수 있으리라 봅니다.



## 애플리케이션의 기본 구성

처음에는 더욱 간단한 To-Do List(할일 관리) 를 구현하려고 했는데, 그러면 하나미를 다루는 부분이 너무 영양가가 없어질 것 같아서 가계부 형식의 앱으로 만들고, 다음의 기능을 구상해 보았습니다.

- 회원 등록 및 인증
  - 이메일과 비밀번호로 회원 가입
  - JWT로 인증 (토큰은 LocalStorage에 저장)
- 사용금액, 내용 입력
  - 수입은 녹색, 지출은 빨강색으로 표시
  - 각 아이템을 클릭하면 바로 수정 가능, 삭제 버튼을 누르면 삭제
- 수입, 지출을 필터링하여 보기
- 가장 최신 레코드 30개를 처음에 불러온 뒤, 화면에 보이는 마지막 내역까지 스크롤 하게 되면 추가로 자료 가져오기

이 정도의 기능을 구현해볼 예정입니다. 막상 하려니 쉽진 않겠지만 차근차근 진행해보겠습니다.



## 하나미 프로젝트 생성

너무나 당연하지만 하나미를 사용하기 위해서는 개발 환경에 루비가 세팅되어 있어야 합니다. 아직 루비가 설치되어있지 않은 경우에는 [GoRails의 설치 가이드](https://gorails.com/setup/)를 따라하시면 되겠습니다. 그 다음에 하나미 젬을 설치하시면 됩니다. 이번 강좌에서는 **루비 2.4.1**, **하나미 1.0.0** 버전을 기준으로 프로젝트를 생성하겠습니다.

먼저 하나미 젬을 설치합니다.

```
gem install hanami
```

설치 된 이후에 프로젝트는 원하시는 이름으로 설치하시면 됩니다. 하나미는 SQLite, MySQL, PostgreSQL 등을 지원하지만, 기본적으로 PostgreSQL을 권장합니다. 또한 테스팅 프레임워크도 처음 프로젝트를 설정할 때 Minitest, RSpec 중에서 고르실 수 있습니다. 제가 아직 RSpec은 커녕 TDD를 잘 못하기 때문에 Minitest로 진행해보겠습니다.

```
hanami new moneybook-api --database=postgres --test=minitest
```

생성된 프로젝트에서 젬파일을 살펴보시면 꽤 간단합니다.

```ruby
# Gemfile
source 'https://rubygems.org'

gem 'rake'
gem 'hanami',       '~> 1.0'
gem 'hanami-model', '~> 1.0'

gem 'pg'

group :development do
  # Code reloading
  # See: http://hanamirb.org/guides/projects/code-reloading
  gem 'shotgun'
end

group :test, :development do
  gem 'dotenv', '~> 2.0'
end

group :test do
  gem 'minitest'
  gem 'capybara'
end

group :production do
  # gem 'puma'
end
```

이 중에서 `capybara` 젬은 뷰 테스트 용이기 떄문에 이번 프로젝트에선 굳이 없어도 됩니다. 앞으로 젬이 더 추가될테지만 필요에 따라 추가하기로 하고, `bundle install` 커맨드로 필요한 젬을 설치해두겠습니다.

참고로 PostgreSQL을 이용하시려면 `.env` 파일에서 계정 설정을 해주셔야 합니다. SQLite를 이용하신다면 파일로 관리되기 때문에 계정 설정을 해 주실 필요는 없습니다.

```
# .env.development
DATABASE_URL="postgresql://username:password@localhost/moneybook_api_development"
```



## 사용자 인증 구현

기존의 웹 페이지는 서버에서 인증 관련 정보를 들고, 세션을 이용하여 인증 상태를 유지하고 요청을 하는 경우가 많았습니다. 하지만 모바일 애플리케이션이나, 많은 인스턴스를 올려서 인증을 관리하는 경우 세션 기반 인증은 유연한 대응이 어렵습니다. JWT라는 개념을 이용하면 세션 기반 인증의 단점을 극복하고 사용자 인증을 적용할 수 있습니다.

JWT 인증이 무엇인지 궁금하시다면 다음의 링크를 읽어보시길 바랍니다.

- [JSON Web Token 소개 및 구조 - velopert](https://velopert.com/2389)
- [REST JWT 소개 - 조대협](http://bcho.tistory.com/999)
- [Introduction to JSON Web Tokens](https://jwt.io/introduction/)

인증에 필요한 젬을 추가한 뒤, 사용자 정보를 기록하는 모델을 생성하겠습니다.

```ruby
# Gemfile
# ...
gem 'bcrypt'
gem 'jwt'
# ...
```

`bcrypt` 젬은 비밀번호 생성에 특화된 단방향 해시 함수를 지원합니다.  
간단한 사용법을 알려드리면 `BCrypt::Password.create('password')` 로 해시 다이제스트를 생성하고, `BCrypt::Password.new(digest)` 로 해시 다이제스트가 본래 비밀번호와 일치하는지 검사합니다.

너무나 당연하면서 중요한 이야기지만 웹 개발자로서 복잡한 보안 알고리즘을 직접 구현하면 관리 및 취약점을 파악하기가 어렵기 때문에 차라리 `bcrypt` 처럼 검증된 라이브러리를 사용하시길 추천합니다. 비슷한 예로 Rails에서 사용자 인증과 관련한 부분은 되도록이면 Devise 젬을 사용하길 권장하는 것 처럼요.

패스워드 저장 매커니즘에 대해 [이 글](http://d2.naver.com/helloworld/318732)을 읽어보시길 추천합니다.


### 사용자 모델 생성

먼저 사용자 정보를 저장하기 위한 모델을 생성하겠습니다. 간단히 이메일과 패스워드를 저장하는 테이블을 만들면 되겠네요.

```
bundle exec hanami generate model user
```

앞으로 모든 하나미 커맨드 앞에는 `bundle exec`  이 붙을 예정입니다. 앞으로 하나미를 자주 쓰게 되면 `bashrc` 나  `zshrc` 에 alias 지정을 해 두는걸 추천합니다.

그리고 레일즈와 비슷하게 `db/migrations` 폴더에 마이그레이션 파일이 있습니다. 어떤 컬럼에 어떤 정보가 들어가게 될 지 작성해주어야 합니다.

```ruby
# db/migration/2017***_create_users.rb
Hanami::Model.migration do
  change do
    create_table :users do
      primary_key :id

      column :email, String, null: false
      column :password_digest, String, null: false

      column :created_at, DateTime, null: false
      column :updated_at, DateTime, null: false
    end
  end
end
```

방법에 따라서는 이메일 컬럼만 있어도 충분히 JWT 인증을 구현할 수 있다는데 아직 잘 모르겠습니다. 이제 테이블 생성을 위해 마이그레이션을 실행하겠습니다.

```
bundle exec hanami db create # 먼저 데이터베이스 생성부터
bundle exec hanami db migrate
```


### 사용자 등록 액션

이제 사용자를 등록하는 액션을 생성하겠습니다. 이후에 JWT 인증하는 과정을 덧붙일 예정입니다.

```
bundle exec hanami generate action api auth#sign_in --skip-view
bundle exec hanami generate action api auth#sign_up --skip-view
```

action 뒤에 `api` 는 제가 사용할 앱 이름입니다. 기본값은 web으로 되어 있지만, [하나미 가이드의 Command Line 부분을 참고하시면](http://hanamirb.org/guides/command-line/generators/) 다른 앱을 생성하거나 삭제하는 등 액션을 실행할 수 있습니다.

`--skip-view` 는 뷰와 관련된 템플릿 파일이나 뷰 클래스 및 테스트를 생성하지 않는 커맨드입니다. 우리는 하나미를 순순히 API 서버로 사용할 것이기 때문에 미리 입력해주어야 불필요한 파일을 만들지 않게 됩니다.

라우팅 파일의 내용도 변경해줍니다.

```ruby
# apps/api/config/routes.rb
post '/auth/sign_in', to: 'auth#sign_in'
post '/auth/sign_up', to: 'auth#sign_up'
```

사용자를 등록하는 과정은 JWT랑은 관련이 없습니다. 단순히 이메일, 비밀번호, 비밀번호 확인을 하는 패러매터를 전달 받은 뒤, 유효성 검사에 성공하면 비밀번호를 암호화하여 데이터베이스에 저장하면 됩니다.

우리는 JSON API 서버를 만들고 있기 때문에 애플리케이션의 `body_parsers` 나 `default_request_format` 등의 설정을 바꾸어 주어야 합니다.

```ruby
# apps/api/application.rb
# From Line 90
      # Default format for the requests that don't specify an HTTP_ACCEPT header
      # Argument: A symbol representation of a mime type, defaults to :html
      #
      default_request_format :json

      # Default format for responses that don't consider the request format
      # Argument: A symbol representation of a mime type, defaults to :html
      #
      default_response_format :json

      # HTTP Body parsers
      # Parse non GET responses body for a specific mime type
      # Argument: Symbol, which represent the format of the mime type
      #             (only `:json` is supported)
      #           Object, the parser
      #
      body_parsers :json
# ...
```

이제 안정적으로 기능을 구현하기 위해 테스트를 작성하겠습니다. 테스트 파일은 `spec/` 폴더에 있습니다.

```ruby
# spec/api/controllers/auth/sign_up_spec.rb
require 'spec_helper'
require_relative '../../../../apps/api/controllers/auth/sign_up'

describe Api::Controllers::Auth::SignUp do
  let(:action) { Api::Controllers::Auth::SignUp.new }
  let(:params) {
    {
      user: {
        email: "foo@bar.com",
        password: "secret",
        password_confirmation: "secret"
      }
    }
  }

  describe 'with valid params' do
    it 'is successful' do
      response = action.call(params)
      response[0].must_equal 201
    end
  end

  describe 'with invalid params' do
    it 'returns 422' do
      response = action.call({})
      response[0].must_equal 422
    end
  end
end
```

먼저 유효성 검사부터 만들겠습니다. 하나미의 유효성 검사는 모델에서 수행하는 게 아니라 각 액션에서 수행합니다. (공통된 유효성 검사를 모듈화할 수도 있습니다)

**작성되는 코드는 모두 테스트를 먼저 작성하고 진행하지만, 글에서 모두 보여드리지 않겠습니다. 자세한 내용은 [Github에 올라와 있는 소스코드](https://github.com/emaren84/moneybook_api)를 살펴봐 주세요.**

```ruby
# apps/api/controllers/auth/sign_up.rb
module Api::Controllers::Auth
  class SignUp
    include Api::Action

    VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+\z/i

    params do
      required(:user).schema do
        required(:email).filled(:str?, format?: VALID_EMAIL_REGEX)
        required(:password).filled(:str?).confirmation
      end
    end

    def call(params)
      halt 422 unless params.valid?
    end
  end
end
```

`halt` 메서드는 인자로 받은 스테이터스 번호와 메세지를 리턴합니다. 메세지는 생략 가능합니다. 이제 올바른 패러매터가 들어왔으면  사용자를 등록하면 됩니다.

```ruby
# same file
module Api::Controllers::Auth
  class SignUp
    include Api::Action

    VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+\z/i

    params do
      required(:user).schema do
        required(:email).filled(:str?, format?: VALID_EMAIL_REGEX)
        required(:password).filled(:str?).confirmation
      end
    end

    def initialize(interactor: UserSignUp)
      @interactor = interactor
    end

    def call(params)
      halt 422, 'Invalid Parameters' unless params.valid?

      result = @interactor.new(params.get(:user)).call
      status 201, result.user.show_info.to_json
    end
  end
end
```

뭔가 이상한 녀석이 나왔습니다. interactor라뇨? 인터렉터(Interactor)는 하나미에서 제공하는 모듈인데, 보통 다양한 비지니스 처리 로직을 분리하는 용도 혹은 재사용 가능한 비지니스 로직을 API, Web 같이 서로 다른 앱에서도 공유할 수 있도록 만들어졌습니다. `lib/interactor` 에 해당 클래스명으로 작성합니다.

```ruby
# lib/interactor/user_sign_up.rb
require "hanami/interactor"
require "bcrypt"

class UserSignUp
  include Hanami::Interactor
  include BCrypt

  expose :user

  def initialize(user_attr, encryptor: nil, repo: nil)
    @user_attr = user_attr
    @encryptor = encryptor || BCrypt::Password
    @repo = repo || UserRepository.new
  end

  def call
    safe_user = encrypt_user(user_attr)
    @user = @repo.create(safe_user)
  end

  private

  attr_reader :user_attr

  def encrypt_user(attributes)
    password = @encryptor.create(attributes[:password])

    { email: user_attr[:email], password_digest: password }
  end
end
```

눈여겨 보실점은 `expose` 밖에 없고 나머지는 일반적인 사용자 등록 로직으로 구성되어 있습니다. 인터렉터는 해당 클래스의 객체를 생성하고 `call` 메서드로 연산을 수행하는데, 그 결과값을 `expose` 로 내보내야 합니다. 참고로 `expose` 로 내보내려는 값은 인스턴스 변수여야 합니다. 여기서는 `@user` 가 되겠네요. 내보낸 결과물은 메서드처럼 `.user` 로 가져올 수 있습니다.

그런데 액션 부분에 `result.user.show_info.to_json`  이라고 되어있는 부분이 있습니다. `to_json` 은 리턴값이 JSON이어야 되니까 그렇다 치고, `show_info` 는 어디에 있는 녀석일까요? 방금까지 우리는 사용자를 생성했습니다. 그리고 생성된 결과값이 User Entity(엔티티)인데, 엔티티에 메서드를 정의하여 원하는 정보를 가공하여 보여줄 수 있도록 만든 것입니다. 콘솔에서 한번 확인해 보겠습니다.

```
bundle exec hanami console

```


```
[2] pry(main)> UserRepository.new.create(email: 'foo@baz.com', password_digest: 'some secret')
[moneybook_api] [INFO] [2017-04-22 14:06:37 +0900] (0.003739s) INSERT INTO "users" ("email", "password_digest", "created_at", "updated_at") VALUES ('foo@baz.com', 'some secret', '2017-04-22 05:06:37.222355+0000', '2017-04-22 05:06:37.222355+0000') RETURNING "id", "email", "password_digest", "created_at", "updated_at"
=> #<User:0x007fb6a6c49348
 @attributes=
  {:id=>3, :email=>"foo@baz.com", :password_digest=>"some secret", :created_at=>2017-04-22 05:06:37 UTC, :updated_at=>2017-04-22 05:06:37 UTC}>
```

저렇게 임의의 사용자를 생성하니 User 엔티티가 리턴된 것을 볼 수 있습니다. Repository가 뭐고, Entity가 무엇인지는 [제가 전에 작성한 하나미 소개 포스트를 참고해주세요.](https://emaren84.github.io/blog/archivers/hanami-introduction#모델-구축하기)

엔티티 클래스 파일의 위치는 `lib/moneybook_api/entities` 입니다.

```ruby
# lib/moneybook_api/entities/user.rb
class User < Hanami::Entity
  def show_info
    self.to_h.tap { |attributes| attributes.delete(:password_digest) }
  end
end
```

이렇게 하여 사용자 생성 후 리턴 값에는 패스워드를 뺸 나머지 정보만 보이게 됩니다.



### 토큰 생성하기

이제부터가 본격적인 JWT 인증을 구현하는 부분입니다. 생성한 사용자가 로그인을 시도하고 요청한 이메일과 비밀번호가 맞다면 우리는 인증 토큰을 생성하여 돌려주게 되고, 사용자는 매번 로그인 할 필요 없이 그 토큰을 가지고 (유효기간이 만료할 때 까지) 자유로이 앱을 사용할 수 있게 됩니다.

```ruby
# apps/controllers/auth/sign_in.rb
module Api::Controllers::Auth
  class SignIn
    include Api::Action

    VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+\z/i

    params do
      required(:user).schema do
        required(:email).filled(:str?, format?: VALID_EMAIL_REGEX)
        required(:password).filled(:str?)
      end
    end

    def call(params)
      halt 422, 'Invalid Parameters' unless params.valid?
      email = params.get(:user, :email)
      password = params.get(:user, :password)

      user = UserRepository.new.find_by_email(email)

      if user && user.valid_password?(password)
        token = JwtIssuer.encode(user.id)

        status 201, token.to_json
      else
        halt 401, 'Authentication Failed'
      end
    end
  end
end
```

유효성 검사를 하는 부분은 회원 등록 하는 액션에서도 적어놓았기 때문에 쉽게 알아보실 수 있을겁니다. 바로 아래에 `params.get` 이라는 메서드는 `Hash#dig` 메서드와 비슷한 용도를 가지고 있는데 `params[:user][:email]` 같이 값을 검색하려다가 `params[:user]` 가 `nil` 인 경우 `NoMethodError` 에러가 발생하는 일을 방지해줍니다. 대신 `nil` 을 리턴합니다.

`find_by_email` 같은 메서드는 레일즈를 하시는 분들이 보기엔 아주 친숙할겁니다. 하지만 우리는 이 메서드를 직접 구현해야 합니다. 레일즈로 개발하면서 느끼는 마법은 하나미에서는 일어나지 않습니다.

```ruby
# lib/moneybook_api/repositories/user_repository.rb
class UserRepository < Hanami::Repository
  def find_by_email(email)
    users.where(email: email).as(:entity).one
  end
end
```

**모든 하나미의 쿼리 메서드는 private 입니다. 콘솔에서 바로 테스트 할 수 없습니다.** 테스트를 작성하거나, 원하는 쿼리를 메서드로 정의한 뒤에 콘솔에서 돌려봐야 합니다.

`users` 는 리퍼지토리와 연결되어있는 테이블명을 나타내는 규약입니다. 만약 `BookRepository` 에서 `books` 라는 테이블의 내용을 가져오게 된다면 우리는 `books.` 로 시작하는 메서드를 작성하게 됩니다. 자세한 내용은 하나미 모델의 구현체인 [ROM](http://rom-rb.org)의 문서를 참고하시는게 좋습니다.

레일즈를 개발하는 분들은 보통 쿼리의 결과가 각 모델의 객체로 나오기 때문에 이후에 각 엔티티마다 메서드를 바로 사용할 수 있을겁니다. 하지만 하나미에서는 `as(:entity)` 옵션을 적용해주지 않으면 결과물이 단순한 `ROM::Struct` 객체를 리턴하거나. `ROM::Relation` 객체를 리턴하는 경우가 많습니다.

`Struct` 객체는 Hash처럼 되어있어서, 쿼리의 결과 레코드를 그대로 쓰는 건 가능하지만 엔티티에 정의해놓은 메서드를 사용할 수 없습니다. `Relation` 객체는 쿼리를 아직 실행하기 전에 ROM에서 쿼리를 준비해 놓는 객체입니다. 이 객체에 `to_a` 나 `each` 같은 메서드를 사용해서 자료를 가공할 때 쿼리를 실행하고, 그 때 엔티티를 다룰 수 있습니다.

지금은 간단한 쿼리라서 `.as(:entity)` 부분을 빼도 결과값을 맨 앞 한개만 출력하라는 `one` 메서드 때문에 바로 User 엔티티가 출력될겁니다. 이후에 더 복잡한 쿼리를 작성하게 되는 일이 있을 때 제가 말씀드린 내용이 도움이 되었으면 좋겠습니다.

`user.valid_password?` 메서드는 `BCrypt` 젬을 이용하여 암호화했던 비밀번호를 해독하고, 맞는지 확인하는 역할을 합니다.

`JwtIssuer` 클래스는 라이브러리로 활용하기 위해 `lib/moneybook_api/services` 폴더에 작성했습니다. 여기에 작성해 두면 다른 앱이나 액션에서 자유롭게 사용할 수 있기 때문입니다.

```ruby
# lib/moneybook_api/services
class JwtIssuer
  DEFAULT_EXPIRE_TIME = 86400 # 24 hours

  def self.encode(user_id, exp = Time.now.to_i + DEFAULT_EXPIRE_TIME)
    payload = { user_id: user_id, iss: ENV['JWT_ISSUER'], exp: exp }
    token = JWT.encode(payload, ENV['JWT_SECRET'], 'HS256')
    { auth_token: token }
  end

  def self.decode(token)
    JWT.decode(token, ENV['JWT_SECRET'], true)[0]
  end
end
```

코드의 내용은 [JWT 젬의 사용법을 따라](https://github.com/jwt/ruby-jwt/blob/master/README.md#algorithms-and-usage) 우리가 필요한 부분을 캡슐화한 정도입니다. 토큰 생성 시점에서 24시간의 기한을 주었고, `iss` 옵션은 발행자 옵션인데, 임의로 `localhost` 로 지정해두었습니다. `ENV['JWT_SECRET']` 같이 지정되어있는 환경변수를 가져오는 방법은 프로젝트 폴더에 `.env.development` 같이 되어있는 파일에다 작성는 것입니다.

```
# .env.development
# ...
JWT_SECRET="some secret"
# ...
```

비밀번호 토큰은 여러분이 원하는대로 만든 다음에, `Base64` 나 `Digest` 클래스를 활용하여 암호화하시길 추천합니다.

인코딩에 성공하면 컨트롤러 액션은 201 스테이터스와 함께 토큰 JSON을 리턴하게 됩니다.

```
$ curl -X POST -H "Content-Type: application/json" -H "Accept: application/json" -d '{ "user": { "email": "foo@bar.com", "foo": "cherryblossom" } }' "http://localhost:2300/api/auth/sign_in"
=>
{
  "auth_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo0LCJpc3MiOiJsb2NhbGhvc3QiLCJleHAiOjE0OTI5NjM2NTV9.38-CWKZkOuWD_idEOhv1gAret6_qG_ue7kk0iPftJ_M"
}
```

이제 사용자가 매 요청을 할 때마다 이 토큰이 유효한지 검사하는 부분을 만들어야 하는데, 가계부 기록 작성과 관련된 API를 구현한 뒤에 마저 만들어 보겠습니다.



## 가계부 API 만들기

가계부 API는 간단한 REST 형식으로 만들 예정입니다.

|             정의              |      내용      |
| :-------------------------: | :----------: |
|       /records (GET)        | 모든 레코드를 가져온다 |
|       /records (POST)       |  레코드를 생성한다   |
| /records/:record_id (PATCH) | 해당 레코드를 수정한다 |
| /records/:record_id(DELETE) | 해당 레코드를 삭제한다 |

RESTful API 라면 보통 사용자가 가지고 있는 레코드를 표현해야 하니까 URL 어딘가에 `user_id` 같은게 있어야 할 것 처럼 보입니다. 하지만 우리가 구현하고자 하는 서버에는 필요가 없습니다. JWT 토큰을 HTTP 헤더에 추가하여 요청을 하면, 서버가 토큰을 해석하여 `user_id` 를 찾아내고 그 값을 기반으로 특정 사용자의 레코드를 검색하게 됩니다.



### 모델 생성 & 라우팅

일단 레코드 모델과 레코드를 생성하는 액션을 만들고 나서, 토큰 인증 과정을 덧붙이도록 하겠습니다.

```
bundle exec hanami generate model record
```

```ruby
# db/migrations/2017**_create_records.rb
Hanami::Model.migration do
  change do
    create_table :records do
      primary_key :id
      foreign_key :user_id, :users, on_delete: :cascade, null: false

      column :amount,      Integer, null: false
      column :description, String

      column :created_at, DateTime, null: false
      column :updated_at, DateTime, null: false
    end
  end
end
```

외부 키는 컬럼 이름과, 연결해 줄 테이블 이름을 지정해줍니다. 나머지 뒤에 있는 요소들은 [공식 문서에 자세한 설명이 있으니](http://hanamirb.org/guides/migrations/create-table/) 참조바랍니다. 그리고 마이그레이션을 실행하면 됩니다.

그 다음에 액션을 생성하고 라우트를 지정하겠습니다. 다른 `records` 관련 액션을 미리 생성해두셔도 상관 없습니다.

```
bundle exec hanami generate action api records#create --skip-view

```


```ruby
# apps/api/config/routes.rb
# ...
resources :records, only: [:index, :create, :update, :destroy]
```

이 부분은 레일즈의 자동 라우팅과 아주 유사합니다. 라우팅이 어떻게 구성되었는지 확인하시려면 `bundle exec hanami routes` 커맨드를 실행하시면 됩니다.

```
    Name Method     Path                           Action

         POST       /api/auth/sign_in    Api::Controllers::Auth::SignIn
         POST       /api/auth/sign_up    Api::Controllers::Auth::SignUp
 records GET, HEAD  /api/records         Api::Controllers::Records::Index
 records POST       /api/records         Api::Controllers::Records::Create
  record PATCH      /api/records/:id     Api::Controllers::Records::Update
  record DELETE     /api/records/:id     Api::Controllers::Records::Destroy
```

### 레코드 생성

이제 세부 로직을 구현할 준비가 끝났으니 레코드 생성을 해 보겠습니다. 지금은 임의의 사용자를 지정하여 레코드를 생성하려 합니다.

```ruby
# apps/api/controllers/records/create.rb
module Api::Controllers::Records
  class Create
    include Api::Action

    params do
      required(:record).schema do
        required(:amount).filled(:int?)
        optional(:description).filled(:str?)
      end
    end

    def call(params)
      halt 422, 'Invalid Parameters' unless params.valid?
      user = UserRepository.new.first
      amount = params.get(:record, :amount)
      description = params.get(:record, :description)

      record = RecordRepository.new.create(
        user_id: user.id,
        amount: amount,
        description: description
      )

      status 201, record.to_json
    end
  end
end
```

패러매터가 유효하면 레코드를 생성하고 그 정보를 JSON으로 리턴하는 간단한 내용의 코드입니다. 이제 패러매터의 유효성은 둘째치고 모든 액션에 앞서 토큰의 유효성을 검사하는 모듈이 필요합니다. 이 파일을 어디에 정의하고 어떻게 사용하는지 [가이드에 잘 설명이 되어있는데](http://hanamirb.org/guides/actions/share-code/), 가이드의 내용을 활용하여 만들어보겠습니다.



### 토큰 인증

컨트롤러에 공통적으로 사용되는 모듈은 해당 앱의 `/controllers` 폴더에다 바로 작성하면 됩니다. 그리고 모든 컨트롤러 액션에 공통적으로 사용하고자 하면 `application.rb` 파일을 수정해야 합니다.

```ruby
# apps/api/controllers/authentication.rb
module Api
  module Authentication
    module Skip
      def authenticate!
      end
    end

    def self.included(action)
      action.class_eval do
        before :authenticate!
      end
    end

    private

    def authenticate!
      halt 401 unless authenticated?
    end

    def authenticated?
      !!current_user
    end

    def current_user
      user_id = validate_token ? validate_token['user_id'] : nil
      UserRepository.new.find(user_id)
    end

    def validate_token
      token_header = request.get_header('HTTP_AUTHORIZATION')
      token = token_header.gsub(/^Bearer\s/, '')

      begin
        JwtIssuer.decode(token)
      rescue
        nil
      end
    end
  end
end
```

몇 가지 이상한 녀석들이 나왔습니다. 일단 `included` 메서드는 모듈이 특정 모듈이나 클래스에 `include` 될 때 실행되는 훅(Hook)과 같은 메서드입니다. 인자 `action` 은 이 모듈을 불러온 액션을 뜻합니다. 그리고 `class_eval` 은 해당 클래스에 블락의 내용을 추가로 작성해주는 메서드라고 이해하시면 됩니다. 즉 이 모듈을 불러오는 클래스는 `before :authenticate!` 라는 코드 라인이 추가되는겁니다. `before` 는 레일즈의 `before_action` 처럼 해당 액션을 실행하기 전에 먼저 실행되는 메서드를 정의합니다.

마지막으로 `request` 는 `Rack::Request` 에 정의되어 있는 객체입니다 [가이드에 간단한 사용법이 있지만](http://hanamirb.org/guides/actions/request-and-response/) 더 자세한 사용법을 보시려면 [직접 문서를 보셔야 합니다](http://www.rubydoc.info/gems/rack/Rack/Request).

사용자는 발급받은 토큰을 매 HTTP 헤더에 실어서 보내야 합니다. 그 형식은 `Authorization => Bearer {token}` 이 되도록 지정했습니다.

이제 애플리케이션 설정 파일에서 이 모듈을 공통적으로 불러오게 하겠습니다.

```ruby
# apps/api/application.rb
# ...
require_relative './controllers/authentication'
# ...
      controller.prepare do
        include Api::Authentication # included in all the actions
      end
# ...
```

약 260번째 줄 부근에 해당 코드가 있습니다. 모든 컨트롤러 액션에 이 블록 안의 코드가 추가됩니다. 맨 윗줄에 `require_relative` 로 파일을 불러오는 걸 잊어버리시면 안됩니다.

그 다음 `records#create` 액션의 코드를 수정해줍시다. 한 줄이면 됩니다.

```ruby
# apps/api/controllers/records/create.rb
# ...
user = current_user
# ...
```

테스트를 잘 작성해오셨다면 전혀 뜬금없이 회원 가입, 로그인 액션에서 오류가 납니다. 인증 토큰을 요구할 필요가 없는 액션에서도 토큰을 요구하고 있기 때문입니다. 하지만 위에 인증을 스킵할 수 있도록 오버라이드용 메서드를 정의해 두었으니 `Api::Authentication::Skip` 모듈을 불러오기만 하면 됩니다.

```ruby
# apps/api/controllers/auth/sign_up.rb
module Api::Controllers::Auth
  class SignUp
    include Api::Action
    include Api::Authentication::Skip
# ...
```



### 나머지 액션들 작성

이제 레코드를 만들고, 인증하는 과정을 만들었으니 나머지 액션들은 비교적 간단합니다. 간단하게 작성한 코드를 참고해주세요.

```ruby
# apps/api/controllers/records/index.rb
module Api::Controllers::Records
  class Index
    include Api::Action

    def initialize(repository: RecordRepository.new)
      @repo = repository
    end

    def call(params)
      status 200, get_records.to_json
    end

    private

    attr_reader :repo

    def get_records
      records = repo.by_user(current_user).map { |record| record.to_h }

      {}.tap do |hash|
        hash.store(:records, records)
      end
    end
  end
end
```

`by_user` 메서드는 `RecordRepository` 에 정의되어 있습니다. 사실 레일즈 사용자분들이라면 모델에 `has_many` 같은 메서드를 사용하여 1:N 관계를 정의하는 경우가 보편적일텐데요. 하나미도 [최근에 그런 기능을 지원하기 시작헀지만](http://hanamirb.org/guides/models/associations/) 아직 실험적인 기능이기 때문에 직접 구현했습니다.

```ruby
# lib/moneybook_api/repositories/record_repository.rb
class RecordRepository < Hanami::Repository
  def by_user(user)
    records.where(user_id: user.id)
  end
end
```

이후의 결과물은 완성된 Hash나 Array가 아니라 `Enumerator` 같은 객체라서 원하는 결과물을 반복 메서드를 사용하여 다양하게 다룰 수 있습니다.

```ruby
require_relative './set_record'

module Api::Controllers::Records
  class Update
    include Api::Action
    include SetRecord

    params do
      required(:record).schema do
        required(:amount).filled(:int?)
        optional(:description).filled(:str?)
      end
    end

    def initialize(repository: RecordRepository.new)
      @repo = repository
    end

    def call(params)
      halt 422, 'Invalid Parameters' unless params.valid?

      begin
        updated_record = repo.update(record.id, params.get(:record))
        status 200, updated_record.to_h.to_json
      rescue
        status 400, { error: 'There was a problem during the process' }.to_json
      end
    end

    private

    attr_reader :repo, :record
  end
end
```

`SetRecord` 모듈도 [공식 가이드의 내용](http://hanamirb.org/guides/actions/share-code/)을 참고하여 만들었습니다. Update와 Destroy 액션에서 공통적으로 레코드를 찾는 과정이 필요한데, 모듈에다 구현해두고 여러 액션에서 재활용할 수 있도록 만든겁니다.

```ruby
# apps/api/controllers/records/set_record.rb
module Api::Controllers::Records
  module SetRecord
    def self.included(action)
      action.class_eval do
        before :set_record
      end
    end

    private

    def set_record
      @record = RecordRepository.new.find(params[:id])
      halt 404 unless @record
    end
  end
end
```

```ruby
# apps/api/controllers/records/destroy.rb
require_relative './set_record'

module Api::Controllers::Records
  class Destroy
    include Api::Action
    include SetRecord

    def initialize(repository: RecordRepository.new)
      @repo = repository
    end

    def call(params)
      begin
        repo.delete(record.id)
        status 204, { success: 'Successfully Removed' }.to_json
      rescue
        status 400, { error: 'There is a problem during the process' }.to_json
      end
    end

    private

    attr_reader :repo, :record
  end
end
```

축하합니다. 여러분은 하나미로 간단 API 서버를 가독성 높고 모듈화하기 용이한 루비 코드로 작성하였습니다.

---

사실 더 개선할 부분들은 많습니다. 예를 들면 Interactor 를 활용한 로직 분리, 명확한 의존성 주입으로 테스트 효율 높이기 + 더 짜임새 있는 테스트 작성 등을 고려해야겠지요. 마침 [비슷한 내용의 예제 코드가 아주아주 높은 퀄리티로 작성되어 있어서](https://github.com/nickgnd/hanami-jwt-example) 이번 튜토리얼을 구현해보면서 기본 개념을 익히신 다음에, 다른 예제를 참고하시면 큰 도움이 될 것이라 생각합니다.

- Source Code: [Github](https://github.com/emaren84/moneybook_api)
