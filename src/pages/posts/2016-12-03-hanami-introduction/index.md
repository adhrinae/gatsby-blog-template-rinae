---
path: "/posts/hanami-introduction"
date: "2016-12-03"
title: "레일즈(Ruby on Rails)와는 또 다른 루비 웹 프레임워크, Hanami(하나미)"
category: "Hanami"
tags:
  - Ruby
  - Rails
  - Hanami
---

- **본 포스팅은 [루비 대림절 달력](http://ruby-korea.github.io/advent-calendar/)을 위해 제작하였습니다**
- **기본적인 루비 언어 및 루비 온 레일즈의 이해도가 있는 독자를 대상으로 작성하였습니다**
- **작성자의 지식이 부족하여 설명이 부족하거나 잘못된 정보가 있다면 제보 부탁드립니다**


## 들어가며

아직 갓 6개월 된 초보 개발자로서 이제 루비 온 레일즈(이하 레일즈)에 조금씩 익숙해지던 차에, 상사로부터 '하나미라는 프레임워크가 있으니 한번 리서치를 해 보세요' 라는 권유를 받았다. 그는 루비로 백엔드 서버들을 구축했지만 레일즈는 자신의 취향에 맞지 않다고 했고, 구조적으로도 하나미가 더 나아보인다고 이야기하였다.

그리고 하나미 공식 가이드를 쭉 읽어본 나에게는 혼돈과 절망만 남았다. 루비 뿐 아니라 웹 개발의 기초 지식이 부족해서 그런지 도저히 이게 어떻게 돌아가는건지도 모르겠고, 레일즈에 대입해서 이해할 수 있는 것도 아니라는 생각이 들었다.

다시 6개월을 다른 레일즈 프로젝트 제작, 리서치 작업을 하며 보내고 나니 회사에서는 본격적으로 레일즈 사용을 하지 않고 하나미를 사용하는 방향으로 가닥을 잡았다. 어쩌다가 레일즈라는 걸출한 웹 프레임워크를 두고 생소한 하나미라는 프레임워크를 사용하게 되었는지, 이번 기회를 통해 독자 분들의 관심을 이끄는 계기를 만들어보고자 한다.



## 변화가 일고 있는 레일즈 커뮤니티

레일즈는 2005년에 처음 소개 된 이후 빠르고 쉬운 웹 애플리케이션 개발을 위한 도구로써 많은 개발자들의 사랑을 받아왔다.

'프로그래머의 단짝 친구' 라고 소개할 정도로 쉽고 재미있는 언어인 루비를 기반으로 삼은 프레임워크이기도 하고, 꼭 루비 문법을 모두 꿰고 있어야 할 정도로 많은 지식을 알고 있지 않아도 금방 어지간한 웹 애플리케이션을 제작할 수 있다는 점이 주요 셀링 포인트라고 여겨진다.

소위 'Rails Magic' 덕분에 form에 변수를 할당하는 것으로 경로 설정이 알아서 되거나 스캐폴딩만 해도 신기하게 돌아가는 애플리케이션을 보며 감탄했던 적이 한두 번이 아니었다.

2016년 현재 레일즈는 버전 5까지 발매되었고, 더 많은 기능이 구현되어 있으며 커뮤니티는 많이 거대해졌다. 거대해진 레일즈 세계와 함께 그 음영을 느끼는 개발자들도 조금씩 늘어나게 되었다.

예를 들어 보통 레일즈 애플리케이션을 오래 개발해온 사람들은 애플리케이션의 규모가 커질수록 유지보수하는게 힘들어진다는 점을 지적하고 있는데, 이를 해결하기 위해 **Fat model, Skinny controller** 등의 방법론이 제시되고 있지만 '뭔가 문제가 있다'는 의견들은 끊임없이 제시되고 있다.

또한 DHH(David Heinemeier Hansson, 레일즈의 창시자)가 제시하고 있는 ['Rails way'에 반감을 가진 사람들이 점차 늘어나고](http://solnic.eu/2016/05/22/my-time-with-rails-is-up.html) 루비로 웹 개발을 하는 것에 대해 [더 나은 방법을 찾는](http://rwdtow.stdout.in/) 사람들이 점차 늘어나고 있다.

![현재 레일즈 커뮤니티](2016-12-03-sc1.jpg)

*현재 레일즈 커뮤니티의 묘사 - 출처: http://railshurts.com/current_state*

이러한 분위기 속에서 'Ruby way, not Rails' 를 표방하는 루비 기반 웹 프레임워크가 등장하였으니, 바로 이번에 소개할 [Hanami(하나미)](hanamirb.org)이다.



## 하나미가 뭐죠?

하나미는 이탈리아의 개발자 [Luca Guidi](https://lucaguidi.com) 가 개발한 루비 MVC 웹 프레임워크이다. 2014년에 Lotus라는 이름으로 처음 등장하였으나, IBM의 Louts 상표권과 엮이는 문제가 있어 지금의 이름으로 변경하게 되었다.

새로운 이름으로 **하나미**라는 이름을 쓰게 된 이유는 '꽃구경' 이라는 일본어 본래의 뜻에 걸맞게 함께 하는 커뮤니티의 중요성을 일깨운다는 점을 강조하기 위해서라고 한다. 루비의 창시자 Matz와(일본인이다) 루비 그 자체에 대한 찬사의 의미도 가지고 있다.

하나미의 특징을 몇 가지 소개하자면 먼저 최대한 루비라는 언어를 직접적으로 사용하는 방식으로 구현되어 있다는 점이다. 다만 이 때문에 레일즈를 습득하는데 루비 지식이 크게 필요하지 않은 것과 다르게 일정 수준의 루비 언어의 이해를 요구한다.

또한 Magic을 최대한 배제하고(하나미 Gitter 채팅방에서 혹은 몇몇 포스트에서 "I'm now sick of rails magic!" 이라고 주장하는 사람들이 많이 보인다) 개발자가 최대한 자신이 무엇을 하고 있는지 인지하면서 앱을 제작하도록 유도한다.

그리고 보통 Rails best practice 로 제시되는 요소들을 기본적으로 구현하고 있다.

- 컨트롤러는 HTTP 콜만 다룬다 -> 액션에서 비지니스 로직을 분리하여 처리하기 위해 `Interactor` 라는 모듈이 있다
- 퍼시스턴스 로직과 도메인 로직을 분리한다 -> 하나미 모델은 기본적으로 도메인과 퍼시스턴스 레이어가 분리되어 있다
- 루비 객체를 만들어서 제대로 OOP를 한다 -> 하나미는 OOP 개념을 잘 지키기 위해 노력한다. 또한 모듈화도 굉장히 쉽다

하나미 가이드 페이지 첫머리에서 제시하는 ['하나미를 선택하는 이유'](http://hanamirb.org/guides/#why-choose-hanami-) 를 가볍게 살펴보면 이렇게 말하고 있다.

- 하나미는 가볍다 -> 상대적으로 짧은 코드, 웹 애플리케이션 개발에 필요한 필수적인 부분에 초점을 맞춤
- 하나미는 구조적으로 건전하다 -> 컨트롤러 액션은 각각의 클래스로 분리되어 있으며 테스트하기 용이하다
- 하나미는 스레드에 안전하다 -> (아직 이런 문제를 겪을만한 규모의 앱을 작성해본 적이 없어서 설명하기 어렵다)

또한 하나미는 컨테이너 형태의 앱 구조를 기본적으로 제공한다. 덕분에 한 개의 프로젝트를 생성하여 API 서버와 웹 서버를 동시에 운용하는게 가능하다. 물론 레일즈로도 비슷한 구성을 할 수야 있겠지만 충돌 없는 구현을 위해 앱의 구조가 훨씬 복잡해질 가능성이 높다.



## 만들어 볼까요

글을 길게 써 보았지만, 개발자들에겐 장황한 글보다 코드 몇 줄을 보는 것이 훨씬 이해가 빠를 것이다. 하나미의 공식 가이드를 따라가면서 눈여겨 볼 점들을 소개하겠다.



### Bookshelf 프로젝트 생성

이번에 만들어볼 애플리케이션(이하 앱)은 `Bookshelf` 라는 앱이다. 책의 제목과, 작가가 있고 이 책들의 리스트를 살펴보고 책을 추가할 수 있는 기능을 가지고 있다. 가이드에서 수정과 삭제는 다루고 있지 않아 조금 아쉬운 느낌이 들지만 기본적인 웹 개발(레일즈) 지식이 있다면 구현하는 것이 그렇게 어렵지는 않다.

기본적으로 루비 버전은 2.3+ 을 권장한다. 또한 데이터베이스는 sqlite3를 사용할 예정이다.

먼저 하나미로 프로젝트를 생성하기 위해서는 `gem install hanami` 로 하나미가 설치되어 있어야 한다. 그 다음에는 새 프로젝트를 생성해본다.

    $ hanami new bookshelf
    

생성된 프로젝트의 폴더 구조를 살펴보면 다음과 같다.


```
$ tree -L 2
.
├── Gemfile
├── Rakefile
├── apps
│   └── web
├── config
│   ├── environment.rb
│   └── initializers
├── config.ru
├── db
│   ├── migrations
│   └── schema.sql
├── lib
│   ├── bookshelf
│   └── bookshelf.rb
├── public
└── spec
    ├── bookshelf
    ├── features_helper.rb
    ├── spec_helper.rb
    ├── support
    └── web
```

여기서 특이한 점은 `apps` 라는 폴더가 있다는 점인데 기본 컨테이너는 `web` 이지만 사용자가 웹 브라우저로 보는 애플리케이션 이외에 같은 데이터베이스를 공유하는 api 서버 등을 따로 만들고자 하면 제네레이터로 따로 컨테이너를 생성할 수 있다. 그러면 같은 데이터베이스 사용하는 별개의 앱을 따로 구축할 수 있다는 장점이 있다. (물론 라우팅은 다르겠지만.. 이 부분은 `mount` 옵션으로 처리할 수 있다) [- 참고](http://hanamirb.org/guides/getting-started/#hanami-architecture)

각 앱들에는 별개의 설정 파일, 컨트롤러, 뷰, 라우트, 템플릿 파일 및 폴더가 있다.

테스트는 사용자가 원하는 어떤 형태로도 이용할 수 있다.(minitest or rspec) 하나미에서는 minitest를 기본으로 사용하며 capybara 젬도 사용한다. 이번 포스팅에서는 테스트를 구현하는 부분은 넘어가고자 한다. 테스팅이 궁금한 분들은 공식 가이드를 참조하시라.



### 루트 페이지 만들기

라우팅은 각 앱의 `config/routes.rb` 파일에서 설정한다.

```ruby
# apps/web/config/routes.rb
root to: 'home#index'
```

그러면 home 컨트롤러의 index 액션을 실행해주기 위해 제네레이터로 액션을 생성해본다. 아직 하나미는 레일즈처럼 다양하고 세분화된 옵션의 CLI를 제공하진 않는다. 번거롭긴 하지만 개발에 큰 지장은 없다.

```
$ bundle exec hanami generate action web home#index
    create  spec/web/controllers/home/index_spec.rb
    create  apps/web/controllers/home/index.rb
    create  apps/web/views/home/index.rb
    create  apps/web/templates/home/index.html.erb
    create  spec/web/views/home/index_spec.rb
    insert  apps/web/config/routes.rb
```

`action` 뒤에 있는 `web` 은 액션을 생성하고자 하는 컨테이너의 이름이다. 그 다음에 컨트롤러와 액션 이름을 적어주면 된다. 앱 구조가 단독 컨테이너 구조일 경우(`hanami new` 커맨드로 앱 생성시 `--arch=app` 옵션을 주어 단독 컨테이너 앱 생성도 가능하다)에는 바로 액션 이름만 작성해주어도 된다.

아쉬운 점은 매 액션마다 저 명령어를 작성해주어야 한다는 점이다. `hanami-scaffold` 라는 젬이 있지만 그닥 유지보수는 되지 않고 있어서 사용하는 것을 추천하지 않는다.

컨트롤러는 폴더에 불과하며 그 폴더에 속한 각각의 액션 파일에 컨트롤러가 정의되어 있는 형태이다. 또한 뷰는 템플릿 파일(레일즈의 views 폴더 안에 있는 템플릿들)과 뷰 파일(레일즈에 비유하자면 뷰 헬퍼와 비슷)로 구성되어있다. 지금은 템플릿 파일에 간단하게 제목을 추가해보도록 한다.

```markup
# apps/web/templates/home/index.html.erb
<h1>Bookshelf</h1>
```

*(주의) 템플릿 파일이 변경될 때에는 서버를 재실행할 필요가 없지만, 컨트롤러 등의 루비 파일이 변경될 때에는 서버를 재실행해야 한다.*

그리고 서버를 실행한 뒤 `localhost:2300` 으로 접속해보면 심플하지만 Bookshelf라는 글씨가 보이는 페이지를 마주할 수 있다.
(본 포스트에서는 빠른 진행을 위해 `application.html.erb` 파일을 미리 수정해두었다)

    $ bundle exec hanami server
    

![Bookshelf Title](2016-12-03-sc2.png)


### 모델 구축하기

본격적으로 책들을 저장하고 출력하기 위해 데이터베이스 마이그레이션을 진행해 보도록 한다. 먼저 마이그레이션 파일을 생성한다.

    $ bundle exec hanami generate migration create_books
    

생성된 마이그레이션 파일은 이렇게 작성해 보았다.

```ruby
# db/migrations/20161203083239_create_books.rb
Hanami::Model.migration do
  change do
    create_table :books do
      primary_key :id

      column :title,  String, null: false
      column :author, String, null: false

      column :created_at, DateTime, null: false
      column :updated_at, DateTime, null: false
    end
  end
end
```

`primary_key` 가 반드시 `id` 일 필요는 없다. 또한 `String`, `DateTime` 은 루비 타입이다(루비 클래스). 반드시 루비 타입을 사용할 필요는 없고 `"varchar(255)"` 같이 데이터베이스 타입을 문자열로 직접 작성해주어도 된다.

마이그레이션 파일 작성이 완료되면 테이블을 생성해주는 명령어를 입력한다.

    $ bundle exec hanami db prepare
    $ bundle exec hanami db migrate

그리고 `Book` 모델을 생성해준다.

```
$ bundle exec hanami generate model book
      create  lib/bookshelf/entities/book.rb
      create  lib/bookshelf/repositories/book_repository.rb
      create  spec/bookshelf/entities/book_spec.rb
      create  spec/bookshelf/repositories/book_repository_spec.rb
```

생성된 파일을 보면 조금 특이한 점을 볼 수 있는데 `entities` 폴더와 `repositories` 폴더가 따로 나뉘어져 있다는 점이다. `Entity` 는 도메인 객체로, 실제 데이터베이스 쿼리 등으로 추출된 자료 객체를 일컫는다. `Repository` 는 퍼시스턴스 계층과 `Entity` 를 이어주는 역할을 한다. 여기서 `Entity` 는 데이터베이스의 존재를 전혀 모르는 단순 루비 객체이며 테스트가 용이하고 가벼운 앱을 만드는데 도움이 된다.

실제 콘솔에서 레코드를 다루어보면 이런 방식으로 동작한다.

```
$ bundle exec hanami console
>> repo = BookRepository.new
=> #<BookRepository:... >
>> repo.all
=> []
>> book = repo.create(title: 'TDD', author: 'Kent Beck')
=> #<Book:... @attribute={:id => 1, :title => "TDD", :author => "Kent Beck" ... }>
>> repo.find(book.id)
=> #<Book:... @attribute={:id => 1, :title => "TDD", :author => "Kent Beck" ... }>
```

`Repository` (이하 리퍼지토리)에서 제공되는 메서드로 데이터베이스에 `Entity` (이하 엔티티)를 조작할 수 있고, 엔티티에는 따로 속성 혹은 동작을 지정할 수 있다. 그래서 레일즈에서 사용하는 `scope` 나 커스텀 쿼리가 작성된 메서드 등은 리퍼지토리 클래스에 분리해 둘 수 있다.



### 데이터를 표현하기

임의로 몇 개의 `Book` 레코드를 생성해주고 리스트를 표현해보기 위해 새 컨트롤러 액션을 생성한다.

    $ bundle exec hanami generate action web books#index
    

```markup
# apps/web/templates/books/index.html.erb
<h2>All books</h2>

<% if books.any? %>
  <div id="books">
    <% books.each do |book| %>
      <div class="book">
        <h2><%= book.title %></h2>
        <p><%= book.author %></p>
      </div>
    <% end %>
  </div>
<% else %>
  <p class="placeholder">There are no books yet.</p>
<% end %>
```

여기서 `books` 는 어디서 온 것일까? 실제로 액션 부분은 이렇게 작성되어 있다.

```ruby
# apps/web/controllers/books/index.rb
module Web::Controllers::Books
  class Index
    include Web::Action

    expose :books

    def call(params)
      @books = BookRepository.new.all
    end
  end
end
```

`expose` 메서드의 사용은 하나미의 규칙으로, `expose` 로 지정한 변수만 템플릿으로 노출되며 그 변수는 `call` 메서드 안에 인스턴스 변수로 존재해야 한다.

![Bookshelf list](2016-12-03-sc3.png)



### 새로운 책을 등록하기

웹 페이지에서 새로운 책을 등록하기 위해서는 `new`, `create` 액션과 패러매터를 전달해 줄 `Form` 이 필요할 것이다. 먼저 `books#new`, `books#create` 액션을 생성해 준 뒤에 라우팅을 조금 깔끔하게 다듬어주도록 한다.

```ruby
# apps/web/config/routes.rb
root to: 'home#index'
resources :books, only: [:index, :new, :create]
```

하나미는 REST를 기본적으로 지원한다. 2번째 줄에서 사용 된 `resources` 는 보통 레일즈 라우트 파일에서 자주 보았던 그 `resources` 메서드처럼 사용하면 된다.

```
$ bundle exec hanami routes
        Name Method     Path           Action

        root GET, HEAD  /              Web::Controllers::Home::Index
       books GET, HEAD  /books         Web::Controllers::Books::Index
    new_book GET, HEAD  /books/new     Web::Controllers::Books::New
       books POST       /books         Web::Controllers::Books::Create
```

다음은 `new` 템플릿에 폼 헬퍼(Form helper) 를 이용하여 간단한 폼을 작성해준다.

```markup
# apps/web/templates/books/new.html.erb
<h2>Add book</h2>

<%=
  form_for :book, routes.books_path do
    div class: 'input' do
      label      :title
      text_field :title
    end

    div class: 'input' do
      label      :author
      text_field :author
    end

    div class: 'controls' do
      submit 'Create Book'
    end
  end
%>
```

폼 헬퍼의 구조가 레일즈의 `form_for` 헬퍼와는 사뭇 다르다. 간단하게 차이점을 이야기하자면 하나미의 `form_for` 는 레일즈의 `form_tag` 헬퍼에 가깝다고 생각하면 된다. [하나미 가이드에 따르면](http://hanamirb.org/guides/helpers/forms/#technical-notes) `form_for do |f|` 형식으로 작성하는 것은 올바른 ERB 템플릿이 아니며, 하나미의 폼 헬퍼는 템플릿 엔진에 의존하지 않고 사용할 수 있도록(어느 템플릿 엔진을 사용하던 같은 루비 코드를 사용하도록) 구성되어 있다.

`routes.books_path` 는 라우팅 헬퍼이며 상기 라우팅 구조에 있는 이름을 사용하여 `routes` 뒤에 메서드 형식으로 붙여주면 자동으로 경로를 연결해준다.

책을 생성하기 위한 `create` 액션은 다음과 같이 작성한다.

```ruby
# apps/web/controllers/books/create.rb
module Web::Controllers::Books
  class Create
    include Web::Action

    expose :book

    def call(params)
      @book = BookRepository.new.create(params[:book])

      redirect_to routes.books_path
    end
  end
end
```

이후 생성된 폼에 새로운 책을 등록해보니 문제없이 책이 생성되었다.



### 유효성 검사

하나미는 유효성 검사를 모델이 아닌 컨트롤러 액션에서 처리한다. 물론 엔티티 클래스에 유효성 검사를 정의할 수 있지만, 유효성 검사는 입력 이후 가장 가까운 단계에서 이루어질 것을 권장하고 있다.

```ruby
# apps/web/controllers/books/create.rb
module Web::Controllers::Books
  class Create
    include Web::Action

    expose :book

    params do
      required(:book).schema do
        required(:title).filled(:str?)
        required(:author).filled(:str?)
      end
    end

    def call(params)
      if params.valid?
        @book = BookRepository.new.create(params[:book])

        redirect_to routes.books_path
      else
        self.status = 422
      end
    end
  end
end
```

`params` 로 시작하는 유효성 검사는 엔티티를 정의해놓은 것 같은 역할을 할 수 있겠다. 자세한 내용은 [가이드](http://hanamirb.org/guides/actions/parameters/)를 참고하면 손쉽게 작성할 수 있다.

만약 패러매터가 유효하지 않다면 HTTP 상태 코드 422(Unprocessable Entity)를 리턴하고, 그에 알맞는 뷰를 다시 표현해 주어야 한다. 현재 `create` 액션에는 아무런 템플릿도 작성되어있지 않고, 실제로는 `new` 템플릿을 그대로 사용하면 되기 때문에 뷰 파일에 알맞는 템플릿을 정의해주면 된다.

```ruby
# apps/web/views/books/create.rb
module Web::Views::Books
  class Create
    include Web::View
    template 'books/new'
  end
end
```

지금까지 하나미를 통해 간단한 웹 애플리케이션을 개발하는 과정을 살펴보았다. 아주 기초적인 부분만 설명하였지만, 가이드를 살펴보고 하나미의 기능에 조금 더 익숙해진 뒤에는 github에 올라와 있는 몇몇 프로젝트 소스를 살펴보면서 하나미를 파악해보는 것을 추천한다.

개인적으로 [이 Github 저장소](https://github.com/bruz/bookshelf-delivery-example)를 방문해 보는 것을 추천한다. 하나미의 컨테이너 구조 및 컨트롤러 액션과 비지니스 로직을 구분하는 예를 잘 보여준 코드로 구성되어있다.(`lib` 폴더 안에 있는 `interactors` 폴더에 주목하라)

본 포스팅에 사용된 코드는 [여기서](https://github.com/emaren84/hanami-introduction) 확인해 볼 수 있다.


## 결론

루비는 일반적 용도의 언어로써 충분히 완성도가 있는 언어이지만 상대적으로 다양한 분야에서 사용되는 파이썬에 비해 어느샌가 웹 개발에만 쓰이는 언어라는 선입견이 심어지게 되었다. 그리고 이러한 선입견의 중심엔 레일즈가 있다.

레일즈가 등장하고 루비라는 언어가 크게 알려지는 데 기여한 것은 사실이다. 하지만 이 세상에 특정 문제 해결을 위한 단 하나의 정답은 거의 없다. 루비라는 언어 자체도 하나의 문제를 해결 하는데 다양한 방법을 제시하는 언어이기도 하다.

하나미의 등장도 이런 맥락에서 바라볼 수 있다. 단순히 레일즈만이 루비로 웹 애플리케이션을 만드는 최고의 방법이 아니며, 하나미를 잘 활용하면 레일즈에 비해 유지보수가 쉽고, 더 성능이 좋은 웹 애플리케이션을 작성할 수도 있을 것이다.

물론 하나미는 나온지 얼마 되지 않은 프레임워크이고, 기능 구현이 레일즈에 비해 상대적으로 부족한 점도 있다. **특히 문서화가 되어있지 않아 소스 코드를 이리저리 살펴보아야 하는 부분들이 아직 많이 있다는 점이 아쉽다.** 하지만 충분한 발전 가능성을 지니고 있고, 진정 루비라는 언어로 프로그래밍을 하는 재미를 주는 것이 매력적이기 때문에 루비 언어 자체를 좋아하는 사람들이라면 한번 사용해 볼 것을 추천한다.

하나미의 정보를 더 얻고자 하는 분들에게는 다음의 링크를 살펴보면 된다.

- [하나미 공식 가이드](http://hanamirb.org/guides/) + [소스 코드](https://github.com/hanami/hanami)
- [하나미 Gitter 채팅방](https://gitter.im/hanami/chat)
- [유용한 젬 및 링크 공유](https://github.com/davydovanton/awesome-hanami)

