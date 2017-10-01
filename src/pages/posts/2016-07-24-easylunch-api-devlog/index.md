---
path: "/posts/easylunch-api-devlog-1"
date: "2016-07-24"
title: "Easylunch Api 서버 제작기 - 1"
category: "Rails"
tags:
  - Rails
---

## Clone repository
금방 하지 못했던 easylunch api 서버 프로젝트를 작성하기 시작했다.
프로젝트 생성과 Gem 세팅 등은 이미 되어 있어서 github에 있는 레포를 클론하였고
Issue #10 으로 분류되어 있어서 `ISS#10` 브랜치를 생성하였다.
이번에는 Bitbucket에서 작성했던 프로젝트와 다르게 development 브랜치를 두지 않고 이슈 브랜치에서 바로 master로 합치는 방식으로 진행하는가 보다.

## 모델 작성
먼저 슬랙에 올라와 있던 모델 도면을 참고하여 모델을 작성하였다.
처음엔 별 생각 없이 모델 생성하면서 string이나 integer만 구분하여 각 컬럼을 입력하고 있었다.

    rails g model MealLog user_id:integer menu_name:string price:integer meal_time:datetime

이렇게 테이블을 작성하고 나서 모델에서 따로 `belongs_to` 와 `has_many` 를 입력해줄 생각이었다.
그러다 저번에 다른 튜토리얼에서 우연히 본 references를 이용할 생각이 뒤늦게 들어서 마이그레이션 파일을 변경해 주기로 했다.

마이그레이션 시 타입을 references로 지정해주면 model_id 생성과 함께 관계 설정을 해주는 코드(`belongs_to` / `has_many`)가 자동으로 삽입된다.
다만 이미 마이그레이션 파일이 작성된 뒤였기 때문에(실행은 하지 않음) 다음과 같이 마이그레이션 파일을 변경해주었다.

```ruby
class CreateMealLogs < ActiveRecord::Migration
  def change
    create_table :meal_logs do |t|
      t.references :user
      t.string :menu_name
      t.integer :price
      t.datetime :meal_time

      t.timestamps null: false
    end
    add_index :meal_logs, :user_id
  end
end
```

그리고 직접 관계를 맺어주는 것과 별개로 CodeTable때문에 외부 키를 입력해줄 필요가 있었다.
외부 키를 추가할 때는 마이그레이션 파일에 add_foreign_key 메서드를 사용해야 한다. 이 경우엔 미리 생성된 컬럼을 지정해주고 싶었기 때문에 다음과 같이 삽입해야 했다.

    add_foreign_key :meal_meet_ups, :users, column: :admin_id

외부 키를 지정해주는 마이그레이션 파일은 다음과 같이 작성되었다.

```ruby
class CreateMealMeetUps < ActiveRecord::Migration
  def change
    create_table :meal_meet_ups do |t|
      t.integer :total_price
      t.integer :messenger_code
      t.string :messenger_room_id
      t.integer :admin_id
      t.integer :meetup_status

      t.timestamps null: false
    end
    add_foreign_key :meal_meet_ups, :users, column: :admin_id
    add_foreign_key :meal_meet_ups, :code_tables, column: :messenger_code
    add_foreign_key :meal_meet_ups, :code_tables, column: :meetup_status
  end
end
```

다음은 MealMeetUp 생성과 변경을 처리하는 api 컨트롤러를 작성할 차례이다.

## 컨트롤러 작성

    rails g controller MealMeetUp create update

현재 시점에서 첫 번째로 구현하려는 기능은 MealMeetUp api이다. 새 MealMeetUp 생성과 수정을 구현할 예정인데
json으로만 데이터를 주고받을 예정이니 `routes.rb`에 디폴트 포맷을 지정해주기로 했다.

    # routes.rb
    post 'meal_meet_ups'  => 'meal_meet_up#create', defaults: { format: 'json' }
    patch 'meal_meet_ups' => 'meal_meet_up#update', defaults: { format: 'json' }

