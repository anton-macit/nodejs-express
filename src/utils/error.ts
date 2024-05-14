import { Response } from "express";
import { log } from "@Log";
import { TokenExpiredError } from "jsonwebtoken";
import HttpUnauthorized from "../exceptions/HttpUnauthorized";
import HttpForbidden from "../exceptions/HttpForbidden";

export const error = (res: Response, err: unknown, errorPoint = "") => {
  log.error(`Error ${errorPoint}`, err);

  if (err instanceof HttpUnauthorized) {
    res.status(401).json({ error: "Unauthorized", message: err.message });
  }

  if (err instanceof TokenExpiredError) {
    res
      .status(401)
      .json({ error: "Unauthorized. Token Expired", message: err.message });
  }

  if (err instanceof HttpForbidden) {
    res.status(403).json({ error: "Forbidden", message: err.message });
  }
};
