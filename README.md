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
  yarn build && \
  yarn package-deps && \
  AWS_PROFILE=todo-nodejs-express terraform -chdir=infr plan # or apply immediately
  
AWS_PROFILE=todo-nodejs-express terraform -chdir=infr apply -auto-approve
```

Don't forget to fill settings secret in secrets manager 