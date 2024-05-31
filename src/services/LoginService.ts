import { log } from "@Log";
import { config } from "@Config";
import { getDbUser } from "@Repositories/UsersRepository";
import { PayloadPostLogin } from "../api/post_login";
import { checkPassword, dbUserToUserDto } from "./jwtService";
import { UserDto } from "../generated/api";

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

  return {
    id: adminId,
    username: body.username,
    created_at: String(new Date()),
  } satisfies UserDto;
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
