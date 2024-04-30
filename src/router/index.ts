import { Router } from "express";
import { statusController } from "../controllers/StatusController";
import {
  updateTodoItem,
  getTodoItem,
  deleteTodoItem,
} from "../controllers/OneTodoController";
import { createTodoItem, listTodosItems } from "../controllers/TodosController";
import { createUser } from "../controllers/UsersController";
import { RoutePatchTodos__id__ } from "../api/todos/__id__/patch_todos___id__";
import { RoutePostTodos } from "../api/todos/post_todos";
import { RouteGetTodos } from "../api/todos/get_todos";
import { RouteDeleteTodos__id__ } from "../api/todos/__id__/delete_todos___id__";
import { RouteGetTodos__id__ } from "../api/todos/__id__/get_todos___id__";
import { RoutePostUsers } from "../api/users/post_users";
import { RoutePostLogin } from "../api/post_login";
import { adminOnly, userOnly } from "../middlewares/authUser";
import { loginController } from "../controllers/LoginController";

const asyncHandler = require("express-async-handler");

export const router = Router();

router.get("/status", asyncHandler(statusController));
router.post(RoutePostLogin, asyncHandler(loginController));

router.get(RouteGetTodos, userOnly, asyncHandler(listTodosItems));
router.post(RoutePostTodos, userOnly, asyncHandler(createTodoItem));

router.patch(RoutePatchTodos__id__, userOnly, asyncHandler(updateTodoItem));
router.get(RouteGetTodos__id__, userOnly, asyncHandler(getTodoItem));
router.delete(RouteDeleteTodos__id__, userOnly, asyncHandler(deleteTodoItem));

router.post(RoutePostUsers, adminOnly, asyncHandler(createUser));
