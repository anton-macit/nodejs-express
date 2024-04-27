import { randomUUID } from "crypto";

import { Request, Response } from "express";
import { log } from "@Log";
import { AsyncContext, runAsyncContext } from "@Async";
import { gitCommitHash } from "@Utils/gitCommitHash";
import { correlationIdHeader } from "../middlewares/generateCorrelationIdMiddleware";

export const statusController = (req: Request, res: Response) => {
  const code = Number(req.query.code) || 200;
  log.debug("log boolean", true);
  log.debug("log number", 0);
  log.debug("log string", "string");
  log.debug("log object", { foo: "bar" });
  log.debug("log object also", { toString: () => "one more object" });
  log.debug("log error", new Error("There is an error"));
  log.debug("log array", [1, 2, 3, { foo: "bar" }]);

  if (code === -1) {
    const e = Error("New fake error");
    log.error("Status exception as e", e);
    res.status(503).json({
      status: "FAIL",
      message: e,
    });
    throw e;
  }
  if (code === -2) {
    throw Error("New fake error, second type");
  }
  if (code === -4) {
    runAsyncContext(
      new AsyncContext({
        correlationId:
          String(res.getHeader(correlationIdHeader)) || `sc-${randomUUID()}`,
        spanId: `minus4code-${randomUUID()}`,
      }),
      () => {
        log.info("setAsyncContext mark2 1");
        throw Error("New fake error, minus4code insideAsyncContext 2");
      },
    );
    log.info("setAsyncContext mark2 2");
    res.status(204).json(undefined);
    return;
  }
  res.status(code).json({
    status: "UP",
    uptime_sec: process.uptime(),
    timestamp: new Date(),
    response_time_nano_sec: process.hrtime(),
    git_commit: gitCommitHash,
  });
};
