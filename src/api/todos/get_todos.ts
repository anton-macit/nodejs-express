// noinspection JSUnusedGlobalSymbols

import * as yup from "yup";
import { ResponsePostTodos } from "./post_todos";

export const RouteGetTodos = "/todos";

export const paramsGetTodos = yup.object({
  offset: yup.number().optional(),
  limit: yup.number().optional(),
});

export interface ParamsGetTodos extends yup.InferType<typeof paramsGetTodos> {}

export interface ResponseGetTodos {
  items: ResponsePostTodos[];
  offset?: number;
  limit?: number;
}
