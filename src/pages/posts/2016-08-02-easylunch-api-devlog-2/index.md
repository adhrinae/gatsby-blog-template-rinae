---
path: "/posts/easylunch-api-devlog-2"
date: "2016-08-02"
title: "Easylunch Api 서버 제작기 - 2"
category: "Rails"
tags:
  - Rails
---

## Members 구현

이번엔 생성된 `MealMeetUp` 에 새로운 맴버를 추가하는 기능을 구현할 것이다.
필요한 메서드는  `add_members` 하나 뿐이라 생각보다 복잡하진 않을 것이라 생각된다.

먼저 Members 컨트롤러를 생성한다.

    rails g controller Members

그리고 routes.rb 파일에 api 경로를 추가해준다.

    # routes.rb
    # ...
    post '/members' => 'members#add_member', defaults: { format: 'json' }

텅텅 빈 Members 컨트롤러에는 기본적으로 들어갈 메서드들이 있다.

- Strong parameters
- 맴버들을 등록하기 위한 정보가 충분한지 검사
- 기본적인 약속 (email, messenger) 정보가 제대로 작성되어 있는지 검사
- 해당하는 `messenger_room_id` 의 검색

사실 Strong parameters를 제외한 나머지 기능들은 기존에 `MealMeetUp` 을 구현할 때 만들었던 메서드들을 거의 그대로 써도 될 것이다.
하지만 미묘한 차이가 있어서 지금은 새로 작성하고 나중에 리팩토링 할 때 합치기로 마음먹었다.

작업을 하다보니 조금 애매하게 생각되는 부분이 '멤버를 추가하면 DB에 어떻게 기록이 되어야 할까?' 라는 부분이다.

1. json으로 member_id를 받고, 그 아이디로 새로운 유저를 생성한다.
2. 그 유저에 해당하는 UserMessenger, UserLog를 생성한다.
3. UserLog에 속하는 MealMeetUpTask를 생성한다.
4. MealMeetUpTask의 meal_meet_up_id(외부키)는 현재 등록할 meal_meet_up으로 지정해준다.

이렇게 하면 될 것 같은데, User의 컬럼을 `id(기본키) / email` 로 지정해둔게 걸린다. 보통 메신저에서 제공하는 user의 고유 식별 정보를 넣는데 써야 할 것 같은데, 슬랙의 경우엔 이메일이 아닌 듯 하여 아예 컬럼명을 수정해야겠다.

![기존에 작성된 DB 다이어그램](2016-08-02-sc1.png)

---

슬랙에 팀원들의 의견을 물으니 UserMessenger 테이블에 email컬럼을 넣고, User의 email은 service_uid등으로 바꾸는게 좋겠다는 의견을 받았다.

그렇게 생각하니 애매하게 보이던 맴버 추가 개념이 조금 명쾌해졌고, DB 컬럼을 먼저 수정해보기로 하였다.

```ruby
class ChangeUserAndMessenger < ActiveRecord::Migration
  def change
    rename_column :users, :email, :service_uid
    add_column :user_messengers, :messenger_user_email, :string
  end
end
```

다시 맴버 추가 과정을 구성한다면

1. json으로 넘어온 member_ids에서 하나하나씩 유저를 추가한다.
2. 유저에 해당하는 UserMessenger, UserLog를 생성한다. 만약 이메일이 있다면 이메일도 추가한다.(Optional)
3. UserLog에 속하는 MealMeetUpTask를 생성한다.
4. 그리고 각 유저의 MealMeetUpTask는 현재 이용중인 MealMeetUp에 속하게 된다.

조금 직관적인 느낌은 떨어지게 보인다. 바로 유저가 MealMeetUp이라는 그룹과 연결되는 것이 아니니까.
맴버 추가 과정을 하나의 메서드화하고, 리스폰스로 생성할 json도 메서드로 한번에 만들도록 하였다.

```ruby
class MembersController < ApplicationController
# ...

 def add_flow(member, meetup)
      user = User.create(service_uid: member)
      user_log = MealLog.create(user_id: user.id)
      UserMessenger.create(user_id: user.id,
                           messenger_code: load_messenger_code)
      MealMeetUpTask.create(meal_log_id: user_log.id,
                            meal_meet_up_id: meetup.id,
                            task_status: init_task_code)
    end

    def add_user_response(meetup)
      { data:
        { email: meetup.admin.service_uid,
          messenger: meetup.messenger.value,
          messenger_room_id: meetup.messenger_room_id,
          member_ids: get_members_list(meetup) } }
    end
# ...
```

