---
path: "/posts/easylunch-api-devlog-3"
date: "2016-08-10"
title: "Easylunch Api 서버 제작기 - 3"
category: "Rails"
tags:
  - Rails
---

## MealMeetUpTask 구현

이번엔 개별 구성원의 상태를 변경해주는 메서드를 작성해야 한다.
유저의 정보를 받고, 그 사람의 MealLog를 업데이트 해 주고, 마지막으로 MealMeetUpTask도 업데이트 해 주는 과정으로 이어질 것이다.

### Task - menu

작업을 하기에 앞서 작성해놓은 API에 더 부족한 부분은 없는지 고려해보기로 하였다.
(지금도 충분히 미완성이지만) 여태까지의 구현은 대부분 이 명세서를 보고 똑같이 데이터가 들어오면 저장을 하고, 같은 형태로 자료를 내보내는 데 초점을 맞추고 있었기 때문이다.
하지만 명세서만 보고 맹목적으로 기능구현을 하다가 중복 처리 등을 놓치는 실수를 하게 되었으니 조심해야 한다.

메뉴를 등록하는 과정을 순서대로 구성해보면 이런 방식으로 이루어질 것이라 예상한다.

1. 패러미터의 유효성을 검사한다 -> 400 or 401에러
2. 유효한 패러미터임이 확인되면 MeetUp을 조회한다
3. MeetUp에 해당 유저가 있는지 조회한다 -> 없다면 400에러
4. 유저가 존재하면 MealLog와 Task를 업데이트한다.
5. 업데이트한 데이터를 기반으로 리턴 데이터(JSON)를 어댑터로 내보낸다.

_과정을 떠올리면서 갑자기 생각난 것이 왠지 `meetup#create` 하면서 이미 등록된 User가 맴버로 들어갔을 때 해당 MeetUp에 연결되는 새로운 Log와 Task를 생성하고 연결해주는 작업을 제대로 수행했는지 잘 기억이 안난다. 나중에 확인해봐야겠다._

4번의 경우에는 테이블 구조가 생각보다 복잡하게 얽혀 있다는 점을 감안하여 User, Log, Task 테이블들을 `join` 한 다음 `user_id`, `meal_meet_up_id` 가 일치하는 Log, Task를 검색하고 갱신하도록 만들면 될 것이라고 생각한다.
지금이야 적은 데이터를 다루니까 굳이 테이블을 조인해가면서 검색할 필요가 없다고 여길 수도 있지만, 만약에 사용성이 있어서 한 유저가 여러번 사용을 한 다고 가정하면 한 유저가 각기 다른 MeetUp에 등록되는 일이 당연히 있을 것이다. 그 부분을 간과하지 않도록 노력해야겠다.

---

먼저 패러미터의 유효성을 검사하는 부분을 생각하다 보니, 기존에 있던 패러미터 검사 메서드들은 패러미터를 두개씩 검사하였지만, 이번에는 검사할 패러미터가 늘어났다(3~4개).
거기다 메뉴를 추가하는 액션과 status만 업데이트하는 액션은 검사할 패러미터가 다르기에 하나의 `check_params` 메서드로 모든 조건을 만족할 수는 없게 되었다. 패러미터마다 일일이 `empty?` 를 넣어 확인해보고, 그걸 `and` 나 `or` 로 줄줄이 잇는 것은 꽤 복잡하고 불필요한 작업이다.

그런데 구현하면서 전보다 조금은 나은 형태로 검사를 할 수 있는 아이디어가 떠올랐다. 검사할 패러매터들을 전부 배열에 넣은 뒤에 경우에 따라 `any?` 혹은 `all?` 메서드를 사용하여 검사를 하는 것이다.

```ruby
# 기존 검사방법
def params_valid?
    !member_params[:messenger_room_id].to_s.empty? &&
        !member_params[:member_ids].to_s.empty?
end

def params_authorizable?
    !email_invalid?(member_params[:email]) &&
        !member_params[:messenger].to_s.empty?
end

# 새로운 검사방법
def params_valid?
    [task_params[:price], task_params[:menu]].all? { |e| !e.to_s.empty? }
end

def params_authorizable?
    !email_invalid?(task_params[:email]) &&
    [task_params[:messenger], task_params[:member_id],
        task_params[:messenger_room_id]].all? { |e| !e.to_s.empty? }
end
```

