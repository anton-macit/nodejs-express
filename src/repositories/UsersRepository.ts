import { query } from "./__query";
import { User } from "../generated/database";

export const insertDbUser = async (
  body: Omit<User, "id" | "created_at">,
): Promise<User> =>
  (
    await query(
      'insert into "user"(username, hash) values($1, $2) returning *',
      [body.username, body.hash],
    )
  ).rows[0];

export const getDbUser = async (username: string): Promise<User | undefined> =>
  (await query('select * from "user" where username = $1', [username])).rows[0];
