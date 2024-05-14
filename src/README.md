# About directory content

- `api`, Typescript **Yup** input declarations and real types for responses.
  This directory is a kind of duplicate of [../api/swagger.yaml](../api/swagger.yaml). Swagger
  cannot have types UUID or Date, for example. This folder could be reused on the front-end side.
  Also see [api/README.md](api/README.md)
- `asyncContext` - context for every call to trace requests
- `config` - convict configs
- `controllers` - the 1rd tier of application
- `controllers/StatusController.ts` - a status and test controller. A fake exception can appear, and we can check how it will be processed.
- `exceptions` - custom exceptions
- `generated/api` - generated types from Swagger. To update, run `yarn api-to-ts`.
- `generated/database.ts` - generated DB types from SQL. To generate it, run `DATABASE_URL=.... yarn pg-to-ts`
- `log` - about logging
- `middlewares` - middlewares
- `repositories` - the 3rd tier of application
- `router` - Express routes
- `services` - the 2nd tier of application
- `utils` - helpers and so on
