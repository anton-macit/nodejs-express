import { insertDbUser } from "@Repositories/UsersRepository";
import { PayloadPostUsers, ResponsePostUsers } from "../api/users/post_users";

export const createUsersService = async (
  body: PayloadPostUsers,
): Promise<ResponsePostUsers> => {
  const { _id, hash, ...rest } = await insertDbUser(body);
  return { id: _id.toString(), ...rest };
};