여러번 반복할 일을 많이 줄여서 조금이 더 깔끔한 코드가 작성되었다.

다음은 메뉴를 기록하고 Task의 상태를 업데이트 하기 위해 필요한 정보들을 조회하고, 정보가 존재하는지 찾아야한다.
해당 MeetUp을 찾는 것은 당연하고, User와 조합하여 찾는 Log, Task가 있는지 찾아야한다. 이 작업은 joins를 사용하면 될 것으로 생각하고, 콘솔에서 연습삼아 데이터 조회를 시도해보았다.

    tasks = MealMeetUpTask.joins(:meal_meet_up, :meal_log) # has_many, belongs_to에 따라 단수, 복수 유의
    tasks.where(meal_meet_ups: { id: 1}, meal_logs: { user_id: 4} ) # 자료추출 성공. 두 값에 모두 해당하는 task만 나온다.

    logs = MealLogs.joins(:user, :meal_meet_up_tasks)
    logs.where(meal_meet_up_tasks: { meal_meet_up_id: 1 }, users: { id: 1 })

이런식으로 자료를 가져와서 기록하면 될 것으로 보인다. 예시로 작성해본 join은 저렇게 광범위하게 하기 보단, 특정 MeetUp, 특정 User를 찾도록 먼저 where를 입력한 뒤에 `joins` 를 사용하면 더욱 효과적일 것이다.

    MealLog.where(user_id: 1).joins(:meal_meet_up_tasks).where(meal_meet_up_tasks: {meal_meet_up_id: 1})


---

마지막 기록을 하고 잠시 작업을 손 못 대고 있다가 다시 시작하려니 개념을 많이 잊어버서 꽤 혼란스러웠다.
다시 복습삼아 노트에 적어보니 Log를 찾으려면 다음과 같은 생각들이 떠올랐다.

- Log와 Task는 1:1 관계이다
- User와 MeetUp 정보만으로 Log와 Task를 찾는 과정이 조금 복잡하다

일단 Log 모델에서 `has_many` 로 관계를 설정해 둔 것을 `has_one` 으로 변경하였다.
Log를 먼저 찾아야 할지 Task를 먼저 찾아야 할지가 문제인데 Log를 먼저 찾는 시나리오를 떠올려 보기로 했다.

1. User1이 MeetUp1에 등록되어있다. MeetUp에 User1이 등록될 때 Log1, Task1을 생성하였다.
2. MealMeetUpTask 컨트롤러에서는 User1의 id와 MeetUp1의 id를 패러미터로 넘긴다.
3. 여기서 User1이 가진 Log 중 Log의 Task를 조회한다. 어떻게 조회하냐면 Task의 meet_up_id가 1인 로그를 가져오는 것이다. Log-Task는 1:1 관계이기 때문에 그렇게 복잡하지 않다.
4. Log를 업데이트 하고 나면 연결된 Task를 업데이트한다.

가정을 실험해 보기 위해 MeetUp을 두개 생성하고 같은 맴버들을 집어넣으려고 했는데 새 MeetUp에는 맴버가 한명도 들어가지 않는 오류가 발생해서 이를 먼저 해결해야겠다.

---

### 맴버 등록 버그 수정

- MeetUp를 여러 개 생성하고 나서 같은 맴버를 다른 MeetUp에 등록할 시 등록이 안된다.
- MeetUp에 맴버를 등록할 때 만약에 해당 맴버가 없으면 User의 `init_member` 메서드로 연결되는데, 이 메서드는 단순히 전체 DB에서 중복되는 맴버가 있는지 검사하고 아예 없을때만 User를 새로 생성하는 역할을 한다.
- 문제를 해결하려면 DB에 같은 맴버가 있지만 다른 MeetUp에 등록할 시 처리를 따로 해 주어야겠다.

