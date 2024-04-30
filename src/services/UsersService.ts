import { insertDbUser } from "@Repositories/UsersRepository";
import { getHash } from "@Services/jwtService";
import { PayloadPostUsers, ResponsePostUsers } from "../api/users/post_users";

export const createUsersService = async (
  body: PayloadPostUsers,
): Promise<ResponsePostUsers> => {
  const dbEntity = await insertDbUser({
    username: body.username,
    hash: await getHash(body.password),
  });
  const { hash, ...user } = dbEntity;
  return user satisfies ResponsePostUsers;
};
