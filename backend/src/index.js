import dotenv from "dotenv";
dotenv.config();
import { initDatabase } from "./db/init.js";
import { app } from "./app.js";

try {
  await initDatabase();
  const PORT = process.env.PORT || 8080;
  const HOST = process.env.HOST || "0.0.0.0";
  console.log(`Starting server with PORT=${PORT}, HOST=${HOST}`);
  app.listen(PORT, HOST, () => {
    console.info(`express server running on http://localhost:${PORT}`);
    console.info(`server is accessible on all interfaces at port ${PORT}`);
  });
} catch (err) {
  console.error("error connecting to database:", err);
}