모델 구조가 내가 생각하던 것 보다 복잡하다보니 문제 해결을 위한 아이디어가 바로 떠오르지 않는게 아쉽다. 유저를 등록할 때의 경우의 수를 다시 상정해보면

- Meetup과 member를 모두 처음 등록하는 경우: 문제 없음. 그냥 해당 MeetUp의 Task 명단에 맴버가 없으니 바로 새로운 User > Log > Task 생성
- Meetup 한개에 Member가 추가 등록되는 경우: 문제 없음. DB에 등록되어 있지 않은 User면 똑같이 User > Log > Task 생성
- MeetUp 갯수에 상관 없이 DB에 등록된 적 있는 User를 등록하려고 할 때: 이 때가 문제. 현재는 단순히 User가 존재하지 않으면 새로 생성하는것 까지만 한다.

그럼 세번째 문제를 해결하기 위해 필요한 것은 **User가 있는지 검사하고**, **있다면 해당 User가 MeetUp에 등록되어있는지 검사하고**, **MeetUp에 등록되어있지 않다면 해당 MeetUp과 연결되는 Log, Task를 생성** 하는 과정일 것이다.

결국 User 모델을 조금 수정해주어서 해결할 수 있었다.

```ruby
# models/user.rb
# ...
  # 새로운 맴버 등록시 필요한 일련의 과정들
  def self.init_member(member_uid, meetup, messenger_code, task_code)
    user = find_by(service_uid: member_uid)
    if user.nil?
      result = enroll_new_user(member_uid, meetup, messenger_code, task_code)
    elsif user && user.find_enrolled_meetup(meetup.id).empty?
      result = enroll_exist_user(user, meetup, task_code)
    end
    result # Admin 등록을 위해 user정보가 리턴되어야 함
  end

  # DB에 기록되어있지 않은 맴버를 새로 생성
  def self.enroll_new_user(member_uid, meetup, messenger_code, task_code)
    user = User.create(service_uid: member_uid)
    user_log = MealLog.create(user_id: user.id)
    UserMessenger.create(user_id: user.id, messenger_code: messenger_code)
    MealMeetUpTask.create(meal_log_id: user_log.id,
                          meal_meet_up_id: meetup.id,
                          task_status: task_code)
    user
  end

  # DB에 등록된 적 있는 맴버가 새로운 MeetUp에 등록되는 경우
  def self.enroll_exist_user(user, meetup, task_code)
    user_log = MealLog.create(user_id: user.id)
    MealMeetUpTask.create(meal_log_id: user_log.id,
                          meal_meet_up_id: meetup.id,
                          task_status: task_code)
    user
  end
# ...
  # 해당 user의 MeetUp등록 여부를 찾기 위해 Log > Task 연결하여 검색
  def find_enrolled_meetup(meetup_id)
    meal_logs.joins(:meal_meet_up_task).where(meal_meet_up_tasks:
                                              { meal_meet_up_id: meetup_id })
  end
# ...
```

MeetUp에 User가 등록되어있는 지 여부는 MeetUp에 속한 Task가 있는지 여부로 구분하였다. 맴버가 등록된 적이 없으면 MeetUp에 해당하는 Log, Task를 작성한 적이 없을 테니까.
수정해놓고 중간에 admin 등록하는 부분이 꼬이긴 했는데 해당 user를 반드시 리턴해주어야 그 정보로 admin을 등록하도록 설정해 두었기 때문이다.

`find_enrolled_meetup` 메서드가 실제로 User 모델과는 관련이 좀 적어보이지만, 적어도 User에 등록된 Log를 가져오는 것 부터 시작하니 괜찮을 것이다.

### 다시 Task - Menu

버그를 수정하면서 `find_enrolled_meetup` 을 만들어서 뜻밖의 밑작업이 완료되었으니 나머지는 실질적으로 메뉴 추가가 가능하도록 만들면 된다.