사실 맨 밑의 member_ids는 좀 복잡하게 가져오더라도 맴버 추가에 성공한 id만 가져와야 하는게 맞을 것 같다.

실제로 실행을 시켜 보니 member_ids라는 패러매터를 아예 가져오지 못했는데, 이는 패러매터의 형식이 배열로 되어 있어서 그렇다. 배열로 된 패러매터를 가져올 때는 스트롱 패러매터에서 형식을 지정해 주어야 한다

    params.permit(:id => [])

service_uid로 컬럼명을 수정하면서 생긴 오류들을 잡아주고 차근차근 진행하고 있다가 확실히 response의 `member_ids` 를 제대로 MealMeetUp에 엮여있는 유저들만 가져오는게 맞다는 생각이 들었다.
결국 가져와야 하는 것은

**MealMeetUp에 속한 Task들 -> 각 Task를 가지고 있는 MealLog -> MealLog를 소유하고 있는 User의 service_uid** 인 것이다.
DB를 리셋하고 먼저 MealMeetUp을 하나 생성한 뒤에 유저 추가 과정을 거치니 잘 추가되었다.

커밋을 한 뒤에 멘토님이 코드 리뷰와 함께 조언들을 해 주셨다.

- Fat Model, Skinny Controller
- 컨트롤러는 최소한의 연결만 해주는 게 좋겠다.
- 패러미터의 여부를 체크하는 것을 굳이 본 메서드에서 할 필요가 없어 보인다. -> before_action 사용
- member_ids의 유효성을 검사할 필요가 있다.
- 메서드 이름은 다른사람이 이름만 보아도 무엇을 하는 작업인지 알 수 있어야 한다
- 맴버 추가하는 일련의 과정을 담은 `add_flow` 메서드를 user모델에 정의해서 쓸 필요가 있겠다 (`init_member` 같은 이름으로)

대개 리펙토링을 하면서 처리해야 하는 부분들이지만, 멤버 추가를 유저 모델에 정의하는 지금이라도 처리해야할 필요가 있다.
기존에 MealMeetUp을 만들 때 자동으로 어드민 유저를 생성하는데, 어드민 유저도 같은 방에 포함되는 유저로서 MealLog, Messenger, Task 등록 등의 작업을 해 주어야 한다고 생각하기 때문이다.

그런데 지금은 MealMeetUp 생성 당시 어드민 유저의 service_uid가 없기 때문에, 생성을 하자니 조금 애매한 부분이 있다.
먼저 떠오르는 생각으로는 MealMeetUp 생성만 하고 어드민은 따로 Members 추가 시에 지정하는 방법이 있겠다. 아니면 처음 MealMeetUp 생성때부터 어드민이 될 사람의 service_uid를 받아야 한다.

*(추가)* 그냥 MealMeetUp 생성시에 어드민이 될 사람의 service_uid도 받는 방식으로 수정을 하기로 하였다.

그리고 맴버가 추가된 MealMeetUp의 상태도 변화시켜서, 추가적인 유저 입력을 막을 수 있어야한다. 지금 방식대로라면 계속 유저를 추가하는대로 새로운 유저를 집어넣고 있는데, 이는 제대로된 방법이 아니다. *(처리 완료)*

```ruby
# members_controller.rb

def add_member
    @meetup = find_meetup
    entry_members = member_params[:member_ids]
    entry_members.each { |member| init_member(member, @meetup) }

    # 맴버가 추가된 MeetUp은 상태를 변경해준다.
    @meetup.update(meetup_status: CodeTable.find_status('paying').id)

    render_200(add_user_response(@meetup))
end
```

## Refactoring (1)

현재까지 개발한 부분을 adapter와 연동해보기 위해 조금 미진한 부분을 수정하고 허로쿠에 배포해보기로 하였다.
가장 우선적으로 수정해야겠다고 생각하는 부분이 처음 MealMeetUp 생성시 어드민도 `init_member` 를 해 주는 것인데, 맨 처음 MealMeetUp 생성을 구현했을 때 만든 부분에서 많은 수정을 해야겠다.

