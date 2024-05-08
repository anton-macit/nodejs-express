import * as controllers from "@Controllers/UsersController";
import * as userService from "@Services/UsersService";
import { ValidationError } from "yup";
import { mockRequest, mockResponse } from "./MockUnitTest";

describe("UserController tests", () => {
  beforeAll(() => {
    jest
      .spyOn(userService, "createUsersService")
      .mockImplementation((body) =>
        Promise.resolve({ username: body.username, id: "1", created_at: "2" }),
      );
  });

  test("UserController, valid request", async () => {
    const req = mockRequest();
    req.body.username = "1";
    req.body.password = "2";

    const res = mockResponse();

    await controllers.createUser(req, res);
    expect(res.json).toHaveBeenCalled();
  });

  test("UserController, invalid request", async () => {
    const req = mockRequest();
    req.body = {};

    const res = mockResponse();

    await expect(controllers.createUser(req, res)).rejects.toThrow(
      ValidationError,
    );
    expect(res.json).not.toHaveBeenCalled();
  });
});
