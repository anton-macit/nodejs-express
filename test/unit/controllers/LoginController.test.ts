import * as controllers from "@Controllers/LoginController";
import * as loginService from "@Services/LoginService";
import { config } from "@Config";
import { randomUUID } from "crypto";
import { mockRequest, mockResponse } from "./MockUnitTest";
import HttpForbidden from "../../../src/exceptions/HttpForbidden";
import { UserDto } from "../../../src/generated/api";

describe("LoginController tests, admin", () => {
  beforeAll(() => {
    // noinspection SpellCheckingInspection
    config.set("jwt.secret", randomUUID());
    const userStub = () =>
      ({
        id: "1",
        username: "1",
        created_at: new Date().toUTCString(),
      }) satisfies UserDto;

    jest
      .spyOn(loginService, "loginAdmin")
      .mockImplementation((body) =>
        body.password === "1"
          ? { ...userStub(), username: body.username }
          : false,
      );
    jest
      .spyOn(loginService, "loginUser")
      .mockImplementation((body) =>
        Promise.resolve(
          body.password === "1"
            ? { ...userStub(), username: body.username }
            : false,
        ),
      );
  });

  test("loginController admin ok", async () => {
    const req = mockRequest();
    req.body.username = config.get("superAdmin.username");
    req.body.password = "1";

    const res = mockResponse();

    await controllers.loginController(req, res);
    expect(res.json).toHaveBeenCalled();
  });
  test("loginController admin error during login", async () => {
    const req = mockRequest();
    req.body.username = config.get("superAdmin.username");
    req.body.password = "2";

    const res = mockResponse();

    await expect(controllers.loginController(req, res)).rejects.toThrow(
      HttpForbidden,
    );
  });
  test("loginController user ok", async () => {
    const req = mockRequest();
    req.body.username = "1";
    req.body.password = "1";

    const res = mockResponse();

    await controllers.loginController(req, res);
    expect(res.json).toHaveBeenCalled();
  });
  test("loginController user error during login", async () => {
    const req = mockRequest();
    req.body.username = "2";
    req.body.password = "2";

    const res = mockResponse();

    await expect(controllers.loginController(req, res)).rejects.toThrow(
      HttpForbidden,
    );
  });
});
