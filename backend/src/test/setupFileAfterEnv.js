import mongoose from "mongoose";
import { beforeAll, afterAll } from "@jest/globals";
import { initDatabase } from "../db/init.js";

beforeAll(async () => {
  try {
    // Only set fallback if no URI is provided by globalSetup
    if (!process.env.MONGODB_URI && !process.env.DATABASE_URL) {
      process.env.MONGODB_URI = "mongodb://localhost:27017/recipe-sharing-test";
    }
    await initDatabase();
    console.log('Test database connected successfully');
  } catch (error) {
    console.warn('Database connection failed in test setup:', error.message);
    // Don't throw error - let tests handle database unavailability gracefully
  }
});

afterAll(async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('Test database disconnected');
    }
  } catch (error) {
    console.warn('Database disconnection failed:', error.message);
  }
});
