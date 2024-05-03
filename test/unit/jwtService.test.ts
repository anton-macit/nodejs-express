import { randomUUID } from "crypto";
import {
  checkPassword,
  dbUserToUserDto,
  getHash,
  getJwtToken,
  JwtPayload,
  verifyJwtToken,
} from "@Services/jwtService";
import mongoose from "mongoose";
import { IUser } from "../../src/dbEntities/User";

describe("jwtService tests", () => {
  test("getHash/checkPassword", async () => {
    const password = randomUUID();

    expect(checkPassword(password, await getHash(password))).toBeTruthy();
  });

  test("getJwtToken/verifyJwtToken", () => {
    const payload: JwtPayload = {
      user: {
        id: randomUUID().toString(),
        username: "username",
        created_at: new Date().toUTCString(),
        updated_at: new Date().toUTCString(),
        __v: 0,
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
    const dbUser: IUser = {
      _id: new mongoose.Types.ObjectId(),
      hash: "hash",
      username: "username",
      created_at: new Date(),
      updated_at: new Date(),
      __v: 0,
    };
    const userDto = dbUserToUserDto(dbUser);
    expect(userDto.id).toEqual(dbUser._id.toString());
  });
});
