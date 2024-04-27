import convict from "convict";
import * as process from "process";
import { local } from "./local";
import { test } from "./test";

const configs: any = {
  local,
  test,
};

export const config = convict({
  logLocally: {
    doc: "To save logs to files and to colorize",
    format: Boolean,
    default: false,
    env: "LOG_LOCAL",
  },
  port: {
    doc: "The port to bind",
    format: "port",
    default: 8080,
    env: "PORT",
  },
  env: {
    doc: "The application environment.",
    format: ["local", "test"],
    default: "local",
    env: "NODE_ENV",
  },
  logLevel: {
    doc: "The depth level of log",
    format: ["error", "warn", "info", "debug", "silly"],
    default: "info",
    env: "LOG_LEVEL",
  },
  dbConnectionString: {
    doc: "DB connection string",
    format: String,
    env: "DB_CONNECTION_STRING",
    default: "",
  },
  dbMaxConnection: {
    doc: "DB max connection",
    format: Number,
    env: "DB_MAX_CONNECTION",
    default: 2,
  },
});

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/dot-notation
config.load(configs[process.env.NODE_ENV ?? "local"]);

// Perform validation
config.validate({ allowed: "warn" });
