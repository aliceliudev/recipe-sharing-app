import { MongoMemoryServer } from "mongodb-memory-server";

export default async function globalSetup() {
  const instance = await MongoMemoryServer.create({
    binary: {
      version: "8.0.10",
    },
  });
  global.__MONGOINSTANCE = instance;
  const uri = instance.getUri();
  process.env.DATABASE_URL = uri;
  process.env.MONGODB_URI = uri;
  console.log('Test MongoDB URI:', uri);
}
