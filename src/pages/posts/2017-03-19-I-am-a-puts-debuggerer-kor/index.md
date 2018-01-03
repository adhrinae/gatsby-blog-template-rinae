---
path: "/posts/i-am-a-puts-debuggerer-kor"
date: "2017-03-19"
title: "[번역] 나는 'puts' 디버거다"
category: "Translation"
tags:
  - Ruby
  - Debugging
  - Translation
---

- 본 포스트는 [Aaron Patterson](https://twitter.com/tenderlove)의 [포스트](https://tenderlovemaking.com/2016/02/05/i-am-a-puts-debuggerer.html)의 번역본입니다.
- 기본적인 루비 및 레일즈 지식을 가지고 있는 독자 대상의 글입니다.
- 피드백은 언제나 환영합니다.

---

저는 콘솔 디버거입니다 *(역주1: 원 제목의 'puts debuggerer'를 의역하였습니다. 루비의 puts는 전달받은 인자를 표준 출력(stdout)해주는 메서드입니다. 이후에도 puts debugging은 모두 콘솔 디버깅으로 번역하겠습니다)*. 진짜 디버거( `pry` , `byebug` 등)를 사용하는 사람들을 폄하하고자 이 이야기를 하는게 아닙니다. 진짜 디버거는 아주 좋다고 생각하지만, 저는 하나라도 제대로 배울 시간을 들이지 못했습니다. 매번 한 개라도 써보려고 하다가 결국엔 한동안 사용하지 않고, 다시 사용방법을 배워야만 합니다. 어쨌든, 이번 기회에 여러분에게 콘솔 디버깅을 할 때 사용하는 트릭을 좀 알려드리고자 합니다. 저는 이 트릭들을 무언가가 어떻게 작동하는지 이해가 되지 않을때나 작동 원리를 더 알고싶을 때 사용합니다. 아래에 이야기하게 될 대부분의 것들은 *절대로* 최선의 방법(best practice)가 아니며 여러분들은 디버깅 세션이 끝나면 절대 이 코드들을 남겨두어선 안됩니다. 그러나 여러분이 **무엇을 디버깅하던지** 아주 유용하다고 생각합니다. 정말로 뭐든지요. 전역 변수, 메서드 재정의, 조건문 추가, 불러오기 경로 수정, 몽키 패칭, 콜 스택 출력 등 **뭐든지요**.

저는 이 포스트에서 최대한 실제 접하는 예시들을 보여드리고 싶었습니다. 하지만 대부분의 예시들은 제가 레일즈의 보안 이슈를 디버깅하려고 할 때 나온 것들이라서, 이 코드의 테크닉은 재활용하셔도 좋지만 **코드 전체를 그대로 쓰시면 안됩니다.** 제가 디버깅하려는 코드들은 정상적으로 동작하지 않습니다. 거기다 이 코드를 사용하시는걸 원치도 않습니다.

매 섹션에 제가 겪었던 문제들을 제목으로 적어두었으며, 내용 부분에 제가 사용한 해결책을 적어두었습니다.

## 어디에 문제가 있는진 알겠는데, 어떻게 거기까지 가야할지 모르겠다

가끔 저는 문제가 어딨는지는 알지만 어떻게 그 부분까지 가는지 모르는 이슈들을 디버깅할 때가 있습니다. 이럴 때마다 저는 `puts caller` 를 넣어서 콜 스택을 끄집어냅니다.

예를 들어 제가 이런 코드를 작성했다고 칩시다.

```ruby
LOOKUP = Hash.new { |h, k| h[k] = Type.new(k) unless k.blank? }
```

여기서 저는 기본 블록이 어떻게 호출되는지 알고 싶을 때 이렇게 합니다.

```ruby
LOOKUP		= Hash.new { |h, k|
  puts "#" * 90
  puts caller
  puts "#" * 90
  h[k] = Type.new(k) unless k.blank?
}
```

위의 코드는 90개의 해시 태그를 출력하고 콜 스택을 출력한 뒤에, 나머지 90개의 해시 태그를 출력할 겁니다. 해시 태그는 여러번 호출될 때를 대비해서 콜 스택을 쉽게 구분하기 위해 넣어두었습니다. 참고로 이걸 "해시 태그"라고 부르는건 여러분을 골려주려고 그러는 겁니다.

저는 이 방법을 꽤 자주 사용하기 때문에 Vim 단축키를 지정해두었습니다.

```
" puts the caller
nnoremap <leader>wtf oputs "#" * 90<c-m>puts caller<c-m>puts "#" * 90<esc>
```

이렇게 하면 `<leader>wtf` 키 조합으로 커서가 있는 위치 바로 밑에 디버깅 코드를 삽입합니다.

### 콜 스택을 한 번만 출력하고 싶어

그냥 콜 스택을 출력한 뒤에 `exit!` 를 사용하거나, `raise` 를 호출하세요. `raise` 는 예외를 출력할거고, 어쨌든 콜 스택을 볼 수 있을겁니다.

### 콜 스택을 특정 경우에만 보고 싶어

이건 그냥 디버깅 코드니까 여러분이 하고싶은대로 하시면 됩니다. 예를 들어 제가 해시에 무언가를 추가할 때마다 콜 스택을 호출하고 싶다고 한다면, 이렇게 하면 됩니다.

```ruby
LOOKUP		= Hash.new { |h, k|
  unless k.blank?
    puts "#" * 90
    puts caller
    puts "#" * 90
    h[k] = Type.new(k)
  end
}
```

어차피 전 이 코드를 없애버릴거니까 어떤 이상한 조건문도 마음대로 추가할 수 있지요!



## 메서드를 호출했는데, 이게 어디에 있는건지 모르겠다

메서드를 호출했는데 그 메서드가 어디에 구현되어있는지 모를 때, 저는 `source_location` 메서드와 함께 `method` 메서드를 사용합니다. 예를 들어 (레일즈) 컨트롤러 안에 있는 액션이 `render` 메서드를 호출하고 있을 때, 저는 그 메서드를 어디서 호출하는지 알고 싶었습니다.

```ruby
def index
  render params[:id]
end
```

위의 코드를 이렇게 바꿔보겠습니다.

```ruby
def index
  p method(:render).source_location
  render params[:id]
end
```

호출해보도록 하지요.

```
$ curl http://localhost:3000/users/xxxx
```

그러면 로그에는 이렇게 출력됩니다.

```
Processing by UsersController#show as */*
  Parameters: {"id"=>"xxxx"}
["/Users/aaron/git/rails/actionpack/lib/action_controller/metal/instrumentation.rb", 40]
Completed 500 Internal Server Error in 35ms (ActiveRecord: 0.0ms)
```

이제 저는 `render` 메서드가 [instrumentation.rb 파일의 40번째 줄](https://github.com/rails/rails/blob/6fcc3c47eb363d0d3753ee284de2fbc68df03194/actionpack/lib/action_controller/metal/instrumentation.rb#L40)에 있다는 것을 알게 되었습니다.



## `super` 메서드를 호출했는데 그게 어디에 있는건지 모르겠다

`render` 메서드가 [super를 호출한다는 걸](https://github.com/rails/rails/blob/6fcc3c47eb363d0d3753ee284de2fbc68df03194/actionpack/lib/action_controller/metal/instrumentation.rb#L43) 알게 되었습니다만, 저는 그게 어디에 구현되어있는지 모릅니다. 이 경우에 `method` 의 리턴 값에 `super_method` 를 사용합니다.

```ruby
def index
  p method(:render).source_location
  render params[:id]
end
```

위의 코드를 이렇게 바꿉니다.

```ruby
def index
  p method(:render).super_method.source_location
  redner params[:id]
end
```

같은 요청을 해 보면 이런 결과를 얻을 수 있습니다.

```
Processing by UsersController#show as */*
  Parameters: {"id"=>"xxxx"}
["/Users/aaron/git/rails/actionpack/lib/action_controller/metal/rendering.rb", 34]
Completed 500 Internal Server Error in 34ms (ActiveRecord: 0.0ms)
```

이제야 `super` 가 [여기로 가는 게](https://github.com/rails/rails/blob/6fcc3c47eb363d0d3753ee284de2fbc68df03194/actionpack/lib/action_controller/metal/rendering.rb#L34) 보입니다. 이 메서드는 마찬가지로 `super` 를 호출하지만, 그냥 위의 작업을 반복하여(아니면 그냥 loop를 쓰면 됩니다!) 제가 진짜 알아보고자 하는 메서드를 찾을 수 있습니다.



## `method` 메서드의 구현체를 찾고자 한다면?

때때로 `method` 를 이용한 트릭이 작동하지 않을 때가 있습니다. 제가 알아보려는 객체가 자신만의 `method` 메서드를 구현하고 있기 때문입니다. 예를 들어 저는 `request` 객체에 `headers` 메서드가 구현된 위치를 찾고자 할 때 이런 코드를 사용했습니다.

```ruby
def index
  p request.method(:headers).source_location
  @users = User.all
end
```

제가 요청을 보내면 이런 에러가 뜹니다.

```
ArgumentError (wrong number of arguments (given 1, expected 0)):
  app/controllers/users_controller.rb:5:in `index'
```

이 경우는 `request` 객체가 자신만의 `method` 를 따로 구현하고 있기 때문입니다. `headers`  메서드를 찾아내기 위해 메서드를 `Kernel` 로부터 분리하고 `request` 객체에 다시 바인드 한 뒤 실행해보겠습니다.

```ruby
def index
  method = Kernal.instance_method(:method)
  p method.bind(request).call(:headers).source_location
  @users = User.all
end
```

요청을 다시 해보면 결과가 다르게 나옵니다.

```
Processing by UsersController#index as */*
["/Users/aaron/git/rails/actionpack/lib/action_dispatch/http/request.rb", 201]
```

이제서야 `headers` 메서드가 [여기에](https://github.com/rails/rails/blob/6fcc3c47eb363d0d3753ee284de2fbc68df03194/actionpack/lib/action_dispatch/http/request.rb#L201) 구현되어 있다는 것을 발견했습니다.

심지어 `method` 메서드의 구현체를 찾을 수도 있습니다.

```ruby
def index
  method = Kernal.instance_method(:method)
  p method.bind(request).call(:method).source_location
  @users = User.all
end
```



## (또) 뭔가 호출했는데 이게 어딨는지 모르겠다

가끔 당장 사용하고 있는 메서드가 실제로는 문제의 본질이 아닐 수 있습니다. 그래서 `method` 메서드를 사용하는 트릭은 별 도움이 안될 겁니다. 이럴 때엔 저는 `TracePoint` 라고 하는 더 큰 추적기(a larger hammer)를 사용합니다. `render` 메서드로부터 호출 된 *모든* 메서드의 리스트를 추출하기 위해 다시 한번 예를 들어보겠습니다. 리스트에 보이는 메서드들은 `render` 메서드가 직접 호출한 것은 아니지만 어딘가로부터 호출 된 것입니다.

```ruby
# GET /users
# GET /users.json
def index
  @users = User.all
  tp = TracePoint.new(:call) do |x|
    p x
  end
  tp.enable
  render 'index'
ensure
  tp.disable
end
```

저기 위치한 `TracePoint` 는 모든 "호출(`:call`)" 이벤트마다 작동하고, 블록은 메서드 이름과 호출된 위치를 출력할 것입니다. 여기서 "호출" 이라 함은 루비 메서드가 호출되는 경우를 말합니다(C 메서드는 제외). 만약 C 메서드가 호출되는 것을 보고 싶으시다면 `:c_call` 을 사용하세요. 이 예시는 *엄청난 양의* 결과가 출력될겁니다. 저는 호출될 메서드가 꽤 적거나, 도대체 어디부터 찾아봐야 할지 모를 때 이 방법을 사용합니다.



## 예외가 일어나는 것은 알겠지만, 어디서 발생하는지 모르겠다

예외가 발생할 때 *실제로* 어디서 예외가 발생했는지 모를 때가 있습니다. 이 예시는 레일즈 3.0.0을 기준으로 작성되었지만(참고로 이 문제는 수정되었습니다), 일단 이런 코드가 있다고 해보죠.

```ruby
ActiveRecord::Base.logger = Logger.new $stdout
User.connection.execute "oh no!"
```

SQL은 작동하지 않을 테고, 예외가 일어날 겁니다. 그렇다면 예외가 어떻게 발생하는지 보겠습니다.

```
  SQL (0.1ms)  oh no!
SQLite3::SQLException: near "oh": syntax error: oh no!
activerecord-3.0.0/lib/active_record/connection_adapters/abstract_adapter.rb:202:in `rescue in log': SQLite3::SQLException: near "oh": syntax error: oh no! (ActiveRecord::StatementInvalid)
	from activerecord-3.0.0/lib/active_record/connection_adapters/abstract_adapter.rb:194:in `log'
	from activerecord-3.0.0/lib/active_record/connection_adapters/sqlite_adapter.rb:135:in `execute'
	from test.rb:6:in `<top (required)>'
	from railties-3.0.0/lib/rails/commands/runner.rb:48:in `eval'
	from railties-3.0.0/lib/rails/commands/runner.rb:48:in `<top (required)>'
	from railties-3.0.0/lib/rails/commands.rb:39:in `require'
	from railties-3.0.0/lib/rails/commands.rb:39:in `<top (required)>'
	from script/rails:6:in `require'
	from script/rails:6:in `<main>'
```

여러분이 추적 내역(backtrace) 을 읽어보셨다면 *(역주2: backtrace하면 역추적 이라는 말이 직역하기는 좋지만, 보통 루비에서 backtrace를 떠올릴 때 콘솔에 뜨는 십수 줄의 추적 내역이 연상될 때가 많아서 추적 내역으로 번역하였습니다)*, 예외가 [abstract_adapter.rb의 202번째 줄](https://github.com/rails/rails/blob/9891ca8/activerecord/lib/active_record/connection_adapters/abstract_adapter.rb#L202)에서 발생했다는 것을 알 수 있습니다. 그러나 이 코드는 [예외가 발생한 상황에서 다시 예외를 일으키도록](https://github.com/rails/rails/blob/9891ca8/activerecord/lib/active_record/connection_adapters/abstract_adapter.rb#L199-L202) 되어있는게 보일 겁니다. 그렇다면 실제로는 어디서 예외가 일어난 걸까요? 정답을 찾기 위해 `puts` 를 사용하거나 루비의 `-d` 플래그를 사용할 수 있습니다.

```
[aaron@TC okokok (master)]$ bundle exec ruby -d script/rails runner test.rb
```

`-d` 플래그는 경고를 활성화하고 모든 예외 발생을 출력합니다. 네, 실제로는 엄청나게 많은 양의 결과물이 출력되겠지요. 그러나 끝부분을 살펴보시면 이렇게 되어있습니다.

```
Exception `NameError' at activesupport-3.0.0/lib/active_support/core_ext/module/remove_method.rb:3 - method `_validators' not defined in Class
Exception `SQLite3::SQLException' at sqlite3-1.3.11/lib/sqlite3/database.rb:91 - near "oh": syntax error
Exception `SQLite3::SQLException' at activesupport-3.0.0/lib/active_support/notifications/instrumenter.rb:24 - near "oh": syntax error
  SQL (0.1ms)  oh no!
SQLite3::SQLException: near "oh": syntax error: oh no!
Exception `ActiveRecord::StatementInvalid' at activerecord-3.0.0/lib/active_record/connection_adapters/abstract_adapter.rb:202 - SQLite3::SQLException: near "oh": syntax error: oh no!
Exception `ActiveRecord::StatementInvalid' at railties-3.0.0/lib/rails/commands/runner.rb:48 - SQLite3::SQLException: near "oh": syntax error: oh no!
activerecord-3.0.0/lib/active_record/connection_adapters/abstract_adapter.rb:202:in `rescue in log': SQLite3::SQLException: near "oh": syntax error: oh no! (ActiveRecord::StatementInvalid)
	from activerecord-3.0.0/lib/active_record/connection_adapters/abstract_adapter.rb:194:in `log'
	from activerecord-3.0.0/lib/active_record/connection_adapters/sqlite_adapter.rb:135:in `execute'
	from test.rb:6:in `<top (required)>'
	from railties-3.0.0/lib/rails/commands/runner.rb:48:in `eval'
	from railties-3.0.0/lib/rails/commands/runner.rb:48:in `<top (required)>'
	from railties-3.0.0/lib/rails/commands.rb:39:in `require'
	from railties-3.0.0/lib/rails/commands.rb:39:in `<top (required)>'
	from script/rails:6:in `require'
	from script/rails:6:in `<main>'
```

실제 예외는 여기서 발생했습니다.

```
Exception `SQLite3::SQLException' at sqlite3-1.3.11/lib/sqlite3/database.rb:91 - near "oh": syntax error
```

그리고 여기서 다시 예외가 일어났지요.

```
Exception `SQLite3::SQLException' at activesupport-3.0.0/lib/active_support/notifications/instrumenter.rb:24 - near "oh": syntax error
```

예외가 발생할 때 래핑된 뒤 다시 예외가 발생하는 경우에는 *반드시* 본래의 추적 내역을 노출해야 합니다. 그러므로 이 경우는 명백히 버그지만, 실제로 버그는 고쳐졌으며, 우리는 언젠가 또 이런 경우가 발생했을 때 해결하는 법을 알게 되었습니다.

### 커맨드 라인 도구를 `-d` 플래그와 함께 사용하여 실행

위의 기술을 RSpec 테스트에 적용하고 싶으시다면 이렇게 하시면 됩니다.

```
$ ruby -d -S rspec
```

### `-d` 플래그는 사용하고 싶은데 프로세스를 실행하는 방법을 모르겠다

Rake 테스트 작업은 기본적으로 [서브 프로세스 안에서 당신의 테스트를 실행합니다](https://github.com/ruby/rake/blob/3c4fe3e25e5ab6b052f9e81bc2920ca4b4fc1094/lib/rake/testtask.rb#L105). 말인 즉슨 `ruby -d -S rake` 같은 커맨드를 입력해도 서브 프로세스 안에 있는 여러분의 테스트에는 플래그가 적용되지 않는다는 뜻입니다. 이 경우 저는 `RUBYOPT` 환경 변수를 사용합니다.

```
[aaron@TC okokok (master)]$ RUBYOPT=-d bundle exec rake test
```

`RUBYOPT` 환경 변수는 쉘에서 실행된 모든 루비 프로그램에 적용되고, 심지어 rake로부터 호출 된 서브 쉘에도 적용됩니다. 이를 응용하면 `rspec` 커맨드를 이렇게 다시 써볼 수 있습니다.

```
$ RUBYOPT=-d rspec
```



## 이 객체는 어디에서 온 걸까?

보통은 콜 스택을 출력하여 객체가 어디에서 왔는지 찾습니다. 하지만 가끔 객체가 콜 스택 바깥에 위치한 경우도 있습니다. 이럴 때는 객체가 어디에서 호출된 건지 찾기 힘듭니다.

```ruby
def foo
  x = baz
  bar x
end

def bar x
  puts "#" * 90
  puts caller
  puts "#" * 90
  p x
end

def baz; zot;		end
def zot; Object.new	end

foo
```

이전에 "어디에 문제가 있는진 알겠는데, 어떻게 거기까지 가야할지 모르겠다" 파트에서 `caller` 를 사용하는 방법, "wtf  트릭" *(역주3: 글쓴이는 해당 방법을 소개할 때 Vim 단축키를 `<leader>wtf` 으로 설정하였습니다. 그래서 이를 "wtf trick"으로 명명한 것으로 보입니다)*을 보여드렸습니다.  여기서 저는 `x` 라는 값이 어떻게 할당되었는지 신경쓰였는데요, `foo` 메서드를 따라가다보면 `baz` 메서드에서 값을 가져오는 것을 볼 수 있습니다. 거대한 코드 베이스에서는 형제 트리에서 모든 호출과 로직을 따라가는게 아주 어렵습니다(코드를 자료구조의 그래프라고 생각한다면, `foo` 메서드는 두 개의 자손이 있는 겁니다. `baz` 와 `bar` 이죠. 그래서 `baz`가 `bar` 의 형제라고 여길 수 있습니다). 저는 게으르기 때문에 객체가 어디서 왔는지 찾기 위해 모든 메서드를 뒤지고 싶지 않았습니다. 그래서 저는 루비의 객체 할당 추적기(object allocation tracer)를 사용하는걸 좋아합니다. 루비의 할당 추적기는 루비 2.1버전부터 사용할 수 있습니다(확실한 것은 아닙니다). 제가 이 방법을 사용할 때는 가능한 빨리 `require` 한 뒤에 활성화합니다. 그러면 제가 찾고자 하는 할당 위치를 찾을 수 있지요.

```ruby
require 'objspace'
ObjectSpace.trace_object_allocations_start

def foo
  x = baz
  bar x
end

def bar x
  p ObjectSpace.allocation_sourcefile(x) => ObjectSpace.allocation_sourceline(x)
end

def baz; zot;		end
def zot; Object.new	end

foo
```

프로그램을 실행하면 이런 결과를 얻습니다.

```
[aaron@TC tlm.com (master)]$ ruby x.rb
{"x.rb"=>14}
[aaron@TC tlm.com (master)]$
```

`x` 객체가 해당 파일의 14번째 줄에 있다는 것을 알게 되었습니다. 그러면 해당 라인으로 가서 "wtf 트릭" 을 반복하거나 프로그램에 무슨 문제가 있는지 발견할 때 까지 이 방법을 반복합니다.

저는 보통 객체 추적을 가능한 빠르게 시작합니다. 제 객체가 어디에 할당되었는지 모르니까요. 이런 추적은 프로그램의 속도를 떨어뜨리지만, 디버깅 중에는 신경쓸 필요가 없습니다.



## 나는 `require` 를 진짜 진짜 빨리 하고 싶어

바로 위에 보여드린 기술은 오로지 객체가 `trace_object_allocations_start` 메서드가 호출되고 난 뒤에 할당된 이후의 정보만 제공합니다. 파일이 `require` 되는 순간에 객체가 할당되어서, 도대체 무슨 파일이고 *어디에 있는지* 모를 때가 있습니다. 그래서  프레임워크 안에 있는 어떤 파일이라도 로드되기 전에 코드를 좀 실행시킬 필요가 있습니다. 이럴 때 저는 `-r` 플래그를 사용한 뒤 스크립트를 작성합니다.

우리가 `User::BLACKLISTED_CLASS_METHODS` 의 할당 위치를 찾는 코드를 작성했다고 칩시다.

```ruby
require 'active_record'

AciveRecord::Base.establish_connection adapter: 'sqlite3', databse: ':memory:'

ActiveRecord::Base.connection.instance_eval do
  create_table :users
end

class User < ActiveRecord::Base; end
p ObjectSpace.allocation_sourcefile(User::BLACKLISTED_CLASS_METHODS) => ObjectSpace.allocation_sourceline(User::BLACKLISTED_CLASS_METHODS)
```

그런데 우리는 이 어떤 파일이 이 상수를 할당했는지 모르고, 찾는 방법을 떠올리고 싶지도 않을 때가 있습니다(네, 이건 좀 억지로 꾸며낸 경우입니다). 이럴 때 `y.rb` 라는 파일을 작성해 보겠습니다.

``` ruby
require 'objspace'
ObjectSpace.trace_object_allocations_start
```

그리고 저는 루비의 커맨드 라인 인자를 넣어서 이 파일을 실행할 때 바로 `require` 하도록 만들었습니다.

```
[aaron@TC tlm.com (master)]$ ruby -I. -ry x.rb
{"/Users/aaron/.rbenv/versions/ruby-trunk/lib/ruby/gems/2.4.0/gems/activerecord-5.0.0.beta1/lib/active_record/attribute_methods.rb"=>35}
[aaron@TC tlm.com (master)]$
```

인자들을 찬찬히 살펴보면 `-I.` 는 ". 를 불러오기 경로로 추가하고", `-ry` 는 `require 'y'` 와 같으며, 이후에 `x.rb` 를 실행하는 겁니다. 그러니 `.` 가 불러오기 경로로 추가되었고, `x.rb` 가 실행되기도 전에 `y.rb` 파일이 `require` 되었습니다. 그 결과로 `BLACKLISTED_CLASS_METHODS` 가 `attribute_methods.rb` 의 35번째 줄에 에 할당되어 있다는 사실을 알 수 있습니다. 만약 서브 프로세스 안에서 실행되는 코드에 이 기술을 적용하고자 한다면 `RUBYOPT` 를 함께 쓰면 됩니다.

```
$ RUBYOPT='-I. -ry' rake test
```



## 객체가 어딘가에서 수정되었는데(mutated), 그 위치를 모르겠다

객체를 살펴보다 보면 이게 수정되고 있다는건 알겠는데, 어디서 수정되고 있는 지 모를 때가 있습니다. 이 때는 객체에 `freeze` 를 호출한 뒤에, 테스트를 실행해보고, 어디서 예외가 발생하는지 살펴보면 됩니다. 그 예로, 제가 [어디에서 특정 변수가 수정되는지 알고 싶을 때](https://github.com/rails/rails/blob/38b5af6595338cb2212980062d9aaf51241878cc/activesupport/lib/active_support/concurrency/share_lock.rb#L28)가 있습니다. 코드를 살펴보니 이 변수가 수정된다는 것은 알고 있었지만, 어디서부터 수정이 일어나는지 알지 못했습니다. 그래서 코드를 이렇게 수정해봤습니다.

```ruby
def initialize
  super()

  @cv = new_cond

  @sharing = Hash.new(0)
  @sharing.freeze
  @waiting = {}
  @exclusive_thread = nil
  @exclusive_depth = 0
end
```

그리고 나서 레일즈 서버를 실행하면 예외가 발생하며 추적 내역이 보여집니다.

```
active_support/concurrency/share_lock.rb:151:in `delete': can't modify frozen Hash (RuntimeError)
	from active_support/concurrency/share_lock.rb:151:in `yield_shares'
	from active_support/concurrency/share_lock.rb:79:in `block in stop_exclusive'
```

이제 처음에 수정이 발생한 곳을 발견했습니다. 만약 이 부분이 여러분이 찾고자 하는 부분이 아니라면 작성해둔 `freeze` 를 삭제한 뒤에 내역을 따라가서 수정된 부분 이후에 다시 덧붙이면 됩니다.



## 교착 상태(deadlock)에 빠졌는데, 어디서 문제가 생겼는지 모르겠다

저에게 스레드와 관련된 이슈가 발생했고, 문제를 어디에서 해결해야할 지 몰랐을 때, 저는 살아있는 스레드를 검사해보기 위해 코드를 좀 추가했습니다. 예를 들어 저는 [이 이슈를 디버깅하고 있었습니다](https://github.com/rails/rails/issues/23503). 애플리케이션 서버가 막혀있는데, 대체 어디서 문제가 발생했는지 몰랐습니다. 그래서 어디서 스레드가 막혀있는지 찾기 위해 `x.rb` 라는 파일을 작성했습니다.

```ruby
trap(:INFO) {
  Thread.list.each do |t|
    puts "#" * 90
    p t
    puts t.backtrace
    puts "#" * 90
  end
}
```

그리고 앱 서버를 이렇게 실행했습니다.

```
$ ruby -I. -rx bin/rails s
```

이제 앱 서버가 막혔을 때, 컨트롤+T 키를 누르면(죄송하지만 OS X에서만 작동합니다, 리눅스에서는 `kill` 을 사용해야 합니다), 모든 스레드의 추적 내역을 볼 수 있습니다.

```
##########################################################################################
#<Thread:0x007f90bc07cb38 run>
omglolwut/x.rb:7:in `backtrace'
omglolwut/x.rb:7:in `block (2 levels) in <top (required)>'
omglolwut/x.rb:4:in `each'
omglolwut/x.rb:4:in `block in <top (required)>'
gems/puma-2.16.0/lib/rack/handler/puma.rb:43:in `join'
gems/puma-2.16.0/lib/rack/handler/puma.rb:43:in `run'
gems/rack-2.0.0.alpha/lib/rack/server.rb:296:in `start'
rails/commands/server.rb:78:in `start'
rails/commands/commands_tasks.rb:90:in `block in server'
rails/commands/commands_tasks.rb:85:in `tap'
rails/commands/commands_tasks.rb:85:in `server'
rails/commands/commands_tasks.rb:49:in `run_command!'
rails/command.rb:20:in `run'
rails/commands.rb:19:in `<top (required)>'
bin/rails:4:in `require'
bin/rails:4:in `<main>'
##########################################################################################
##########################################################################################
#<Thread:0x007f90bef3b668@/Users/aaron/.rbenv/versions/ruby-trunk/lib/ruby/gems/2.4.0/gems/puma-2.16.0/lib/puma/reactor.rb:136 sleep>
lib/puma/reactor.rb:29:in `select'
lib/puma/reactor.rb:29:in `run_internal'
lib/puma/reactor.rb:138:in `block in run_in_thread'
##########################################################################################
##########################################################################################
#<Thread:0x007f90bef3b500@/Users/aaron/.rbenv/versions/ruby-trunk/lib/ruby/gems/2.4.0/gems/puma-2.16.0/lib/puma/thread_pool.rb:216 sleep>
lib/puma/thread_pool.rb:219:in `sleep'
lib/puma/thread_pool.rb:219:in `block in start!'
##########################################################################################
##########################################################################################
#<Thread:0x007f90bef3b3c0@/Users/aaron/.rbenv/versions/ruby-trunk/lib/ruby/gems/2.4.0/gems/puma-2.16.0/lib/puma/thread_pool.rb:187 sleep>
lib/puma/thread_pool.rb:190:in `sleep'
lib/puma/thread_pool.rb:190:in `block in start!'
##########################################################################################
##########################################################################################
#<Thread:0x007f90bef3b258@/Users/aaron/.rbenv/versions/ruby-trunk/lib/ruby/gems/2.4.0/gems/puma-2.16.0/lib/puma/server.rb:296 sleep>
lib/puma/server.rb:322:in `select'
lib/puma/server.rb:322:in `handle_servers'
lib/puma/server.rb:296:in `block in run'
##########################################################################################
##########################################################################################
#<Thread:0x007f90c1ef9a08@/Users/aaron/.rbenv/versions/ruby-trunk/lib/ruby/gems/2.4.0/gems/puma-2.16.0/lib/puma/thread_pool.rb:61 sleep>
lib/ruby/2.4.0/monitor.rb:111:in `sleep'
lib/ruby/2.4.0/monitor.rb:111:in `wait'
lib/ruby/2.4.0/monitor.rb:111:in `wait'
lib/ruby/2.4.0/monitor.rb:132:in `wait_until'
action_dispatch/http/response.rb:170:in `block in await_commit'
lib/ruby/2.4.0/monitor.rb:214:in `mon_synchronize'
action_dispatch/http/response.rb:169:in `await_commit'
action_controller/metal/live.rb:270:in `process'
action_controller/metal.rb:193:in `dispatch'
action_controller/metal.rb:265:in `dispatch'
action_dispatch/routing/route_set.rb:50:in `dispatch'
action_dispatch/routing/route_set.rb:32:in `serve'
##########################################################################################
##########################################################################################
#<Thread:0x007f90bd1d5f38@/Users/aaron/git/rails/actionpack/lib/action_controller/metal/live.rb:279 sleep>
lib/ruby/2.4.0/monitor.rb:111:in `sleep'
lib/ruby/2.4.0/monitor.rb:111:in `wait'
lib/ruby/2.4.0/monitor.rb:111:in `wait'
lib/ruby/2.4.0/monitor.rb:123:in `wait_while'
active_support/concurrency/share_lock.rb:57:in `block (2 levels) in start_exclusive'
active_support/concurrency/share_lock.rb:154:in `yield_shares'
active_support/concurrency/share_lock.rb:56:in `block in start_exclusive'
lib/ruby/2.4.0/monitor.rb:214:in `mon_synchronize'
active_support/concurrency/share_lock.rb:51:in `start_exclusive'
active_support/concurrency/share_lock.rb:113:in `exclusive'
active_support/dependencies/interlock.rb:12:in `loading'
active_support/dependencies.rb:37:in `load_interlock'
active_support/dependencies.rb:369:in `require_or_load'
active_support/dependencies.rb:529:in `load_missing_constant'
active_support/dependencies.rb:212:in `const_missing'
active_support/dependencies.rb:561:in `load_missing_constant'
active_support/dependencies.rb:212:in `const_missing'
app/controllers/users_controller.rb:9:in `index'
##########################################################################################
```

가독성을 위해 결과물을 조금 잘라냈습니다만, 여러분은 이제 각각의 스레드가 무엇을 하는지 볼 수 있습니다. 그리고 어느 스레드 두 개가 교착 상태에 빠졌는지 쉽게 발견할 수 있습니다(정답은 마지막 두 개입니다).



## 특정한 시간에만 언제 메서드가 실행되는지 알고 싶다

일정 시간 뒤에 메서드가 언제 실행되었는지 알고 싶을 때가 있습니다. 저는 애플리케이션이 *구동된 뒤에*  `start_exclusive` 메서드가 언제 호출되는지 알고 싶었습니다. 이럴 때 위에 보여드린 `trap` 트릭과 전역 변수를 조합하여 해결했습니다.

먼저 `start_exclusive` 를 이렇게 수정했습니다.

```ruby
def start_exclusive(purpose: nil, compatible: [], no_wait: false)
  if $foo
    puts "#" * 90
    puts caller
    puts "#" * 90
  end
  # ..
end
```

그리고 `x.rb` 라는 파일을 작성했습니다.

```ruby
trap(:INFO) {
  puts "turning on debugging!"
  $foo = true
}
```

그리고 앱 서버를 구동하고 모든 요소가 준비되면 컨트롤+T를 눌러서 제 전역 변수를 `true` 로 바꿉니다. 그리고 로그 메세지들을 살펴볼 수 있게 됩니다.



## 끝

이게 제가 지금 생각해 낼 수 있는 방법의 전부입니다. 그리고 [Richard의 puts 디버깅에 관한 글도 읽어보세요](http://www.schneems.com/2016/01/25/ruby-debugging-magic-cheat-sheet.html). 좋은 하루 되시길. 끝.

---

## 번역 후기

간만에 엄청나게 긴 양의 글을 번역했습니다. 그래도 맘 잡고 하니 생각보다 오래 걸리지도 않고, 초벌번역의 퀄리티도 조금씩 올라가고 있다고 느끼고 있습니다.

이번에 소개해 드린 글은 콘솔에 디버깅 하는 방법을 소개하는 글입니다. 보통은 디버깅 툴로 `byebug`, `pry-byebug` 등을 사용하실 겁니다. 저도 어지간한 디버깅을 그렇게 처리하고 있지만.. 본문의 내용처럼 좀 깊은 부분을 들여다볼 때는 일일히 깊숙하게 파고들기 힘들 때가 많습니다. 좀 더 자신이 사용하고 있는 코드의 깊은 부분을 들여보고자 할 때 아주 유용한 테크닉이 될 것이라 생각합니다.

번역된 챕터 제목들의 말투가 조금 이상하다고 느끼실텐데, 들어가는 글에서 원 저자가 '어차피 블로그 포스트니까 신경 안쓰고 말투를 편하게 한다'는 식으로 쓰여있길래 그 느낌을 가능한 한 살려서 작성해보았습니다.

글을 읽다 보면 레일즈같은 거대한 오픈 소스에 기여하는 분들은 '어떻게 이 방대한 코드를 다 고려하면서 개발을 하는걸까?' 하는 생각에 더욱 존경심이 들더군요. 레일즈 뿐 아니라 다른 오픈소스 프레임웍들도 마찬가지입니다. 언젠가는 오픈소스에 기여했다는 족적을 꼭 남겨 보고 싶습니다.

현재 Hanami 기반으로 개발을 하고 있다보니 문서화가 덜 되어 '소스를 까볼' 일이 많은데 이런 기술을 더 유용하게 사용해볼 수 있겠습니다. 이 글을 보는 다른 분들은 어떻게 '프로그램의 소스를 살펴 보시는지' 궁금하기도 하고, 더 유용한 디버깅 팁이 있는지도 궁금해집니다.

