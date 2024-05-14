import { Request, Response } from "express";
import { getJwtToken, UserDto } from "@Services/jwtService";
import { config } from "@Config";
import { loginAdmin, loginUser } from "@Services/LoginService";
import { log } from "@Log";
import { PayloadPostLogin, postLoginRequest } from "../api/post_login";
import HttpForbidden from "../exceptions/HttpForbidden";

export const loginController = async (req: Request, res: Response) => {
  await postLoginRequest.validate(req.body);
  const body = req.body as PayloadPostLogin;
  let user: UserDto | boolean | undefined;
  if (body.username === config.get("superAdmin.username")) {
    user = loginAdmin(body);
  } else {
    user = await loginUser(body);
  }
  log.debug(`user`, user);
  if (!user) {
    throw new HttpForbidden(
      "User does not exist with the provided credentials",
    );
  }
  const expiresIn = config.get("jwt.expiresIn");
  const token = getJwtToken({
    user,
    signingTimestamp: new Date(),
    expiresIn,
  });

  res.json({ auth_token: token });
};
