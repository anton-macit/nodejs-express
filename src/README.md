# About directory content

- `api`, Typescript **Yup** input declarations and real types for responses.
  This directory is a kind of duplicate of [../api/swagger.yaml](../api/swagger.yaml). Swagger
  cannot have types UUID or Date, for example. This folder could be reused on the front-end side.
  Also see [api/README.md](api/README.md)
- `asyncContext` - context for every call to trace requests
- `config` - convict configs
- `controllers` - all controllers
- `controllers/StatusController.ts` - a status and test controller. A fake exception can appear, and we can check how it will be processed.
- `errors` - login exceptions
- `generated/api` - generated types from Swagger. To update, run `yarn api-to-ts`.
- `generated/database.ts` - generated DB types from SQL. To generate it, run `DATABASE_URL=.... yarn pg-to-ts`
- `log` - about logging
- `middlewares` - middlewares to have traceId
- `repositories` - repository functionality
- `router` - Express routes
- `services` - services functionality
- `utils` - utils functionality

TODO:
- add ORM