```ruby
# meet_up_tasks_controller.rb
# ...
  def menu
    @meetup = find_meetup
    @meal_log = User.update_menu(@meetup, task_params)
    render_201(menu_response(@meal_log))
  end
# ...

# models/user.rb
# ...
  def self.update_menu(meetup, user_info = {})
    user = find_by(service_uid: user_info[:member_id])
    user_log = user.find_enrolled_meetup(meetup.id) # 해당 MeetUp에 속하는 MealLog
    user_log.update(menu_name: user_info[:menu], price: user_info[:price])
    user_log
  end
# ...

```

그런데 이상하게 정보 업데이트가 되지 않는 문제가 있어서 확인해보니 `find_enrolled_meetup` 의 결과가 배열로 리턴되는 것이었다. 어차피 나올 값은 하나밖에 없는데..
알고보니 결과를 검색할 때 `where` 를 사용하면 배열로 리턴되고, `find_by` 를 쓰면 검색 결과의 첫 번째 결과를 리턴한다고 한다. 막연하게 결과값이 하나만 나오는 건 알고 있었는데 이제 제대로 활용해야지.

결과값을 리턴하는 JSON을 만들 때 기존에는 해당하는 값을 일일이 DB에서 꺼내오는 방식의 메서드를 작성했었는데, 막상 '굳이 그럴 필요가 있나?' 라는 생각이 들었다. 멘토님은 '어떻게 구현하는게 좋은 설계일까?' 고민해보고 실제 상황이 닥치면 그 상황에 맞는 최적의 솔루션을 도출하는 연습이 필요하다고 조언해주셨다.

지금 당장은 이정도 검색을 한다고 부하가 걸리는 수준이 아니고 나중에 변화가 생길 수도 있는 점을 고려하여 기존 방식대로 DB에서 해당 값을 가져오는 방식을 택했다.

### API 명세 수정

야밤의 토론을 통해 API 명세가 좀 문제가 있다는 점을 깨달았다. 애초에 이메일을 패러미터로 받을 필요가 별로 없고, 메신저 종류와 `service_uid` 를 기본으로 받는 형태로 DB 구조와 현재 메서드를 전부 수정해야한다.

명세서는 수정하였고, DB는 딱히 수정하지 않고 내부 로직만 변경하여도 충분할 것 같다.

API를 좀 다듬어서 작성하고 나니 코드를 변경하는게 쉬워졌는데, 작성하는 코드에 일관성이 부여되기 때문이다.
패러미터의 유효성을 검사하는 부분과, MeetUp을 검색하는 메서드를 `application_controller` 하나에 두고 관리할 수 있게 되었다.
또한 `routes.rb` 에 미리 `format` 을 json으로 지정해두어서 일일이 `respond_to` 를 사용하지 않고 오류 경우의 수에 따라 에러 메세지를 각기 다르게 출력할 수 있도록 변경하였다.

```ruby
# application_controller.rb
# ...
  def find_meetup
    @meetup = MealMeetUp.find_by(messenger_room_id:
                                 params[:data][:messenger_room_id])
  end
# ...


# members_controller.rb
# ...
    def check_meetup
      meetup = find_meetup
      if meetup.nil?
        render json: { error: 'cannot find meetup' }, status: 400
      elsif meetup.status.value != 'created'
        render json: { error: 'cannot add members to this meetup' }, status: 400
      elsif member_params[:member_id].to_s.empty?
        render json: { error: 'there is no member to enroll' }, status: 400
      end
    end
# ...
```

이런식으로 find_meetup은 어느 컨트롤러에서 호출하여 같은 결과값을 얻고, 경우의 수에 따라 다른 에러를 표시하도록 적용하였다.

### Task - Update

Update 액션은 menu를 만들 때 미리 작성해둔 메서드들 덕에 생각보다 금방 완성되었다.
User 모델에 `find_enrolled_meetup` 을 사용하면 해당 유저와 유저가 참여한 MeetUp에 맞는 MealLog를 가져온다. 거기에 바로 1:1로 연결되어있는 Task를 꺼내고, 그 Task를 업데이트 해주는 식으로 코드를 작성하였다.

```ruby
# models/user.rb
# ...
  def self.update_task_status(meetup, user_info = {})
    task_code = CodeTable.find_task_status(user_info[:status]).id
    user = User.find_by(service_uid: user_info[:member_id])
    task = user.find_enrolled_meetup(meetup.id).meal_meet_up_task
    task.update(task_status: task_code)
    task
  end
# ...
```

