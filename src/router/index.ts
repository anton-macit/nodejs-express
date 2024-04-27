import { Router } from "express";
import { statusController } from "../controllers/StatusController";
import {
  updateTodoItem,
  getTodoItem,
  deleteTodoItem,
} from "../controllers/OneTodoController";
import { createTodoItem, listTodosItems } from "../controllers/TodosController";
import { RoutePatchTodos__id__ } from "../api/todos/__id__/patch_todos___id__";
import { RoutePostTodos } from "../api/todos/post_todos";
import { RouteGetTodos } from "../api/todos/get_todos";
import { RouteDeleteTodos__id__ } from "../api/todos/__id__/delete_todos___id__";
import { RouteGetTodos__id__ } from "../api/todos/__id__/get_todos___id__";

export const router = Router();

router.get("/status", statusController);

router.get(RouteGetTodos, listTodosItems);
router.post(RoutePostTodos, createTodoItem);

router.patch(RoutePatchTodos__id__, updateTodoItem);
router.get(RouteGetTodos__id__, getTodoItem);
router.delete(RouteDeleteTodos__id__, deleteTodoItem);
