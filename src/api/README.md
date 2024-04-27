## Instruction for the folder

TypeScript files with endpoints declaration.

For example, there is the file `todos/get_todos.ts`.
This file concerns the `todos/` BE endpoint, GET method.
Note that the endpoint URI, the file path, and the file name are the same.

In every file, the first definitions should be:

- Declaration about endpoint URI. The name should start with `Route`.
- Declaration about endpoint request params. The name should start with `Params`.
- Declaration about endpoint request body. The name should start with `Payload`.
- Declaration about endpoint response body. The name should start with `Response`.

Also:

- Please place the definitions for `Route`, `Params`, `Payload`, and `Response` in order.
- If some definition is not needed, skip this one.
- Other types might also be needed to define API types. It matters not so much.