## 맴버 삭제 기능 추가

처음에 미처 계획에 없었던 'MeetUp에 추가된 맴버를 삭제하는 기능'을 추가하기로 하였다.
어찌 보면 당연히 있어야 하는 기능인데 실수로 넣지 않았다고 생각하는 쪽이 빠를 수도 있겠다.

맴버를 MeetUp에서 삭제하는 것은 유저를 통채로 삭제할 필요는 없겠지만, 해당하는 MealLog, MeetUpTask는 삭제해줄 필요가 있겠다. 만약에 다시 등록할 때는 새로 만들어줘야 하는게 맞다고 생각하니까.

기존에 구현해 둔 `find_enrolled_meetup` 을 사용하면 해당 MeetUp에 속해있는 MealLog가 리턴되니까 이 로그를 삭제하도록 하고, 로그에 연결된 Task도 자동으로 삭제되도록 조치해준다.

```ruby
# models/meal_log.rb
class MealLog < ActiveRecord::Base
  has_one :meal_meet_up_task, dependent: :destroy
  belongs_to :user
end
```

맴버 삭제를 하기 전에 패러미터에 따라 고려해야 할 사항은 다음과 같다.

- 해당하는 MeetUp이 존재하는가?
- admin_uid가 입력되었는가? -> 오류(admin은 삭제 불가능)
- 삭제하고자 하는 맴버가 해당 MeetUp에 등록되어 있는가?

위 조건을 모두 만족한다면 정상적으로 해당 유저의 MealLog, Task를 삭제해주면 될 것이다.

맴버를 추가할 때와 삭제할 때 한꺼번에 패러미터를 검사하는 메서드를 만들면 좋겠는데, 약간 차이가 있기 때문에 조금 비슷한 부분이 있더라도 따로 작성하게 되었다.

```ruby
# members_controller.rb
# ...
  def delete_member
    target_member = member_params[:member_id].to_s
    User.delete_member(target_member, @meetup)
    render_200(member_response(find_meetup))
  end

# ...
    def check_add_member
      meetup = find_meetup
      if meetup.nil?
        render json: { error: 'cannot find meetup' }, status: 400
      elsif meetup.status.value != 'created'
        render json: { error: 'cannot add members to this meetup' }, status: 400
      elsif member_params[:member_id].to_s.empty?
        render json: { error: 'there is no member to enroll' }, status: 400
      end
    end

    def check_delete_member
      meetup = find_meetup
      member_id = member_params[:member_id].to_s
      if meetup.nil?
        render json: { error: 'cannot find meetup' }, status: 400
      elsif meetup.admin.service_uid == member_id
        render json: { error: 'cannot delete admin member' }, status: 400
      elsif get_members_list(meetup).include?(member_id)
        render json: { error: 'cannot find the member_id in this meetup' },
               status: 400
      end
    end
# ...


# models/user.rb
# ...
  def self.delete_member(member_uid, meetup)
    user = find_by(service_uid: member_uid)
    target_log = user.find_enrolled_meetup(meetup.id)
    target_log.destroy
  end
# ...
```

얼떨결에 `find_enrolled_meetup` 메서드가 대부분의 문제를 손쉽게 해결해주었다. 단순하게 joins 구문만 적절하게 이용해 주었을 뿐인데. MealLog에 설정해둔 `dependency` 도 잘 작동하였다.


## 입력받은 가격을 분배하기

이 앱의 제일 핵심기능인 'n빵 / 각자 입력하여 얼마를 내야 하는지 알리기' 기능이 여태까지 빠져 있었다.

- n빵 / 각자 입력을 나누는 스테이터스 코드
- MeetUp의 total_price가 없으면 맴버의 메뉴 등록을 막기 (먼저 total_price가 등록되어있어야함)
- 모든 맴버가 가격 입력을 완료하면 MeetUp의 상태를 `completed` 로 변경

