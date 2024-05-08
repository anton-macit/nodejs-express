import * as todoRepository from "@Repositories/TodosRepository";
import {
  createTodoItemService,
  deleteTodoItemService,
  getTodoItemService,
  listTodoItemsService,
  updateTodoItemService,
} from "@Services/TodosService";
import { Todo } from "../../../src/generated/database";

describe("TodosService tests", () => {
  const todoStub = (body?: {
    content?: string | undefined;
    priority?: number | undefined;
  }) =>
    ({
      id: "1",
      content: body?.content ?? "1",
      priority: body?.priority ?? 0,
      created_at: new Date(),
      user: "",
    }) satisfies Todo;

  beforeEach(() => {
    jest
      .spyOn(todoRepository, "getDbTodo")
      .mockImplementation((todoId) =>
        Promise.resolve(todoId === "1" ? todoStub() : undefined),
      );

    jest
      .spyOn(todoRepository, "updateDbTodo")
      .mockImplementation((todoId, body) =>
        Promise.resolve(todoId === "1" ? todoStub(body) : undefined),
      );

    jest
      .spyOn(todoRepository, "insertDbTodo")
      .mockImplementation((body) => Promise.resolve(todoStub(body)));

    jest
      .spyOn(todoRepository, "selectDbTodo")
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .mockImplementation((_offset, _limit) => Promise.resolve([todoStub()]));

    jest
      .spyOn(todoRepository, "deleteDbTodo")
      .mockImplementation((todoId) => Promise.resolve(todoId === "1" ? 1 : 0));
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

  test("Insert record", async () => {
    expect(
      await createTodoItemService({ content: "2", priority: 0 }),
    ).toBeDefined();
  });

  test("Select records", async () => {
    expect(await listTodoItemsService(0, 10)).toBeDefined();
  });

  test("Delete existed record", async () => {
    expect(await deleteTodoItemService("1")).toBeGreaterThan(0);
  });

  test("Delete not existed record", async () => {
    expect(await deleteTodoItemService("2")).toBe(0);
  });
});
