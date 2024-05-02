import * as yup from "yup";

export const RoutePostUsers = "/users";

export const postUsersRequest = yup.object({
  username: yup.string().required(),
  password: yup.string().required(),
});

export interface PayloadPostUsers
  extends yup.InferType<typeof postUsersRequest> {}

export interface ResponsePostUsers extends Omit<PayloadPostUsers, "password"> {
  id: string; // uuid v4
  created_at: string | Date; // date
  updated_at: string | Date; // date
  __v: number;
}