이런 기능이 추가적으로 구현될 필요가 있는데 먼저 코드테이블에 자료를 입력하는 seed파일을 수정하여 price를 지우고 `price_avg`, `price_sep` 두 가지 상태로 나누었다.

그리고 MeetUp을 업데이트 할 때 `price_avg` 상태일 때만 N빵 가격을 계산해서 각각 유저들의 Log에 해당 가격을 입력하도록 만들어 두었다.

```ruby
# models/meal_meet_up.rb
# ...
  def update_status(total_price, meetup_status)
    if meetup_status == 'price_avg'
      price_avg(total_price)
    else
      update(total_price: total_price.to_i,
             meetup_status: CodeTable.find_meetup_status(meetup_status).id)
    end
  end

  def price_avg(total_price)
    avg_price = total_price / meal_meet_up_tasks.count
    meal_meet_up_tasks.each do |task|
      task.meal_log.update(price: avg_price)
    end
  end
# ...
```

모든 맴버가 가격을 입력하도록 하는 메서드는 맴버가 상태를 업데이트 하는 메서드 마지막 부분에 따로 심어두었다.

```ruby
# models/meal_meet_up_task.rb
# ...
  def check_completed
    result = meal_meet_up.meal_meet_up_tasks.all? do |task|
      task.status.value == 'paid'
    end
    completed_code = CodeTable.find_meetup_status('completed')
    meal_meet_up.update(status: completed_code) if result
  end
```

### n빵 분배하고 난 뒤에 고려하지 못한 것들

- MeetUp의 상태가 `price_avg` 일 때 개별 맴버들이 메뉴를 수정하는 것을 차단해야했다
- 맴버들이 가격만 수정하려고 하는데도 메뉴도 입력하라는 오류가 발생
- 상태 업데이트 없이 MeetUp의 현재 상태를 점검할 수 있도록 하는 API 추가

점점 처리해야하는 에러 경우의 수들이 늘어나면서 rubocop에 걸리기가 쉬워지고 있다.
에러 처리도 파트별로 나누어야 할지, 더 쪼갤 수 있는 방법이 있을지 고민해보아야 할 것 같다.

위 두가지 버그성 문제들은 생각보다 간단하게 해결할 수 있었다. 첫 번째 문제와 두 번째 문제 모두 필터에서 걸러내는 경우의 수를 약간 조정해주는 정도로 해결되었고, 마지막 문제도 MeetUp을 그대로 조회하여 보여주기만 하면 되기 때문에 금방 처리하였다.

이후에는 새 맴버를 추가받지 못하도록 고려하는 타이밍이 언제 이루어져야 하는가에 대한 문제가 있었는데

- 세팅이 끝났다는 커맨드를 직접 날리려서 처리하거나 (DB에 새로운 필드 추가)
- 맴버 추가가 잠기는 시점을 변경 (기존엔 MeetUp 상태가 'created'일 때만 맴버 추가 가능)

조금 돌아가는 길이더라도 첫 번째가 깔끔하게 될 것이라 생각되어 새로운 필드 `member_fixed` 를 MeetUp 모델에 추가하고, 메서드 수정을 가하기로 했다.

- MeetUp 모델에 member_fixed (BOOL) 필드 추가
- 새 MeetUp 생성시 member_fixed (default false)
- MeetUp 모델 Update시 member_fixed 값 확인하도록 수정 (없으면 에러)
- 맴버 등록 할 때 member_fixed가 true이면 에러 출력
- 맴버 삭제시엔 굳이 그 여부 확인 안해도 될듯

이렇게 비교적 간단히 해결할 문제로 생각했으나 맴버가 변경되는 시점에 따라 자동으로 금액 재조정을 해 주어야 할지 이미 금액을 지불한 인원의 경우엔 상태를 어떻게 처리해야 할지 정책적인 부분을 고려할 필요가 있어서 생각보다 굉장히 복잡한 문제였다.

아마 초기에 기획, 설계 회의를 할 때 이 문제가 도마에 올랐었다가 얼렁뚱땅 미루어진 것 같았는데, 이번 작업에는 결국 수정을 포기하는 쪽으로 가기로 했다.

