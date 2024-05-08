import { getDbUser } from "@Repositories/UsersRepository";
import { log } from "@Log";
import { PayloadPostLogin } from "../api/post_login";
import { config } from "../config";
import { checkPassword, dbUserToUserDto, UserDto } from "./jwtService";

const adminId = "2223f3bc-a6fd-4432-a44b-fb02eaad982c";

export const loginAdmin = (body: PayloadPostLogin): false | UserDto => {
  log.debug(`loginAdmin`);
  if (config.get("superAdmin.password") === "") {
    log.error("Configured empty super admin password");
    return false;
  }
  if (body.password !== config.get("superAdmin.password")) {
    return false;
  }

  const user = {
    id: adminId,
    username: body.username,
    created_at: new Date(),
  } satisfies UserDto;
  return user;
};

export const loginUser = async (
  body: PayloadPostLogin,
): Promise<false | UserDto> => {
  log.debug(`loginUser`);
  const dbUser = await getDbUser(body.username);
  if (!dbUser) {
    return false;
  }
  if (!(await checkPassword(body.password, dbUser.hash))) {
    return false;
  }
  return dbUserToUserDto(dbUser);
};