- MeetUp 생성시 먼저 메신저 종류, room_id만 써서 생성한다. (생성시엔 상태를 'created' 로 지정)
- service_uid 로 user를 생성 `init_member` 메서드로 필요한 데이터를 다 같이 생성한다(MealLog, Messenger, Task)
- 생성 된 user가 어드민이 된다.

먼저 `init_member` 메서드를 User모델로 옮기고 조금 추가적인 정보를 받도록 한다.
그리고 처음 MeetUp 생성시에 필요한 정보만 넣어서 일단 생성을 하고, 그 MeetUp과 어드민이 될 맴버를 연결한다.

```ruby
# models/user.rb
# 새로운 맴버 등록시 필요한 일련의 과정들
def self.init_member(member_uid, meetup, messenger_code, task_code)
    user = User.create(service_uid: member_uid)
    user_log = MealLog.create(user_id: user.id)
    UserMessenger.create(user_id: user.id,
                            messenger_code: messenger_code)
    MealMeetUpTask.create(meal_log_id: user_log.id,
                            meal_meet_up_id: meetup.id,
                            task_status: task_code)
    user # 바로 user를 사용가능하도록 return
end


# models/meal_meet_up.rb
# 빈 MeetUp 생성
def self.init_meetup(params)
    create(messenger_code: CodeTable.find_messenger(params[:messenger]).id,
            messenger_room_id: params[:messenger_room_id],
            meetup_status: CodeTable.find_status('created').id)
end


# controllers/meal_meet_up_controller.rb
def create
    @admin = User.init_member(meetup_params[:messenger_user_id], @meetup,
                                load_messenger_code(meetup_params),
                                CodeTable.find_task('unpaid').id)
    update_additional_info(@admin, @meetup)
    render_201(response_json_create(@meetup))
end

def update
    @meetup.update(total_price: meetup_params[:total_price],
                    meetup_status: load_status_code(meetup_params[:status]))
    render_200(response_json_update(@meetup))
end
```

그리고 복잡하게 `if~else` 로 엮여있던 `create`, `update` 액션을 `members_controller` 에서 썼던 `before_action` 의 필터링을 적용하여 크게 다이어트 해 주었다.

처음에 MealMeetUp을 만들 땐 돌아만 가게 만드느라 억지로 해쉬를 자르고 붙이고 하는 작업을 했었는데, 실질적으로 필요한 요소들을 조금 더 고민하고 수정을 하니 실제로는 더 적은 양의 코드로도 작성이 가능하게 되었다.

하지만 코드를 작성하고 나서 실제 구동하여 테스트를 해보니 부족한 부분이 많았는데, 먼저 한번 유저를 추가하고 나면 더 추가하지 못하게 설계 한 부분이 미스였고, MealMeetUp도 중복 검사를 제대로 하지 못하고 있던 것이다.

전반적으로 처음 코드를 작성할 때 중복 처리에 대해 크게 고민을 하지 않고 만든게 원인이었다. 조금 더 신중하게 코드를 작성해야 했었는데..

특히 before_action을 너무 남용한 부분이 있었는데 `meal_meet_up#create` 만 해도 그냥 패러미터가 들어오자마자 무조건 MealMeetUp을 생성하도록 before_action을 하나 만들어 놓으니 나중에는 중복 검사를 할때 자꾸 '이미 만들어진 meetup' 이라는 오류를 내뿜게 되었다.

```ruby
class MealMeetUpController < ApplicationController
  include MealMeetUpHelper
  before_action :check_params, only: [:create, :update]
  before_action :check_meetup_update, only: [:update]
  before_action :check_meetup_create, only: [:create]
  # before_action :init_meetup, only: [:create]

  def create
    init_meetup
    # ...

```

이렇게 수정하여 먼저 중복된 meetup이 있는지 확인을 하고, 없으면 생성을 하는 과정을 거치도록 수정하니 잘 작동하였다.
앞으로도 수정할 부분은 많이 있을 것이지만, 한줄 한줄 코드를 작성할 때 조금 더 과정에 대해 심혈을 기울여 생각할 필요성을 크게 느꼈다.
