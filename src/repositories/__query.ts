import { config } from "@Config";
import mongoose, { ConnectOptions } from "mongoose";
import { log } from "@Log";

let db: mongoose.Connection;
export const getOrCreateDbConnection = async (options?: ConnectOptions) => {
  if (!db) {
    await mongoose.connect(config.get("mongodbConnectionString"), options);
    db = mongoose.connection;
    db.on("error", (e) => log.error("mongodb connection error:", e));
    db.once("open", () => {
      log.debug("mongodb open connect");
    });
  }
};

export const closeDbConnections = (): Promise<void> => db.close(true);
