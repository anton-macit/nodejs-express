/* eslint-disable */
import { getAsyncContext } from "@Async";
import { PayloadPatchTodos__id__ } from "../api/todos/__id__/patch_todos___id__";
import { PayloadPostTodos } from "../api/todos/post_todos";
import { ITodo, Todo } from "../dbEntities/Todo";
import { Document, Query } from "mongoose";

export const getDbTodo = async (_id: string): Promise<ITodo | undefined> =>
  (await Todo.findOne({ _id, user_id: getAsyncContext().userId }))?.toObject();

export const updateDbTodo = async (
  _id: string,
  body: PayloadPatchTodos__id__,
): Promise<ITodo | undefined> =>
  (
    await Todo.findOneAndUpdate(
      { _id, user_id: getAsyncContext().userId },
      body,
    )
  )?.toObject();

export const insertDbTodo = async (body: PayloadPostTodos): Promise<ITodo> => {
  return (
    await new Todo({
      ...body,
      user_id: getAsyncContext().userId,
    }).save({ validateBeforeSave: true })
  ).toObject();
};

export const selectDbTodo = async (
  offset: number,
  limit: number,
): Promise<ITodo[]> => {
  const query: Query<Document<ITodo>[], Document<ITodo>> = Todo.find({
    user_id: getAsyncContext().userId,
  });
  return (await query.sort("created_at").skip(offset).limit(limit)).map((i) =>
    i.toObject(),
  );
};

export const deleteDbTodo = async (id: string): Promise<number> =>
  (await Todo.deleteOne({ _id: id })).deletedCount;
