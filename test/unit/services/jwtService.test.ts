import { randomUUID } from "crypto";
import {
  checkPassword,
  dbUserToUserDto,
  getHash,
  getJwtToken,
  JwtPayload,
  verifyJwtToken,
} from "@Services/jwtService";
import * as jwtService from "@Services/jwtService";
import { config } from "@Config";
import { User } from "../../../src/generated/database";

describe("jwtService tests", () => {
  test("getHash/checkPassword", async () => {
    const password = randomUUID();

    expect(checkPassword(password, await getHash(password))).toBeTruthy();
  });

  test("getJwtToken/verifyJwtToken", () => {
    config.set("jwt.secret", randomUUID());
    const payload: JwtPayload = {
      user: {
        id: randomUUID(),
        username: "username",
        created_at: new Date().toUTCString(),
      },
      signingTimestamp: new Date().toUTCString(),
      expiresIn: "1h",
    };
    const token = getJwtToken(payload);
    const decodedToken = verifyJwtToken(token) as JwtPayload;
    expect(decodedToken.user).toEqual(payload.user);
    expect(decodedToken.signingTimestamp).toEqual(payload.signingTimestamp);
    expect(decodedToken.expiresIn).toEqual(payload.expiresIn);
  });

  test("dbUserToUserDto", () => {
    const dbUser: User = {
      id: randomUUID(),
      hash: "hash",
      username: "username",
      created_at: new Date(),
    };
    const userDto = dbUserToUserDto(dbUser);
    expect(userDto.id).toEqual(dbUser.id);
  });
});
