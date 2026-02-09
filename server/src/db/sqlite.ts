import Database from "better-sqlite3";
import { readFileSync } from "fs";
import { join } from "path";

const DB_PATH = join(__dirname, "../../database.sqlite");

let db: Database.Database | null = null;
let isInitialized = false;

export const getDatabase = (): Database.Database => {
  if (!db || !db.open) {
    throw new Error("Database connection is not open");
  }
  return db;
};

export const initializeDatabase = (): void => {
  try {
    if (isInitialized && db && db.open) {
      console.log("Database already initialized");
      return;
    }

    // Close existing connection if any
    if (db) {
      db.close();
    }

    // Create new database connection
    db = new Database(DB_PATH);

    // Enable foreign keys
    db.pragma("foreign_keys = ON");

    // Read and execute schema
    const schema = readFileSync(join(__dirname, "schema.sql"), "utf-8");
    db.exec(schema);

    isInitialized = true;
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
};

export const closeDatabase = (): void => {
  if (db && db.open) {
    db.close();
    db = null;
    isInitialized = false;
    console.log("Database closed");
  }
};

// Export db for backward compatibility (deprecated - use getDatabase())
export { db };
