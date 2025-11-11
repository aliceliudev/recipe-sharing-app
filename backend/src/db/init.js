import mongoose from "mongoose";

export async function initDatabase() {
  // Use environment variable or fallback to localhost
  const DATABASE_URL =
    process.env.DATABASE_URL || "mongodb://localhost:27017/blog";

  try {
    const connection = await mongoose.connect(DATABASE_URL);
    console.log(`Successfully connected to ${DATABASE_URL}`);
    return connection;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}
