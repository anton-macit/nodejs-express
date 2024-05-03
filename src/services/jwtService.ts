import { config } from "@Config";
import * as jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../generated/database";

export type UserDto = Omit<User, "hash" | "created_at"> & {
  created_at: Date | string;
};

export const dbUserToUserDto = (dbUser: User): UserDto => {
  const { hash, ...user } = dbUser;
  return user satisfies UserDto;
};

export interface JwtPayload {
  user: UserDto;
  signingTimestamp: Date | string;
  expiresIn: string;
}

export const getJwtToken = (data: JwtPayload) => {
  const jwtSecret = config.get("jwt.secret");
  return jwt.sign(data, jwtSecret, {
    expiresIn: data.expiresIn,
  });
};

export const verifyJwtToken = (token: string) =>
  jwt.verify(token, config.get("jwt.secret"));

export const checkPassword = (password: string, hash: string) =>
  bcrypt.compare(password, hash);

export const getHash = (password: string) => bcrypt.hash(password, 10);
