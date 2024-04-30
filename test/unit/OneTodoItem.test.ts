import * as todoRepository from "@Repositories/TodosRepository";
import {
  getTodoItemService,
  updateTodoItemService,
} from "@Services/TodosService";

describe("TodosService tests", () => {
  beforeEach(() => {
    jest
      .spyOn(todoRepository, "getDbTodo")
      .mockImplementation((todoId) =>
        Promise.resolve(
          todoId === "1"
            ? {
                id: "1",
                content: "1",
                priority: 0,
                created_at: new Date(),
                user: "",
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
                id: "1",
                content: body.content ?? "1",
                priority: body.priority ?? 0,
                created_at: new Date(),
                user: "",
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
