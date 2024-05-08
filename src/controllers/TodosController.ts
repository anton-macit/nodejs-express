import { Request, Response } from "express";
import {
  createTodoItemService,
  listTodoItemsService,
} from "@Services/TodosService";
import { paramsGetTodos, ResponseGetTodos } from "../api/todos/get_todos";
import {
  PayloadPostTodos,
  postTodosCreateRequest,
} from "../api/todos/post_todos";

export const createTodoItem = async (req: Request, res: Response) => {
  await postTodosCreateRequest.validate(req.body);
  const response = await createTodoItemService(req.body as PayloadPostTodos);
  res.json(response);
};

export const listTodosItems = async (req: Request, res: Response) => {
  const params = await paramsGetTodos.validate({
    offset: req.params.offset,
    limit: req.params.limit,
  });
  const offset = Number(params.offset ?? 0);
  const limit = Number(params.limit ?? 10);
  const items = await listTodoItemsService(offset, limit);

  res.json({ items, offset, limit } satisfies ResponseGetTodos);
};
