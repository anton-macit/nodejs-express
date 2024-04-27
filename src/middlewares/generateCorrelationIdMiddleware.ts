import { AsyncContext, runAsyncContext } from "@Async";
import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

export const correlationIdHeader = "x-correlationid";

export const generateCorrelationIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Get the correlationId from the header if it exists, or generate a new one
  const correlationId = req.headers[correlationIdHeader]
    ? String(req.headers[correlationIdHeader])
    : randomUUID();

  // Pass callback function
  runAsyncContext(new AsyncContext({ correlationId }), next);
};
