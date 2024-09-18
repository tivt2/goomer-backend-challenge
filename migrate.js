const fs = require("fs");
const path = require("path");

const dotenv = require("dotenv");
dotenv.config();
const { env, argv, exit } = require("process");
const { Client } = require("pg");

async function migrate(client, statements) {
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

async function main() {
  if (argv.length !== 3) {
    console.log("Missing argument [up | down]");
    exit(1);
  }

  const migDirPath = path.join(__dirname, "migrations");
  const migDirFiles = fs.readdirSync(migDirPath);
  if (migDirFiles.length === 0) {
    console.log("No files to migrate");
    exit(1);
  }

  const client = new Client({
    host: env.DB_HOST || "database",
    database: env.DB_NAME || "test_db",
    user: env.DB_USER || "test_user",
    password: env.DB_PASSWORD || "test_password",
    port: Number(env.DB_PORT || 5432),
    connectionTimeoutMillis: 2000,
  });
  await client.connect();

  for (const migFile of migDirFiles) {
    const filePath = path.join(migDirPath, migFile);
    const content = fs.readFileSync(filePath, "utf8");

    const [up, down] = content
      .slice(content.indexOf("--UP") + 4)
      .split("--DOWN");
    switch (argv[2]) {
      case "up":
        console.log("Migrating UP");
        await migrate(client, up.split(";"));
        console.log("UP migration complete!");
        break;
      case "down":
        console.log("Migrating DOWN");
        await migrate(client, down.split(";"));
        console.log("DOWN migration complete!");
        break;
      default:
        console.log("Argument must be [up | down]");
        exit(1);
    }
  }

  await client.end();
}

(async () => {
  await main();
})();
