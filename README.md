# About directories and some files here

- `api` [Swagger api specification](api/index.html)
- `coverage` Coverage report
- `infr` Terraform plans to create AWS Lambda 
- `logs` To save logs on local environment
- `migrations` SQL DB migrations. To apply run `DATABASE_URL=.... yarn node-pg-migrate up`
- `src` Source code. See [src/README.md](src/README.md)
- `test` Unit tests
- `.env.example` List of needed environment variables
- `.yarnrc` To lock packages versions in `yarn.lock`. To update `yarn.lock` run `mv .yarnrc .yarnrc- ; yarn ; mv .yarnrc- .yarnrc`

TODO:
- test coverage should be increased (jwtService and Controllers)
- deploy to AWS should be added
