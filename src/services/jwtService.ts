import { config } from "@Config";
import * as jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserDto } from "../generated/api";
import { UserModel } from "../models/userModel";

export const dbUserToUserDto = (dbUser: UserModel): UserDto =>
  ({
    id: dbUser.id,
    username: dbUser.username,
    created_at: String(dbUser.createdAt),
  }) satisfies UserDto;

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
