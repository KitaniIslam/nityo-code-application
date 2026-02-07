import Database from "better-sqlite3";
import { readFileSync } from "fs";
import { join } from "path";

const DB_PATH = join(__dirname, "../../database.sqlite");

export const db: any = new Database(DB_PATH);

export const initializeDatabase = () => {
  try {
    const schema = readFileSync(join(__dirname, "schema.sql"), "utf-8");
    db.exec(schema);
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
};

export const closeDatabase = () => {
  db.close();
};

process.on("exit", closeDatabase);
process.on("SIGINT", closeDatabase);
process.on("SIGTERM", closeDatabase);
