import { Request, Response } from "express";
import {
  checkPassword,
  dbUserToUserDto,
  getJwtToken,
  UserDto,
} from "@Services/jwtService";
import { config } from "@Config";
import { selectDbUser } from "@Repositories/UsersRepository";
import { PayloadPostLogin, postLoginRequest } from "../api/post_login";
import HttpForbidden from "../errors/HttpForbidden";

const adminId = "2223f3bc-a6fd-4432-a44b-fb02eaad982c";

export const loginController = async (req: Request, res: Response) => {
  await postLoginRequest.validate(req.body);
  const body = req.body as PayloadPostLogin;
  let user: UserDto | undefined;
  const forbiddenMessage = "User does not exist with the provided credentials";
  if (body.username === config.get("superAdmin.username")) {
    if (config.get("superAdmin.password") === "") {
      throw new HttpForbidden("Configured empty super admin password");
    }
    if (body.password !== config.get("superAdmin.password")) {
      throw new HttpForbidden(forbiddenMessage);
    }

    user = {
      id: adminId,
      username: body.username,
      created_at: new Date(),
      updated_at: new Date(),
      __v: 0,
    } satisfies UserDto;
  } else {
    const dbUser = await selectDbUser(body.username);
    if (!dbUser) {
      throw new HttpForbidden(forbiddenMessage);
    }
    if (!checkPassword(body.password, dbUser.hash)) {
      throw new HttpForbidden(forbiddenMessage);
    }
    user = dbUserToUserDto(dbUser);
  }
  const expiresIn = config.get("jwt.expiresIn");
  const token = getJwtToken({
    user,
    signingTimestamp: new Date(),
    expiresIn,
  });

  res.json({ auth_token: token });
};
