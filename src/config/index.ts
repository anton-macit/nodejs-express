import convict from "convict";
import * as process from "process";
import { local } from "./local";
import { test } from "./test";
import { dev } from "./dev";
import "dotenv/config";

const configs: any = {
  local,
  test,
  dev,
};

export const config = convict({
  delays: {
    doc: "Delays for any operations",
    format: Boolean,
    default: false,
    env: "DELAYS",
  },
  aws: {
    secretName: {
      doc: "AWS secret name",
      format: String,
      default: "",
      env: "AWS_SECRET_NAME",
    },
    region: {
      doc: "AWS region",
      format: String,
      default: "",
      env: "AWS_REGION",
    },
  },
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
    format: ["local", "test", "dev"], // local: local instance, dev: on AWS Lambda
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
  superAdmin: {
    username: {
      doc: "SuperAdmin username",
      format: String,
      env: "SUPER_ADMIN_USERNAME",
      default: "admin",
    },
    password: {
      doc: "SuperAdmin password",
      format: String,
      env: "SUPER_ADMIN_PASSWORD",
      default: "", // should be defined via the env variable
    },
  },
  jwt: {
    secret: {
      format: String,
      default: "", // should be defined via the env variable
      env: "JWT_SECRET",
      sensitive: true,
    },
    expiresIn: {
      format: String,
      /** expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms.js).  Eg: 60, "2 days", "10h", "7d" */
      default: "1h",
      env: "JWT_EXPIRES_IN",
    },
  },
});

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/dot-notation
config.load(configs[process.env.NODE_ENV ?? "local"]);

// Perform validation
config.validate({ allowed: "warn" });
