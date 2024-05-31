import { getAsyncContext } from "@Async";
import { LoginPasswordDto, UserDto } from "../generated/api";
import { UserModel } from "../models/userModel";

export const insertDbUser = async (
  body: Omit<LoginPasswordDto, "password"> & { hash: string },
): Promise<UserDto> => {
  const userModel = await UserModel.create(
    {
      username: body.username,
      hash: body.hash,
    },
    getAsyncContext().getTransaction(),
  );
  return {
    id: userModel.id,
    username: userModel.username,
    created_at: String(userModel.createdAt),
  };
};

export const getDbUser = (username: string): Promise<UserModel | null> =>
  UserModel.findOne({
    where: { username },
    ...getAsyncContext().getTransaction(),
  });
