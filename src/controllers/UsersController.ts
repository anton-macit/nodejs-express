import { Request, Response } from "express";
// import { createUserService } from "@Services/UsersService";
// import { PayloadPostUsers, postUsersRequest } from "../api/users/post_users";
import { createUsersService } from "@Services/UsersService";
import { PayloadPostUsers, postUsersRequest } from "../api/users/post_users";

export const createUser = async (req: Request, res: Response) => {
  await postUsersRequest.validate(req.body);
  const user = await createUsersService(req.body as PayloadPostUsers);
  res.json(user);
};
