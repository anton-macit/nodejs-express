import { NextFunction, Request, Response } from "express";
import { getAsyncContext } from "@Async";
import expressAsyncHandler from "express-async-handler";
import { sequelize } from "../models/sequlized";

export const startTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction,
  // eslint-disable-next-line require-await
) => {
  getAsyncContext().transaction = await sequelize.transaction();
  res.on("finish", () => getAsyncContext().transaction.commit()); // todo - hasn't tested on AWS Lambda
  next();
};
