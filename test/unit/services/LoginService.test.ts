import { config } from "@Config";
import { randomUUID } from "crypto";
import * as service from "@Services/LoginService";
import * as usersRepository from "@Repositories/UsersRepository";
import { User } from "../../../src/generated/database";

describe("Login service tests, admin", () => {
  beforeEach(() => {
    config.set("superAdmin.password", randomUUID());
  });

  test("loginAdmin ok", () => {
    expect(
      service.loginAdmin({
        username: config.get("superAdmin.username"),
        password: config.get("superAdmin.password"),
      }),
    ).toBeTruthy();
  });

  test("loginAdmin wrong password", () => {
    expect(
      service.loginAdmin({
        username: config.get("superAdmin.username"),
        password: "",
      }),
    ).toBeFalsy();
  });

  test("loginAdmin empty configured password", () => {
    config.set("superAdmin.password", "");
    expect(
      service.loginAdmin({
        username: config.get("superAdmin.username"),
        password: "",
      }),
    ).toBeFalsy();
  });
});

describe("Login service tests, user", () => {
  beforeAll(() => {
    // noinspection SpellCheckingInspection
    const userStub = () =>
      ({
        id: "1",
        username: "1",
        hash: "$2a$10$d/4JfSCzBzwEi84maF.8gOTZyO3Bgqx87IQwMzvfTJqukHxL2L8DK", // 123
        created_at: new Date(),
      }) satisfies User;

    jest
      .spyOn(usersRepository, "getDbUser")
      .mockImplementation((username) =>
        Promise.resolve(username === "1" ? userStub() : undefined),
      );
  });

  test("loginUser ok", async () => {
    expect(
      await service.loginUser({
        username: "1",
        password: "123",
      }),
    ).toBeTruthy();
  });

  test("loginUser wrong username", async () => {
    expect(
      await service.loginUser({
        username: "",
        password: "123",
      }),
    ).toBeFalsy();
  });

  test("loginUser wrong password", async () => {
    expect(
      await service.loginUser({
        username: "1",
        password: "",
      }),
    ).toBeFalsy();
  });
});