그 다음에는 [Strong parameter](https://blog.8thlight.com/will-warner/2014/04/05/strong-parameters-in-rails.html)를 지정하기 위해 meetup_params 메서드를 작성했다.

입력받을 JSON은 다음과 같으므로 data 아래에 있는 나머지 키들을 전부 받을수 있는 값으로 설정해두었다.

```json
{
    "data": {
        "email": "abc@example.com",
        "messenger": "slack", // 약속된 code
        "messenger_room_id": 1459349928, // optional, 값을 얻을 수 없는 특정 메신저의 경우(ex- 카톡) api 서버에서 유저의 아이디 정보로 검색
        "total_price": 50000, // optional
        "status": "paying" // optional, 값이 주어지지 않을 경우 state machine으로 작동
    }
}
```

## MealMeetUp Create

이 JSON을 가지고(예로 작성된 JSON은 정보 변경시에 받는 것이고 생성 시에는 `total_price`와 `status`는 받지 않는다. 대신 `messenger_user_id`를 받는다) `create` 메서드가 작동한다면 어떤 과정으로 구동하게 될까 생각해 보았다.

1. meetup_params를 한번 거쳐서 허가된 매개변수만 받는다.
2. 받은 변수들의 유효성을 검사한다
    - `email`, `messenger_user_id` 같은 인증 정보가 누락된 경우: 401에러
    - `messenger`, `messenger_room_id` 같이 방을 생성하기 위한 정보가 충분하지 않아 생성이 불가능할 때: 400에러
3. 유효성을 통과한 경우 먼저 User 객체 생성 + messenger_code 가져오기
    - messenger 종류로 CodeTable에서 맞는 `messenger_code` 가져오기 (이 시점에서 seed 파일로 코드테이블을 작성해놓아야 할 필요성을 느꼈다. 더군다나 이런식으로 찾을거면 코드테이블을 작성하는 의미가 있나?)
    - email 주소로 새로운 유저 생성.
4. MealMeetUp 생성
    - 앞선 과정에서 가져온 `messenger_code`
    - `messenger_room_id`
    - 앞서 생성된 user의 id를 `admin_id`로 지정
    - status는 null로 두고, null인 경우는 최초 생성인 것으로 간주하도록 하려고 했으나, 아무래도 "​created"라는 상태를 지정해 두는 것이 나아 보인다.

CodeTable을 작성하면서 한 가지 실수한 점이 있는데, 컬럼명에 'type'이라는 이름을 쓰면 레일즈에 기본적으로 정의되어있는 type과 충돌이 난다. 그래서 code_type으로 컬럼명을 변경하였다.

각각 코드가 무엇을 의미하는지는 code_table.rb에 주석으로 달기로 하였다.

한창 날코딩으로 작업을 하고, 얼렁뚱땅 create메서드를 작동시키는 것 까지는 성공했는데 돌이켜보니 DB 관계 설정을 하나도 해두지 않았다.
생성과 구상까지만 하고 몇일을 보내버려서 그런지 생각보다 머리에 잘 들어오지 않아 애먹고 있다.

매번 단순히 `has_many`, `belongs_to`정도만 남발하다가 본격적으로 직접 외부키로 관계를 맺어주려니 어렵게 느껴졌다. 이리저리 소스를 찾아서 구현해본 결과 이런 느낌으로 나온다.

```ruby
class MealMeetUp < ActiveRecord::Base
  has_many :meal_meet_up_logs
  has_many :meal_meet_up_tasks
  belongs_to :admin, class_name: 'User', foreign_key: 'admin_id'
  belongs_to :messenger, class_name: 'CodeTable', foreign_key: 'messenger_code'
end

class User < ActiveRecord::Base
  has_many :meal_meet_ups, foreign_key: 'admin_id'
  has_many :meal_logs
  has_many :user_messengers
end
```
어느 클래스에 있는 값을 가져올지 `class_name`으로 지정해주고, 실제 어떤 메서드를 입력해서 가져올지(`:admin`), 어떤 외부키를 지정해 두었는지 등으로 설정할 수 있다.

`create`메서드가 작동 자체는 잘 하는 것 같은데 루보캅에서 메서드가 너무 길다고 하니까 조금 아쉽게 느껴진다. 더 줄일 부분이 분명히 있는데 어느 부분을 손대야할지 잘 감이 안잡히는 느낌이 든다. 기준이 10줄인데 14줄로 작성되어 있으니..

인증 정보의 유효성 고려하다보니 깜빡한 것이, 이메일 유효성을 고려하지 않았다.

    VALID_EMAIL_ADDRESS = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i

M.Hartl의 튜토리얼에서 가져온 이 정규표현식으로 메서드를 만들어서 검증하기로 했다.

## MealMeetUp Update
업데이트는 두가지 속성이 더 추가되는데, `total_price`와 `status`이다.

```json
{
    "data": {
        "email": "abc@example.com",
        "messenger": "slack",
        "messenger_room_id": 1459349928,
        "total_price": 50000,
        "status": "paying" // 현재까지 완료된 최종 상태
    }
}
```

설마 했던 문제지만, 이번에도 create를 만들면서 별달리 다음 문제에 대해 고려를 안하다 보니까 리턴용 JSON 생성이 곤란하게 되었다.

```ruby
def meal_meet_up_json(data)
{ data:
    { email: data.admin.email,
        messenger: data.messenger,
        messenger_room_id: data.messenger_room_id } }
end
```

그래서 생각하건데 아예 모든 값이 다 들어가도록 json을 만들고,  create메서드에서 리턴할때만 특정 키를 뺀 채로 만들면 될 거라는 생각이 든다.

공통적입 부분을 생각해보니, MealMeetUp 객체에 저장을 하기위해 추가적으로 들어가는 정보들을 조회하는 부분이 크게 중복된다. 그래서 이 기능도 나누어서 작성하였다.

```ruby
def get_more_info(params)
    status = params[:status].empty? ? 'created' : params[:status]
    messenger_code = CodeTable.find_messenger(params[:messenger]).id
    status_code = CodeTable.find_status(status).id

    user = if status == 'created'
            User.create(email: params[:email])
            else
            User.find_by(email: params[:email])
            end

    additional_data = { admin_id: user.id, messenger_code: messenger_code, status_code: status_code }

    params.merge(additional_data)
end
```

막상 이것도 더 쪼갤 수 있을 테지만.. status_code, messenger_code, admin_id 삽입까지 처리하였다.
마지막 줄에 최종적으로 원하는 데이터를 출력하는 부분이 애매한데, MeetUp 객체 생성/수정에 필요 없는 정보들이 너무 많았다. 그래서 조금 수정을 가했다.

    params.merge(additional_data).reject { |key| ['email', 'messenger', 'status', 'messenger_user_id'].include?(key) }

거의 다 된거 같은게 갈수록 태산처럼 보인다. 이번에는 messenger_user_id가 UserMessenger 모델에 들어가야하는 값이라는걸 깨달았다. 당장 어디다 넣어야 할지도 모르겠는데.. 일단 `get_more_info` 메서드를 조금 수정하여 처음 생성하는 MealMeetUp일 경우 새로운 UserMessenger 객체를 생성하는 것 까지 진행했다.

지금까지 작업하여 돌아가기는 하지만 영 못마땅한 부분이 많다. 특히 반복적인 부분과 매끄럽게 보이지 않는 부분들이 너무 많은데, 본격적으로 수정을 하면 어디부터 손을 대야할지 해봐야 알 것이다. (루보캅 테스트 통과 못한 부분이 무려 22개)

루보캅에서 주로 걸리는 문제는 ABC(Assignment Branch Condition) 사이즈가 너무 크다는 것이다. 한번에 이해는 하기 힘들었지만 변수를 많이 선언하고, 조건을 많이 걸고, 얽힌 메서드가 많을 수록 점수가 올라가는 기분이 든다.

당장 위에 작성한 `get_more_info` 메서드만 해도 기준을 1.5배 초과하고 있다. 당장 저 메서드를 수정하려면 어떻게 해야할까? 저 메서드가 어떤 기능을 수행하는지 나누어 보자.

- status 패러미터를 가져와서 패러미터가 없으면 'created'를 부여한다.
- messenger_code를 가져온다.
- status_code를 가져온다.
- status가 'created'이면 (즉 처음 MealMeetUp이 생성되는거면) 새로운 유저와 유저메신저 객체를 생성한다.
- 생성된 유저의 Id와 messenger_code, status_code를 새로운 해시(addtional_data)로 만든다.
- 기존의 패러미터에 addtional_data를 합친다.

기능별로 하나하나 나눌 순 있다. 점점 메서드의 산이 되어가는 기분이지만..
먼저 걸리는 점은 새로운 유저 생성, 그다음은 스테이터스 패러미터, 마지막은 추가 해시 생성이다.
새로운 유저 생성 부분부터 분리해보자.

무작정 분리한건 좋은데 이 메서드들을 어떻게 합쳐야 할지 감이 오지 않는다.

```ruby
def fetch_params
    @params = get_more_info(meetup_params)
end

def load_status(status)
    status.nil? ? 'created' : status
end

def load_status_code(status)
    @status_code = CodeTable.find_status(status).id
end

def load_messenger_code(messenger)
    @messenger_code = CodeTable.find_messenger(messenger).id
end

def load_user(status, params)
    if status == 'created'
    @user = User.create(email: params[:email])
    UserMessenger.create(user_id: user.id,
                            messenger_user_id: params[:messenger_user_id],
                            messenger_code: messenger_code)
    else
    @user = User.find_by(email: params[:email])
    end
end

def get_more_info(user, messenger_code, status_code, params)
    additional_data = { admin_id: user.id,
                        messenger_code: messenger_code,
                        meetup_status: status_code }

    params.merge(additional_data).reject do |key|
    %w(email messenger status messenger_user_id).include?(key.to_s)
    end
end
```

분명 get_more_info를 실행시키기 위해선 위에 정의해둔 메서드를 모두 쓸 필요가 있다.
생각해보면 굳이 인자를 받을 필요가 없는데..? params는 어디서든지 쓸 수 있으니까.
그 점에 착안하여 수정한 코드는 이렇다.

```ruby
def fetch_params
    @params = get_more_info(load_user, load_messenger_code,
                            load_status_code, meetup_params)
end

def load_status
    params[:status].nil? ? 'created' : meetup_params[:status]
end

def load_status_code
    CodeTable.find_status(load_status).id
end

def load_messenger_code
    CodeTable.find_messenger(meetup_params[:messenger]).id
end

def load_user
    params = meetup_params
    if load_status == 'created'
    @user = User.create(email: params[:email])
    UserMessenger.create(user_id: @user.id,
                            messenger_user_id: params[:messenger_user_id],
                            messenger_code: load_messenger_code)
    else
    @user = User.find_by(email: params[:email])
    end
    @user
end

def get_more_info(user, messenger_code, status_code, params)
    additional_data = { admin_id: user.id,
                        messenger_code: messenger_code,
                        meetup_status: status_code }

    params.merge(additional_data).reject do |key|
    %w(email messenger status messenger_user_id).include?(key.to_s)
    end
end
```

다 수정했더니 이번엔 클래스가 너무 길단다. (104/100줄)
줄일 부분 중 가장 크게 눈에 띄는 부분은 if-else문이 여러번 있는 것이다.
아예 검증 자체를 처음부터 메서드화 + before_action을 적용하고, 검증을 통과한 녀석만 create, update가 실행되도록 만들려고 하였다.
하지만 그 검증 메서드도 점점 몸집이 불어나더니 통과를 못하는 문제가 발생하였고, 야매로 해결한 방법은 helper에다가 넣을 만한 메서드를 옮겨놓고 `include MealMeetUpHelper`를 삽입하는 것이었다.
