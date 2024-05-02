import {
  deleteDbTodo,
  getDbTodo,
  insertDbTodo,
  selectDbTodo,
  updateDbTodo,
} from "@Repositories/TodosRepository";
import { PayloadPatchTodos__id__ } from "../api/todos/__id__/patch_todos___id__";
import { PayloadPostTodos, ResponsePostTodos } from "../api/todos/post_todos";
import { ITodo } from "../dbEntities/Todo";

export const getTodoItemService = (id: string): Promise<ITodo | undefined> =>
  getDbTodo(id);

export const updateTodoItemService = (
  id: string,
  body: PayloadPatchTodos__id__,
): Promise<ITodo | undefined> => updateDbTodo(id, body);

export const createTodoItemService = (body: PayloadPostTodos): Promise<ITodo> =>
  insertDbTodo(body);

export const listTodoItemsService = async (
  offset: number,
  limit: number,
): Promise<ResponsePostTodos[]> => {
  const items = await selectDbTodo(offset, limit);
  return items.map((i) => {
    const { _id, ...rest } = i;
    return { ...rest, id: _id.toString() as string };
  });
};

export const deleteTodoItemService = (id: string) => deleteDbTodo(id);
