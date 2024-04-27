/* eslint-disable @typescript-eslint/naming-convention */
// noinspection JSUnusedGlobalSymbols

import * as yup from "yup";
import { ITodoItem } from "../post_todos";

export const RoutePatchTodos__id__ = "/todos/:id";

export const patchTodosCreateRequest = yup.object({
  content: yup.string().optional(),
  priority: yup.number().optional(),
});

export interface PayloadPatchTodos__id__
  extends yup.InferType<typeof patchTodosCreateRequest> {}

export type ResponsePatchTodos__id__ = ITodoItem;
