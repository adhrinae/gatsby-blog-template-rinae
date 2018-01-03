---
path: "/posts/isolate-global-state-kor"
date: "2016-12-30"
title: "[번역] 전역 상태를 격리하라"
category: "Translation"
tags:
  - Ruby
  - Hanami
  - Testing
  - Translation
---

- **본 포스트는 [Luca Guidi의 포스팅을](https://lucaguidi.com/2016/12/27/isolate-global-state.html) 번역한 글입니다**
- **문제를 설명하는데 나온 하나미(Hanami)에 대해서는 [이 포스팅](https://emaren84.github.io/blog/archivers/hanami-introduction)을 참조해주세요**
- **전문 번역이 아니기에 부족한 표현이나 오역은 언제든지 지적해주세요**

---

소프트웨어 프로그램에서 전역 상태를 사용하는건 개발하기엔 쉽지만 유지보수 할 때는 악몽이 된다. 예상치 못한 상황에서 발생하여 추적하기도 어려운 버그가 되기 쉽상이다.

왜 그렇게 되는지, 그리고 어떻게 그 문제를 완화할 수 있을지 살펴보자.

*역주: 이 글에서 전역 상태는 전역 변수와 거의 동일한 의미로 사용되는 것으로 추정됩니다.*



## 문제의 예시

예를 들자면 하나미의 코드 베이스 안에서 우리는 환경 변수에 따라 어떻게 프레임워크가 설정되는지 테스트 할 필요가 있다.

우리*(역주: 하나미 개발팀으로 보입니다)*는 보통 테스트를 이런 식으로 작성한다:

```ruby
RSpec.describe Hanami::Environment do
  before do
    ENV['HANAMI_ENV']  = nil
    ENV['RACK_ENV']    = nil
    ENV['HANAMI_HOST'] = nil
    ENV['HANAMI_PORT'] = nil

    # ...
  end

  context "when HANAMI_ENV is set" do
    before do
      ENV['HANAMI_ENV'] = 'production'
      @env = described_class.new
    end

    # ...
  end
end
```

우리는 보통 각각의 테스트를 실행하기 전에 모든 환경 변수를 초기화해왔다. 그리고 우리가 필요로 하는 특별한 상황(the edge case)에서만 하나씩 설정했다.

이러한 접근 방식을 사용할 때의 **문제는** 이 방법이 루비 프로세스의 전역 상태를 **더럽힌다는** 것이다. 우리가 테스트 파일을 단독으로 실행할 때는  `before` 블록이 환경 변수를 리셋하기 때문에 잘 작동한다.

그러나 모든 테스트를 한번에 실행할 때, 테스트는 꼬이게 될 것이다. 환경 변수 초기화가 언제나 작동하진 않기 때문이다.

만약 한 테스트가 `ENV` 속성을 변환하고 나서 뒷정리를 하지 않으면, 그 다음 테스트는 기존의 `ENV` 값의 변화를 **물려받아서** 우리가 기대하던대로 작동하지 않을 수 있다.

때때로 위의 예시 처럼 눈에 띄는 부분에서 변화를 준 경우에는 우리가 `after` 블록을 설정하여 뒷정리를 할 수 있다. 그러나 다른 때엔 변환한 것(the mutation)이 우리 눈에 보이지 않는 부분에서 부작용을 초래할 수 있다.

이건 소스의 버그다. 그리고 이 버그는 엉킨 실타래처럼 되어 디버그하기 힘들다.

**오랜 시간동안, 여러 가지 전역 상태의 조합하는 것은 하나미를 지속적 통합 개발([CI builds](https://ko.wikipedia.org/wiki/%EC%A7%80%EC%86%8D%EC%A0%81_%ED%86%B5%ED%95%A9))이 힘들도록 만들고 여러 버그를 일으켰다.**

개발자로서의 내 경험으로 미루어보아(*역주: Luca Guidi는 숙련된 웹 개발자입니다*) 이런 형태의 문제를 완화할 수 있는 유일한 방법은 **전역 상태를 격리하거나, 전역 상태를 사용하는 것을 아예 피하는 것이다.** 우리는 **가능한한 전역 상태를 사용하는 것을 줄이도록** 하나미의 내부 구현을 바꾸고 있다.



## 문제의 해법

앞서 이야기한 특별한 경우를 위해 우리는 환경 변수를 격리할 수 있는 새로운 객체를 선보였다. 이는 `Hanami::Env` 라고 불린다.

```ruby
module Hanami
  class Env
    def initialize(env: ENV)
      @env = env
    end

    def [](key)
      @env[key]
    end

    def []=(key, value)
      @env[key] = value
    end

    # ...
  end
end
```

구현 자체는 별 것 아니다: `ENV` 에 접근하는 것을 캡슐화하는 것이다.

우리는 환경 변수를 관리하기 위해 자체 인터페이스를 정의했다. 우리는 명시적인 구현(concrete implementation)을 사용하기보다(`ENV`) 추상화(`Hanami::Env`)에 의존하고 있다([의존관계 역전 원칙 참고](https://ko.wikipedia.org/wiki/%EC%9D%98%EC%A1%B4%EA%B4%80%EA%B3%84_%EC%97%AD%EC%A0%84_%EC%9B%90%EC%B9%99)). 

`Hanami::Environment` 는 프로젝트의 환경 변수를 설정하는 책임을 가지고 있는데, 우리는 이런 방식으로 사용한다:

```ruby
module Hanami
  class Environment
    def initialize(options)
      opts = options.to_h.dup
      @env = Hanami::Env.new(env: opts.delete(:env) || ENV)

      # ...
    end
  end
end
```

우리가 하나미 프로젝트를 사용할 때, `:env` 옵션은 설정되지 않은 상태이다. 이로 인해 `@env` 는 `ENV` 를 참조하여 루비 프로세스의 진짜 환경 변수를 읽거나 쓰게 된다.

이렇게 우리는 `Hanami::Environment` 의 테스트 중에 많은 양의 코드를 단순화하고, **공유되고 변화 가능한 상태(shared mutable state, 즉 `ENV` 말이다)의 사용을 피할 수 있었다.** 아래 코드에서 우리는 `ENV` 와 유사하게 동작하는 `:env` 를 객체의 옵션으로 전달하지만, 이 것은 실제로 `ENV`가 아니다: 그냥 `Hash` 이다.

```ruby
RSpec.describe Hanami::Environment do
  context "when HANAMI_ENV is set" do
    let(:env) {
      Hash["HANAMI_ENV" => "production"]
    }

    it "tests something interesting"
      @env = described_class.new(env: env)  
    end

    # ...
  end
end
```



## 결론

[캡슐화](https://ko.wikipedia.org/wiki/%EC%BA%A1%EC%8A%90%ED%99%94)와 [의존성 주입](http://solnic.eu/2013/12/17/the-world-needs-another-post-about-dependency-injection-in-ruby.html)을 적절하게 사용하여, 각각의 테스트에서 발생할 수 있는 변화는 나머지 테스트에서는 보이지 않게 되었다. 결과적으로 안정적인 테스트 수행을 할 수 있게 되었고, 하나미 내부를 [SOLID 디자인](https://ko.wikipedia.org/wiki/SOLID)에 맞게 구성할 수 있었다. 

---

## 번역 후기

보통 루비 프로젝트에서 `dotenv` 같은 젬으로 환경 변수를 관리합니다. 사실 이 환경 변수라는 개념도 저에게 아직 모호한 개념이지만, 객체지향 프로그래밍의 핵심적인 주제인 캡슐화와 의존성 주입을 어떤 식으로 활용하는지 좋은 예를 보여준 것 같아 한번 번역해보게 되었습니다.

특히 제가 요즘에야 테스트를 작성해보기 시작했는데, 테스트를 개별로 실행할 때는 몰라도 전체 테스트를 실행할 때 원인을 알 수 없는 오류가 생길 때가 종종 있었습니다. 이 글을 통해 약간의 힌트를 얻었다는 생각도 듭니다. 