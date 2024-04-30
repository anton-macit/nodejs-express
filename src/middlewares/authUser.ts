import { Request, Response, NextFunction } from "express";
import { JwtPayload, verifyJwtToken } from "@Services/jwtService";
import { config } from "@Config";
import { getAsyncContext } from "@Async";
import HttpForbidden from "../errors/HttpForbidden";

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  const bearerToken = req.headers?.authorization?.split(" ")[1];
  if (bearerToken === undefined) {
    throw new HttpForbidden();
  }
  const { user } = verifyJwtToken(bearerToken) as JwtPayload;
  if (user?.username !== config.get("superAdmin.username")) {
    throw new HttpForbidden();
  }
  getAsyncContext().userId = user.id;

  next();
};

export const userOnly = (req: Request, res: Response, next: NextFunction) => {
  const bearerToken = req.headers?.authorization?.split(" ")[1];
  if (bearerToken === undefined) {
    throw new HttpForbidden();
  }
  const { user } = verifyJwtToken(bearerToken) as JwtPayload;
  if (user?.username === config.get("superAdmin.username")) {
    throw new HttpForbidden();
  }
  // we trust token and not double-check user in DB
  getAsyncContext().userId = user.id;

  next();
};
