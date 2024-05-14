## About the project

This project gives multi-users CRUD API for to-do items.
The super-admin uses an endpoint to create users. Regular users manage their to-do items via other endpoints.

This project intends to show:
- using IaC to create infrastructure
- migration procedure for an SQL database
- having input validation and types for input type on the back-end side
- generated types by SQL tables
- way of exception processing
- logging approach
- application code layers
- context for every call
- show deployed git commit on the `/status` endpoint

Other, not so important, sides of this project:
- using UUID as ID for entities
- 100% test coverage for controllers and services
- JWT
- ORM version (instead of raw SQL) is on its way
- The NoSQL (MongoDB) version is on its way

## About directories and some files here

- `api` [Swagger api specification](api/index.html)
- `coverage` Coverage report
- `infr` Terraform plans to create AWS Lambda 
- `logs` To save logs on local environment
- `migrations` SQL DB migrations. To apply run `yarn migrate:up`
- `src` Source code. See [src/README.md](src/README.md)
- `test` Unit tests
- `.env.example` List of needed environment variables
- `.yarnrc` To lock packages versions in `yarn.lock`. To update `yarn.lock` run `mv .yarnrc .yarnrc- ; yarn ; mv .yarnrc- .yarnrc`

## To initialize Terraform:
```shell
AWS_PROFILE=todo-nodejs-express terraform -chdir=infr init
```

## Deploy:

```shell
yarn clean && \
  echo export const gitCommitHash=\"$(git rev-parse --short HEAD)$([[ -n "$(git status -s | grep -v infr/terraform.tfstate)" ]] && echo -dirty)\" > ./src/utils/gitCommitHash.ts && \
  yarn build && \
  yarn package-deps && \
  AWS_PROFILE=todo-nodejs-express terraform -chdir=infr plan # or apply immediately
  
AWS_PROFILE=todo-nodejs-express terraform -chdir=infr apply -auto-approve
```

Don't forget to fill settings secret in secrets manager 