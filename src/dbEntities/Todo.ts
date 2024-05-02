import mongoose, { Schema, model } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
export interface ITodo {
  _id: mongoose.Types.ObjectId;
  content: string;
  priority: number;
  user_id: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date | string;
  __v: number;
}

// 2. Create a Schema corresponding to the document interface.
const todoSchema = new Schema<ITodo>(
  {
    content: { type: String, required: true },
    priority: { type: Number, required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

// 3. Create a Model.
export const Todo = model<ITodo>("Todo", todoSchema);
