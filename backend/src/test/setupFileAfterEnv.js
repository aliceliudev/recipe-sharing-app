import mongoose from "mongoose";
import { beforeAll, afterAll } from "@jest/globals";
import { initDatabase } from "../db/init.js";

// Set test database URL
process.env.MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/recipe-sharing-test";

beforeAll(async () => {
  try {
    await initDatabase();
  } catch (error) {
    console.warn('Database connection failed in test setup:', error.message);
  }
});

afterAll(async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  } catch (error) {
    console.warn('Database disconnection failed:', error.message);
  }
});
