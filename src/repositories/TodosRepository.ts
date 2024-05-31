// import { log } from "@Log";
import { getAsyncContext } from "@Async";
import { wait } from "@Utils/wait";
import { Transaction } from "sequelize";
import { log } from "@Log";
import { config } from "@Config";
import { PayloadPatchTodos__id__ } from "../api/todos/__id__/patch_todos___id__";
import { PayloadPostTodos } from "../api/todos/post_todos";
import { TodoModel } from "../models/todoModel";
import { UserModel } from "../models/userModel";

export const getDbTodo = (
  id: string,
  updateLock?: boolean | undefined, // for share - no update
): Promise<TodoModel | null> =>
  TodoModel.findOne({
    where: { id, userId: getAsyncContext().userId },
    lock: {
      level: updateLock ? Transaction.LOCK.UPDATE : Transaction.LOCK.SHARE, // for update - no read before another finished. for share - read allowed, no update
      of: TodoModel,
    },
    ...getAsyncContext().getTransaction(),
    include: {
      model: UserModel,
      required: true,
      as: "user",
    },
  });

export const updateDbTodo = async (
  id: string,
  body: PayloadPatchTodos__id__,
): Promise<TodoModel | null> => {
  const todo = await getDbTodo(id, true);
  if (!todo) {
    return null;
  }
  log.debug("Entity was obtained");
  if (config.get("delays")) {
    await wait(5000);
  }
  log.debug("Wait finished");

  todo.content = body.content ?? todo.content;
  todo.priority = body.priority ?? todo.priority;
  await todo.save(getAsyncContext().getTransaction());

  return todo;
};

export const insertDbTodo = (body: PayloadPostTodos): Promise<TodoModel> =>
  TodoModel.create(
    {
      content: body.content,
      priority: body.priority,
      userId: getAsyncContext().userId,
    },
    getAsyncContext().getTransaction(),
  );

export const selectDbTodo = (
  offset: number,
  limit: number,
): Promise<TodoModel[]> =>
  TodoModel.findAll({
    where: { userId: getAsyncContext().userId },
    order: ["createdAt", "ASC"],
    offset,
    limit,
  });

export const deleteDbTodo = async (id: string): Promise<number | null> => {
  const data = await getDbTodo(id, true);
  if (!data) {
    return null;
  }
  if (config.get("delays")) {
    await wait(5000);
  }
  await data.destroy(getAsyncContext().getTransaction());
  return 1;
};
