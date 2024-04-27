import { log } from "@Log";
import postgresql, { Pool } from "pg";
import { config } from "@Config";

postgresql.types.setTypeParser(20, parseInt);

/*
const parseDate = (val: string) => (val === null ? null : new Date(val));
postgresql.types.setTypeParser(1700, parseInt); // numeric
postgresql.types.setTypeParser(1082, parseDate); // to date
postgresql.types.setTypeParser(1083, parseDate); // to date
postgresql.types.setTypeParser(1114, parseDate); // to date
postgresql.types.setTypeParser(1184, parseDate); // to date
postgresql.types.setTypeParser(postgresql.types.builtins.DATE, parseDate); // to date
postgresql.types.setTypeParser(postgresql.types.builtins.TIME, parseDate); // to date
postgresql.types.setTypeParser(postgresql.types.builtins.TIMESTAMP, parseDate); // to date
postgresql.types.setTypeParser(
  postgresql.types.builtins.TIMESTAMPTZ,
  parseDate
); // to date
*/

const defaultPool = "defaultDbPool";

const pools: {
  [key: string]: Pool;
} = {};

const getOrCreatePool = (
  poolName: string,
  dbUri: string,
  dbMaxConnection: number,
): Pool => {
  if (!pools[poolName]) {
    const newPool = new Pool({
      connectionString: dbUri,
      idleTimeoutMillis: 2000,
      connectionTimeoutMillis: 60000,
      keepAlive: true,
      keepAliveInitialDelayMillis: 10000,
      query_timeout: 60000,
      statement_timeout: 65000,
      max: dbMaxConnection,
    });

    newPool.on("connect", () => log.debug(`pool connected ${poolName}`));
    newPool.on("acquire", () => log.debug(`pool acquire ${poolName}`));
    newPool.on("remove", () => log.debug(`pool remove ${poolName}`));
    newPool.on("error", (error) =>
      log.error(`DB client error ${poolName}`, error),
    );

    pools[poolName] = newPool;
  }

  return pools[poolName];
};

export function query(queryStr: string, params?: unknown[]) {
  const errorForStack = new Error();
  let res;
  try {
    const pool = getOrCreatePool(
      defaultPool,
      config.get("dbConnectionString"),
      config.get("dbMaxConnection"),
    );
    res = pool.query(queryStr, params);
  } catch (e: any) {
    log.error("Database.ts query error", {
      query,
      params,
      e,
      stack: e?.stack,
    });
    errorForStack.message = `query error. query:${query}, params: ${params}`;
    e.nested = errorForStack;
    throw e;
  }
  return res;
}

export const closeDbConnections = async (): Promise<void> => {
  await Promise.all(Object.keys(pools).map((poolKey) => pools[poolKey].end()));
  Object.keys(pools).map((poolKey) => delete pools[poolKey]);
};
