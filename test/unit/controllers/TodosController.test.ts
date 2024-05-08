import * as controllers from "@Controllers/TodosController";
import * as todoService from "@Services/TodosService";
import { ValidationError } from "yup";
import { mockRequest, mockResponse } from "./MockUnitTest";
import { Todo } from "../../../src/generated/database";

describe("Todo tests", () => {
  beforeAll(() => {
    jest
      .spyOn(todoService, "createTodoItemService")
      .mockImplementation((body) =>
        Promise.resolve({
          ...body,
          id: "1",
          created_at: new Date(),
          user: "3",
        } satisfies Todo),
      );

    jest
      .spyOn(todoService, "listTodoItemsService")
      .mockImplementation((offset, limit) =>
        Promise.resolve(Array.from(Array(limit))),
      );
  });

  test("TodosController, createTodoItem, valid request", async () => {
    const req = mockRequest();
    req.body.content = "1";
    req.body.priority = 2;

    const res = mockResponse();

    await controllers.createTodoItem(req, res);
    expect(res.json).toHaveBeenCalled();
  });

  test("TodosController, createTodoItem, invalid request", async () => {
    const req = mockRequest();
    req.body = {};

    const res = mockResponse();

    await expect(controllers.createTodoItem(req, res)).rejects.toThrow(
      ValidationError,
    );
    expect(res.json).not.toHaveBeenCalled();
  });

  test("TodosController, list", async () => {
    const req = mockRequest();
    req.params.offset = 1;
    req.params.limit = 2;

    const res = mockResponse();

    await controllers.listTodosItems(req, res);
    expect(res.json).toHaveBeenCalled();
  });

  test("TodosController, default list", async () => {
    const req = mockRequest();

    const res = mockResponse();

    await controllers.listTodosItems(req, res);
    expect(res.json).toHaveBeenCalled();
  });
});
