import * as controllers from "@Controllers/OneTodoController";
import * as todoService from "@Services/TodosService";
import { mockRequest, mockResponse } from "./MockUnitTest";
import { TodoModel } from "../../../src/models/todoModel";

describe("OneTodoController tests", () => {
  beforeAll(() => {
    const todoStub = {
      id: "1",
      content: "2",
      priority: 4,
      createdAt: new Date(),
      userId: "3",
    } as TodoModel;

    jest
      .spyOn(todoService, "getTodoItemService")
      .mockImplementation((id) =>
        Promise.resolve(id === "1" ? todoStub : null),
      );

    jest
      .spyOn(todoService, "updateTodoItemService")
      .mockImplementation((id, body) =>
        Promise.resolve(
          id === "1" ? ({ ...body, ...todoStub } as TodoModel) : null,
        ),
      );
    jest
      .spyOn(todoService, "deleteTodoItemService")
      .mockImplementation((id) => Promise.resolve(id === "1" ? 1 : 0));
  });

  test("OneTodoController, getTodoItem, found", async () => {
    const req = mockRequest();
    req.params.id = "1";
    const res = mockResponse();

    await controllers.getTodoItem(req, res);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
  });

  test("OneTodoController, getTodoItem, not found", async () => {
    const req = mockRequest();
    req.params.id = "2";
    const res = mockResponse();

    await controllers.getTodoItem(req, res);
    expect(res.status).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
  });

  test("OneTodoController, updateTodoItem, found", async () => {
    const req = mockRequest();
    req.params.id = "1";
    const res = mockResponse();

    await controllers.updateTodoItem(req, res);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
  });

  test("OneTodoController, updateTodoItem, not found", async () => {
    const req = mockRequest();
    req.params.id = "2";
    const res = mockResponse();

    await controllers.updateTodoItem(req, res);
    expect(res.status).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
  });

  test("OneTodoController, deleteTodoItem, found", async () => {
    const req = mockRequest();
    req.params.id = "1";
    const res = mockResponse();

    await controllers.deleteTodoItem(req, res);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
  });

  test("OneTodoController, deleteTodoItem, not found", async () => {
    const req = mockRequest();
    req.params.id = "2";
    const res = mockResponse();

    await controllers.deleteTodoItem(req, res);
    expect(res.status).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
  });
});
