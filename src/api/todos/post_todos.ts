import * as yup from "yup";

export const RoutePostTodos = "/todos";

export const postTodosCreateRequest = yup.object({
  content: yup.string().required(),
  priority: yup.number().required(),
});

export interface PayloadPostTodosCreateRequest
  extends yup.InferType<typeof postTodosCreateRequest> {}

export interface ITodoItem extends PayloadPostTodosCreateRequest {
  id: string; // uuid v4
  created_at: string | Date; // date
}
