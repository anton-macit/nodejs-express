
set -o xtrace && set -o errexit && set -o nounset

admin_token=$(curl \
  -X POST \
  "http://localhost:8080/login"  \
  --header "Content-type: application/json" \
  --data '{"username":"admin","password":"lrFZl324fdK"}' |
  jq .auth_token | cut -d'"' -f 2)

curl -X POST \
  "http://localhost:8080/users" \
  --header "Authorization: Bearer ${admin_token}" \
  --header "Content-type: application/json" \
  --data '{"username":"user1","password":"user1"}'

user_token=$(curl \
  -X POST \
  "http://localhost:8080/login"  \
  --header "Content-type: application/json" \
  --data '{"username":"user1","password":"user1"}' |
  jq .auth_token | cut -d'"' -f 2)

todos_id=$(curl \
  -X POST \
  "http://localhost:8080/todos" \
  --header "Authorization: Bearer ${user_token}" \
  --header "Content-type: application/json" \
  --data '{"content":"ts-user1","priority":7}' |
  jq .id | cut -d'"' -f 2)

curl \
  -X GET \
  "http://localhost:8080/todos/${todos_id}" \
  --header "Authorization: Bearer ${user_token}" \
  --header "Content-type: application/json"

curl \
  -X PATCH \
  "http://localhost:8080/todos/${todos_id}" \
  --header "Authorization: Bearer ${user_token}" \
  --header "Content-type: application/json" \
  --data '{"content":"ts-user1-updated","priority":8}' &

curl \
  -X PATCH \
  "http://localhost:8080/todos/${todos_id}" \
  --header "Authorization: Bearer ${user_token}" \
  --header "Content-type: application/json" \
  --data '{"content":"ts-user1-2","priority":6}'

curl \
  -X GET \
  "http://localhost:8080/todos/${todos_id}" \
  --header "Authorization: Bearer ${user_token}" \
  --header "Content-type: application/json"
