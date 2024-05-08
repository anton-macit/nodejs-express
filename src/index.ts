import bodyParser from "body-parser";
import cors from "cors";
import express, { ErrorRequestHandler, Express } from "express";
import fileUpload from "express-fileupload";
import { log, morganMiddleware } from "@Log";
import { config } from "@Config";
import { error } from "@Utils/error";
import { closeDbConnections } from "@Repositories/__query";
import serverless from "serverless-http";
import { router } from "./router";
import { generateCorrelationIdMiddleware } from "./middlewares";

const app: Express = express();

app.use(generateCorrelationIdMiddleware);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "10mb" }));

// default options
app.use(fileUpload());

// Log
app.use(morganMiddleware);

// Disable cache
app.use((req, res, next) => {
  res.setHeader("Surrogate-Control", "no-store");
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

// Disable eTag
app.set("etag", false);

// Routes
app.use("/", router);

app.use(((err, req, res, next) => {
  if (!res.headersSent) {
    error(res, err);
  }
  next(err);
}) as ErrorRequestHandler);

if (config.get("env") !== "dev") {
  app.listen(config.get("port"), () => {
    log.info(`Server is running at 'http://localhost:${config.get("port")}'`);
  });
}

export const handler = serverless(app);

// noinspection JSUnusedGlobalSymbols
// catching signals and do something before exit
const signals = [
  "SIGHUP",
  "SIGINT",
  "SIGQUIT",
  "SIGILL",
  "SIGTRAP",
  "SIGABRT",
  "SIGBUS",
  "SIGFPE",
  "SIGUSR1",
  "SIGSEGV",
  "SIGUSR2",
  "SIGTERM",
];

const closeOnSignals = () => {
  for (let i = 0; i < signals.length; i++) {
    const sig = signals[i];
    process.on(sig, async () => {
      log.warn("closeOnSignals: Signal received", sig);

      await closeDbConnections();
      log.warn(
        "closeOnSignals: Function closeDbConnections finished for signal",
        sig,
      );

      process.exit(1);
    });
  }
};

closeOnSignals();

const exceptionSignals = ["uncaughtException", "unhandledRejection"];

const logOnSignals = () => {
  for (let i = 0; i < exceptionSignals.length; i++) {
    const sig = exceptionSignals[i];
    process.on(sig, (errors) => {
      log.error(`logOnSignals: ${sig}`, errors);
    });
  }
};

logOnSignals();