자잘한 버그를 잡으면서 또 뼈저리게 느낀건데 패러미터로 들어온 타입과(보통 String) 내가 처리하려고 하는 타입(예를 들면 Integer)이 다르면 형변환을 제때제때 해 주어야 하는 것을 잊으면 안되겠다. 자꾸 그런 부분에서 버그가 발생하고 있다.

또 발견된 버그는 총 금액보다 큰 값을 개별 맴버가 입력하려할 때 차단하는 수단이 없다는 점이다. 매번 발견되는 버그들에는 공통점이 있는데, 당장의 기능은 구현이 되어 있는데 유저가 프로그램 내부가 돌아가는 것을 고려하지 않고 자연스럽게 사용하다가 발생할 수 있는 모든 경우의 수를 전혀 고려하지 않고 있다는 점이다.

> 음… 사실 그게 가장 고통스러우면서도 꼭 해야되는 부분입니다.
> 머리에 쥐날때까지 모든 케이스를 다 고려할 수 있는 훈련을 계속해야 고급 개발자가 될 수 있죠.

팀원분이 이런 조언을 해주셨으니 기능 하나를 구현할 때 그로 인해 발생할 수 있는 경우의 수를 최대한 고려해보도록 노력해야겠다.

## MeetUp 상태 열람 (Show)

가격 분배 기능 구현 하면서 MeetUp의 상태를 열람하는 기능이 필요하다는 피드백이 있어 간단하게 구현을 했었다.
그런데 그 정도로는 부족하고 MeetUp이 있으면 관련된 모든 정보를 가져오도록 수정해야할 필요가 있었다.

또한 `paying_sep`, `paying_avg` 로 구분중이었던 지불 방법을 다른 필드로 분리해서 관리해야할 필요성도 발생하였다.

먼저 MeetUp 모델에 `pay_type` 컬럼을 추가하였다. 그리고 이번에는 CodeTable에 굳이 조회용 코드를 추가하지 않았는데, 이렇게 하는게 결국은 의미가 없다고 생각했기 때문이다.
애초에 입력값은 직접 String으로 받고, 검색도 그 String으로 하고, 저장만 id로 하고 있는건데 저장 부분에선 약간 효율적일 수 있겠으나 검색 부분엔 큰 차이가 없어보였기 떄문이다.

`pay_type` 가 추가되면서 적어도 확실한건 MeetUp을 Update 하는 상태는 변경되어야 한다는 점이다. 그리고 status가 `paying` 일 때에는 반드시 `pay_type`가 있도록 만들어야겠다.

```ruby
# meal_meet_up_controller.rb
# ...
    # 해당하는 meetup이 없거나 admin_uid가 불일치, pay_type이 올바르지 않으면 에러
    def check_meetup_update
      meetup = find_meetup
      if meetup.nil?
        render json: { error: 'cannot find meetup' }, status: 400
      elsif meetup.admin.service_uid != meetup_params[:admin_uid].to_s
        render json: { error: 'invalid admin_uid' }, status: 401
      elsif meetup.status.value == 'paying' || meetup_params[:status] == 'paying'
        validate_pay_type
      end
    end

    def validate_pay_type?
      unless %w(n s).include?(meetup_params[:pay_type])
        render_error_400('invalid pay type')
      end
    end
# ...
```

Show로 리턴하는 정보는 기본적으로 update시의 리턴+딸려있는 맴버들의 각종 정보이다. 그래서 먼저 update시의 리턴 정보를 가져온 다음에 필요한 정보를 덧붙이는 형태로 만들었다.

```ruby
# meal_meet_up_helper.rb
# 컨트롤러가 너무 커져서 리턴용 json을 출력하는 메서드들을 다 헬퍼 모듈로 옮겼다.
# ...
  def response_json_show(meetup)
    basic_data = response_json_update(meetup)
    members_info = meetup.meal_meet_up_tasks.map do |task|
      log = task.meal_log
      { member_uid: log.user.service_uid,
        menu: log.menu_name,
        price: log.price,
        status: task.status.value }
    end
    basic_data[:data].merge(members_count: members_info.count,
                            members: members_info)
  end
# ...
```
