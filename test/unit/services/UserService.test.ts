import * as userRepository from "@Repositories/UsersRepository";
import { createUsersService } from "@Services/UsersService";

describe("UserService tests", () => {
  beforeEach(() => {
    jest.spyOn(userRepository, "insertDbUser").mockImplementation((body) =>
      Promise.resolve({
        id: "1",
        ...body,
        created_at: new Date(),
      }),
    );
  });

  test("createUsersService", async () =>
    expect(
      await createUsersService({ username: "3", password: "4" }),
    ).toBeDefined());
});
