import dotenv from "dotenv";
dotenv.config();
import { initDatabase } from "./db/init.js";
import { app, setIO } from "./app.js";
import { createServer } from "http";
import { Server } from "socket.io";

try {
  await initDatabase();
  const PORT = process.env.PORT || 3001;
  const HOST = process.env.HOST || "0.0.0.0";
  console.log(`Starting server with PORT=${PORT}, HOST=${HOST}`);
  
  // Create HTTP server with Express app
  const httpServer = createServer(app);
  
  // Attach Socket.io to HTTP server
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: false,
      allowedHeaders: ["*"]
    },
    transports: ["websocket", "polling"],
    allowUpgrades: true,
    pingInterval: 25000,
    pingTimeout: 60000,
  });
  
  // Store the io instance in the app
  setIO(io);
  
  // Handle Socket.io connections
  io.on("connection", (socket) => {
    console.log("✅ New Socket.io client connected:", socket.id);
    console.log("📊 Total connected clients:", io.engine.clientsCount);
    
    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
      console.log("📊 Total connected clients:", io.engine.clientsCount);
    });
    
    socket.on("error", (error) => {
      console.error("❌ Socket error:", error);
    });
  });
  
  // Start the server
  httpServer.listen(PORT, HOST, () => {
    console.info(`✅ Express server running on http://localhost:${PORT}`);
    console.info(`✅ Socket.io server is ready for connections on ws://localhost:${PORT}`);
  });
} catch (err) {
  console.error("error connecting to database:", err);
}

