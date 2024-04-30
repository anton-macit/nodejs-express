import * as yup from "yup";

export const RoutePostLogin = "/login";

export const postLoginRequest = yup.object({
  username: yup.string().required(),
  password: yup.string().required(),
});

export interface PayloadPostLogin
  extends yup.InferType<typeof postLoginRequest> {}
