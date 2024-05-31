import {
  deleteDbTodo,
  getDbTodo,
  insertDbTodo,
  selectDbTodo,
  updateDbTodo,
} from "@Repositories/TodosRepository";
import { PayloadPatchTodos__id__ } from "../api/todos/__id__/patch_todos___id__";
import { PayloadPostTodos } from "../api/todos/post_todos";
import { TodoModel } from "../models/todoModel";

export const getTodoItemService = (id: string): Promise<TodoModel | null> =>
  getDbTodo(id);

export const updateTodoItemService = (
  id: string,
  body: PayloadPatchTodos__id__,
): Promise<TodoModel | null> => updateDbTodo(id, body);

export const createTodoItemService = (
  body: PayloadPostTodos,
): Promise<TodoModel | null> => insertDbTodo(body);

export const listTodoItemsService = (
  offset: number,
  limit: number,
): Promise<TodoModel[]> => selectDbTodo(offset, limit);

export const deleteTodoItemService = (id: string) => deleteDbTodo(id);
