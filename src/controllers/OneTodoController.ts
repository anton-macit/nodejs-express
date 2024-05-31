import { Request, Response } from "express";
import {
  deleteTodoItemService,
  getTodoItemService,
  updateTodoItemService,
} from "@Services/TodosService";
import { log } from "@Log";
import {
  patchTodosCreateRequest,
  PayloadPatchTodos__id__,
} from "../api/todos/__id__/patch_todos___id__";

export const updateTodoItem = async (req: Request, res: Response) => {
  await patchTodosCreateRequest.validate(req.body);
  const response = await updateTodoItemService(
    req.params.id,
    req.body as PayloadPatchTodos__id__,
  );
  if (!response) {
    res.status(404);
  }

  res.json(response);
};

export const getTodoItem = async (req: Request, res: Response) => {
  const response = await getTodoItemService(req.params.id);
  if (!response) {
    res.status(404);
  }
  log.debug(`response?.dataValues`, response?.dataValues);
  log.debug(`response?.userId`, response?.userId);
  res.json(response);
};

export const deleteTodoItem = async (req: Request, res: Response) => {
  const response = await deleteTodoItemService(req.params.id);
  if (!response) {
    res.status(404);
  }
  res.json(response);
};
