import { getHash } from "@Services/jwtService";
import { insertDbUser } from "@Repositories/UsersRepository";
import { PayloadPostUsers, ResponsePostUsers } from "../api/users/post_users";

export const createUsersService = async (
  body: PayloadPostUsers,
): Promise<ResponsePostUsers> => {
  const dbEntity = await insertDbUser({
    username: body.username,
    hash: await getHash(body.password),
  });
  return dbEntity satisfies ResponsePostUsers;
};
