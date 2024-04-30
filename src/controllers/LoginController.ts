import { Request, Response } from "express";
import {
  checkPassword,
  dbUserToUserDto,
  getJwtToken,
  UserDto,
} from "@Services/jwtService";
import { config } from "@Config";
import { randomUUID } from "crypto";
import { selectDbUser } from "@Repositories/UsersRepository";
import { PayloadPostLogin, postLoginRequest } from "../api/post_login";
import LoginError from "../errors/LoginError";

export const loginController = async (req: Request, res: Response) => {
  await postLoginRequest.validate(req.body);
  const body = req.body as PayloadPostLogin;
  let user: UserDto | undefined;
  if (body.username === config.get("superAdmin.username")) {
    if (config.get("superAdmin.password") === "") {
      throw new Error("Empty super admin password");
    }
    if (body.password !== config.get("superAdmin.password")) {
      throw new Error("Wrong super admin password");
    }

    user = {
      id: randomUUID(),
      username: body.username,
      created_at: new Date(),
    } satisfies UserDto;
  } else {
    const dbUser = await selectDbUser(body.username);
    if (!dbUser) {
      throw new LoginError();
    }
    if (!(await checkPassword(body.password, dbUser.hash))) {
      throw new LoginError();
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
