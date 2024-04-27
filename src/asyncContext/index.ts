import { AsyncLocalStorage } from "async_hooks";
import { NextFunction } from "express";
import { randomUUID } from "crypto";

export class AsyncContext {
  correlationId: string;

  spanId?: string;

  azureTraceParent?: string | null | undefined;

  constructor(params: {
    correlationId: string;
    spanId?: string;
    azureTraceParent?: string | null | undefined;
  }) {
    this.correlationId = params.correlationId;
    this.spanId = params.spanId;
    this.azureTraceParent = params.azureTraceParent;
  }
}

export const asyncLocalStorage = new AsyncLocalStorage<AsyncContext>();

type FunctionReturnVoid = () => void | Promise<void>;
type AsyncCallback = NextFunction | FunctionReturnVoid;

export const runAsyncContext = (
  context: AsyncContext,
  callback: AsyncCallback,
) => {
  asyncLocalStorage.run(context, () => {
    callback();
  });
};

export const getAsyncContext = (): AsyncContext =>
  asyncLocalStorage.getStore() ||
  new AsyncContext({ correlationId: `lsc-${randomUUID()}` });
