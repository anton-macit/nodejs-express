import { getHash } from "@Services/jwtService";
import { IUser, User } from "../dbEntities/User";
import { PayloadPostUsers } from "../api/users/post_users";

export const insertDbUser = async (body: PayloadPostUsers): Promise<IUser> => {
  const user = await new User({
    username: body.username,
    hash: await getHash(body.password),
  }).save({ validateBeforeSave: true });
  return user.toObject();
};

export const selectDbUser = async (
  username: string,
): Promise<IUser | undefined> => (await User.findOne({ username }))?.toObject();
