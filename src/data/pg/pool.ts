import { Pool, PoolClient, PoolConfig } from "pg";
import dotenv from "dotenv";
dotenv.config();
import { env } from "process";
import { ApiError } from "../../commom/apiError";

const config: PoolConfig = {
  host: env.DB_HOST || "database",
  database: env.DB_NAME || "test_db",
  user: env.DB_USER || "test_user",
  password: env.DB_PASSWORD || "test_password",
  port: Number(env.DB_PORT || 5432),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

const pool = new Pool(config);

export async function getPoolClient(): Promise<[ApiError | null, PoolClient]> {
  try {
    return [null, await pool.connect()];
  } catch (error) {
    return [
      new ApiError(500, "Unable to connect to the database"),
      {} as PoolClient,
    ];
  }
}
