import * as userRepository from "@Repositories/UsersRepository";
import { createUsersService } from "@Services/UsersService";
import mongoose from "mongoose";
import { IUser } from "../../src/dbEntities/User";

describe("UserService tests", () => {
  beforeEach(() => {
    jest.spyOn(userRepository, "insertDbUser").mockImplementation((body) =>
      Promise.resolve({
        _id: new mongoose.Types.ObjectId(),
        ...body,
        created_at: new Date(),
        updated_at: new Date(),
        hash: "hash",
        __v: 0,
      } satisfies IUser),
    );
  });

  test("createUsersService", async () =>
    expect(
      await createUsersService({ username: "3", password: "4" }),
    ).toBeDefined());
});
