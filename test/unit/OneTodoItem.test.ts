import * as todoRepository from "@Repositories/TodosRepository";
import {
  getTodoItemService,
  updateTodoItemService,
} from "@Services/TodosService";
import mongoose from "mongoose";

describe("TodosService tests", () => {
  beforeEach(() => {
    jest.spyOn(todoRepository, "getDbTodo").mockImplementation((_id) =>
      Promise.resolve(
        _id === "1"
          ? {
              _id: new mongoose.Types.ObjectId("1"),
              content: "1",
              priority: 0,
              created_at: new Date(),
              updated_at: new Date(),
              user_id: new mongoose.Types.ObjectId("1"),
              __v: 0,
            }
          : undefined,
      ),
    );

    jest
      .spyOn(todoRepository, "updateDbTodo")
      .mockImplementation((todoId, body) =>
        Promise.resolve(
          todoId === "1"
            ? {
                _id: new mongoose.Types.ObjectId("1"),
                content: body.content ?? "1",
                priority: body.priority ?? 0,
                created_at: new Date(),
                updated_at: new Date(),
                user_id: new mongoose.Types.ObjectId("1"),
                __v: 0,
              }
            : undefined,
        ),
      );
  });

  test("Get existed record from db", async () => {
    expect(await getTodoItemService("1")).toBeDefined();
  });

  test("Get not existed record from db", async () => {
    expect(await getTodoItemService("2")).toBeUndefined();
  });

  test("Update existed record", async () => {
    expect(await updateTodoItemService("1", { content: "1" })).toBeDefined();
  });

  test("Update not existed record", async () => {
    expect(await updateTodoItemService("2", { content: "2" })).toBeUndefined();
  });
});
