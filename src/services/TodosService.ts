import {
  deleteDbTodo,
  getDbTodo,
  insertDbTodo,
  selectDbTodo,
  updateDbTodo,
} from "@Repositories/TodosRepository";
import { Todo } from "../generated/database";
import { PayloadPatchTodos__id__ } from "../api/todos/__id__/patch_todos___id__";
import { PayloadPostTodos } from "../api/todos/post_todos";

export const getTodoItemService = (id: string): Promise<Todo | undefined> =>
  getDbTodo(id);

export const updateTodoItemService = (
  id: string,
  body: PayloadPatchTodos__id__,
): Promise<Todo | undefined> => updateDbTodo(id, body);

export const createTodoItemService = (body: PayloadPostTodos): Promise<Todo> =>
  insertDbTodo(body);

export const listTodoItemsService = (
  offset: number,
  limit: number,
): Promise<Todo[]> => selectDbTodo(offset, limit);

export const deleteTodoItemService = (id: string) => deleteDbTodo(id);
