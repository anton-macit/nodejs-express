import { Request, Response, NextFunction } from "express";
import { JwtPayload, verifyJwtToken } from "@Services/jwtService";
import { config } from "@Config";
import { getAsyncContext } from "@Async";
import HttpUnauthorized from "../errors/HttpUnauthorized";

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  const bearerToken = req.headers?.authorization?.split(" ")[1];
  if (bearerToken === undefined) {
    throw new HttpUnauthorized();
  }
  const { user } = verifyJwtToken(bearerToken) as JwtPayload;
  if (user?.username !== config.get("superAdmin.username")) {
    throw new HttpUnauthorized();
  }
  getAsyncContext().userId = user.id;

  next();
};

export const userOnly = (req: Request, res: Response, next: NextFunction) => {
  const bearerToken = req.headers?.authorization?.split(" ")[1];
  if (bearerToken === undefined) {
    throw new HttpUnauthorized();
  }
  const { user } = verifyJwtToken(bearerToken) as JwtPayload;
  if (user?.username === config.get("superAdmin.username")) {
    throw new HttpUnauthorized();
  }
  // we trust token and not to double-check user in DB
  getAsyncContext().userId = user.id;

  next();
};
