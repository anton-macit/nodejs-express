import { Response } from "express";
import { log } from "@Log";
import LoginError from "../errors/LoginError";
import HttpForbidden from "../errors/HttpForbidden";

export const error = (res: Response, err: unknown, errorPoint = "") => {
  log.error(`Error ${errorPoint}`, error);

  if (err instanceof LoginError) {
    res
      .status(401)
      .json({ error: "User does not exist with the provided credentials" });
  }

  if (err instanceof HttpForbidden) {
    res.status(403).json({ error: "Forbidden" });
  }
};
