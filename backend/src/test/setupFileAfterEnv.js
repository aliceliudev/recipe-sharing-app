import mongoose from "mongoose";
import { beforeAll, afterAll } from "@jest/globals";
import { initDatabase } from "../db/init.js";

beforeAll(async () => {
  try {
    // The MongoDB URI should already be set by globalSetup.js
    console.log('Using MongoDB URI from globalSetup:', process.env.MONGODB_URI || process.env.DATABASE_URL);
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
