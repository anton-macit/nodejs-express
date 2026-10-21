# Todo API: Node.js, Express and TypeScript on AWS Lambda

[![CI](https://github.com/anton-macit/nodejs-express/actions/workflows/ci.yml/badge.svg)](https://github.com/anton-macit/nodejs-express/actions/workflows/ci.yml)
![Coverage: 100% of controllers and services](https://img.shields.io/badge/coverage-100%25%20controllers%20%26%20services-brightgreen)
![Node.js 20](https://img.shields.io/badge/node-20-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)

A multi-user REST API for to-do items. The super-admin creates users; regular users
manage their own to-do items. The service runs as an Express app locally and as an
AWS Lambda function in the cloud, with the infrastructure described in Terraform.

## Highlights

- **Infrastructure as Code**: Terraform provisions the Lambda function and its URL, a
  Lambda layer for dependencies, the IAM role and policy, and a Secrets Manager secret.
- **SQL migrations** with node-pg-migrate; TypeScript types for tables are generated
  from the database schema with pg-to-ts.
- **Contract-first API**: an OpenAPI 3 specification, TypeScript types generated from
  it, and Redoc HTML documentation.
- **Input validation** with Yup and typed request and response declarations for every endpoint.
- **Layered architecture**: router → controllers → services → repositories.
- **Centralized error handling** with custom HTTP exceptions.
- **Structured logging** with Winston and a correlation ID for every request, kept in an
  `AsyncLocalStorage` context.
- **Authentication** with JWT and bcrypt-hashed passwords; super-admin and user roles.
- **100% unit-test coverage** of controllers and services, enforced by a Jest coverage
  threshold, a Husky pre-commit hook and CI.
- UUIDs as entity IDs; the `/status` endpoint reports the deployed git commit.

## Tech stack

| Area           | Tools                                                       |
| -------------- | ----------------------------------------------------------- |
| Runtime        | Node.js 20, TypeScript 5                                    |
| Web            | Express 4, serverless-http                                  |
| Database       | PostgreSQL (`pg`, raw SQL), node-pg-migrate, pg-to-ts       |
| Validation     | Yup                                                         |
| Auth           | jsonwebtoken, bcryptjs                                      |
| Configuration  | convict, dotenv, AWS Secrets Manager                        |
| Logging        | Winston, morgan                                             |
| API docs       | OpenAPI 3, Redocly, openapi-typescript-codegen              |
| Testing        | Jest, ts-jest                                               |
| Code quality   | ESLint (Airbnb), Prettier, Husky, GitHub Actions            |
| Infrastructure | AWS Lambda, Lambda Function URL, Secrets Manager, Terraform |

## Quick start

Requirements: Node.js 20+, Yarn 1.x and Docker (or any PostgreSQL instance).

```shell
# 1. Start PostgreSQL
docker run -d --name todo-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=todo -p 5432:5432 postgres:16-alpine

# 2. Install dependencies
yarn install --frozen-lockfile

# 3. Configure environment variables
cat > .env <<'EOF'
DB_CONNECTION_STRING=postgres://postgres:postgres@localhost:5432/todo
SUPER_ADMIN_USERNAME=admin
SUPER_ADMIN_PASSWORD=change-me
JWT_SECRET=local-jwt-secret
EOF
set -a && source .env && set +a

# 4. Apply migrations, build and start the server on http://localhost:8080
yarn migrate:up
yarn build && yarn start
```

Try the API from another terminal:

```shell
# Log in as the super-admin and create a user
ADMIN_TOKEN=$(curl -s -X POST localhost:8080/login -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"change-me"}' | jq -r .auth_token)
curl -X POST localhost:8080/users -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H 'Content-Type: application/json' -d '{"username":"alice","password":"alice-password"}'

# Log in as the user and create a to-do item
TOKEN=$(curl -s -X POST localhost:8080/login -H 'Content-Type: application/json' \
  -d '{"username":"alice","password":"alice-password"}' | jq -r .auth_token)
curl -X POST localhost:8080/todos -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' -d '{"content":"Write the README","priority":1}'
curl localhost:8080/todos -H "Authorization: Bearer $TOKEN"
```

The full API is described in [api/swagger.yaml](api/swagger.yaml). Open `api/index.html`
in a browser for the rendered documentation, or regenerate it with `yarn api-to-html`.

## Tests and code quality

```shell
yarn test   # unit tests; fails if coverage of controllers and services drops below 100%
yarn lint   # ESLint with autofix
yarn format # Prettier
```

The pre-commit hook runs `yarn test`. CI runs lint, the TypeScript build and the tests
on every push and pull request.

## Project structure

- `api`: OpenAPI specification and the generated Redoc page
- `infr`: Terraform configuration for AWS
- `migrations`: SQL migrations, applied with `yarn migrate:up`
- `src`: source code; see [src/README.md](src/README.md)
- `test`: unit tests
- `.env.example`: environment variables the app reads
- `.yarnrc`: locks package versions in `yarn.lock`. To update `yarn.lock`, run
  `mv .yarnrc .yarnrc- ; yarn ; mv .yarnrc- .yarnrc`

## Deployment to AWS

The app is deployed as a Lambda function with a public Function URL. Sensitive settings
(`dbConnectionString`, `jwtSecret`, `superAdminUsername`, `superAdminPassword`) are read
at runtime from the `settings` secret in AWS Secrets Manager. Terraform creates the
secret with empty values, so fill in the real values in AWS after the first `apply`.

Initialize Terraform once:

```shell
AWS_PROFILE=todo-nodejs-express terraform -chdir=infr init
```

Commit, build and deploy. The deployed commit hash is baked into the build and shown on `/status`:

```shell
git checkout ./src/utils/gitCommitHash.ts && \
  git add . && \
  git commit && \
  yarn clean && \
  echo export const gitCommitHash=\"$(git rev-parse --short HEAD)$([[ -n "$(git status --porcelain)" ]] && echo -dirty)\" > ./src/utils/gitCommitHash.ts && \
  yarn build && \
  yarn package-deps && \
  AWS_PROFILE=todo-nodejs-express terraform -chdir=infr plan # or apply immediately

AWS_PROFILE=todo-nodejs-express terraform -chdir=infr apply -auto-approve
```

Terraform state is not committed to the repository (see `.gitignore`).

## Alternative implementations

- [`sequelize-postgresql`](https://github.com/anton-macit/nodejs-express/tree/sequelize-postgresql):
  the same API with the Sequelize ORM instead of raw SQL.
- [`mongodb`](https://github.com/anton-macit/nodejs-express/tree/mongodb): an early
  MongoDB (Mongoose) version, based on an older state of `main`.
