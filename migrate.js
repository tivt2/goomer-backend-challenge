const fs = require("fs");
const path = require("path");

const dotenv = require("dotenv");
dotenv.config();
const { env } = require("process");
const { Client } = require("pg");

async function main() {
  const migDirPath = path.join(__dirname, "migrations");
  const migDirFiles = fs.readdirSync(migDirPath);

  const client = new Client({
    host: env.DB_HOST || "database",
    database: env.DB_NAME || "test_db",
    user: env.DB_USER || "test_user",
    password: env.DB_PASSWORD || "test_password",
    port: Number(env.DB_PORT || 5432),
  });
  await client.connect();

  for (const migFile of migDirFiles) {
    const filePath = path.join(migDirPath, migFile);
    const content = fs.readFileSync(filePath, "utf8");

    const statements = content.split(";");
    for (const statement of statements) {
      if (statement.trim() !== "") {
        try {
          await client.query(statement);
        } catch (error) {
          console.log("Error in migration:");
          console.log(statement);
          throw error;
        }
      }
    }
  }

  await client.end();
}

(async () => {
  await main();
})();
