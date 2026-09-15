import { MongoClient } from "mongodb";
import { DB_URI, DB_NAME } from "../config/config.js";

const client = new MongoClient(DB_URI);

let db = null;

export async function connectDB() {
  await client.connect();
  db = client.db(DB_NAME);
  console.log(`Connected to MongoDB database "${DB_NAME}"`);
  return db;
}

export function getDB() {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB() before using getDB().");
  }
  return db;
}

export default client;
