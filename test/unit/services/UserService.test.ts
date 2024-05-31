import { createUsersService } from "@Services/UsersService";
import * as userRepository from "../../../src/repositories/UsersRepository";
import { UserDto } from "../../../src/generated/api";

describe("UserService tests", () => {
  beforeEach(() => {
    jest.spyOn(userRepository, "insertDbUser").mockImplementation((body) =>
      Promise.resolve({
        id: "1",
        ...body,
        created_at: new Date().toUTCString(),
      } as UserDto),
    );
  });

  test("createUsersService", async () =>
    expect(
      await createUsersService({ username: "3", password: "4" }),
    ).toBeDefined());
});
