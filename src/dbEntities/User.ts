import mongoose, { Schema, model } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
export interface IUser {
  _id: mongoose.Types.ObjectId;
  username: string;
  hash: string;
  created_at: Date | string;
  updated_at: Date | string;
  __v: number;
}

// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    hash: { type: String, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

// 3. Create a Model.
export const User = model<IUser>("User", userSchema);
