// import { log } from "@Log";
import { query } from "./__query";
import { Todo } from "../generated/database";
import { PayloadPatchTodos__id__ } from "../api/todos/__id__/patch_todos___id__";
import { PayloadPostTodosCreateRequest } from "../api/todos/post_todos";

export const getDbTodo = async (id: string): Promise<Todo | undefined> =>
  (await query("select * from todo where id = $1", [id])).rows[0];

export const updateDbTodo = async (
  id: string,
  body: PayloadPatchTodos__id__,
): Promise<Todo | undefined> =>
  ((
    await query(
      "update todo set content = COALESCE($2, content), priority = COALESCE($3, priority) where id = $1 returning *",
      [id, body.content, body.priority],
    )
  ).rows[0] as Todo) ?? undefined;

export const insertDbTodo = async (
  body: PayloadPostTodosCreateRequest,
): Promise<Todo> =>
  (
    await query(
      "insert into todo(content, priority) values($1, $2) returning *",
      [body.content, body.priority],
    )
  ).rows[0];

export const selectDbTodo = async (
  offset: number,
  limit: number,
): Promise<Todo[]> =>
  (
    await query("select * from todo order by created_at offset $1 limit $2", [
      offset,
      limit,
    ])
  ).rows;

export const deleteDbTodo = async (id: string): Promise<number | null> =>
  (await query("delete from todo where id = $1", [id])).rowCount;
