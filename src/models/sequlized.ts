import { Sequelize, Transaction } from "sequelize";
import { config } from "@Config";

export const sequelize = new Sequelize(config.get("dbConnectionString"), {
  isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
});
