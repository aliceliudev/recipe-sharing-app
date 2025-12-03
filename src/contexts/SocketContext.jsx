import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { getSocketURL } from "../api/config.js";

const SocketContext = createContext();

export function SocketContextProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    const socketURL = getSocketURL();
    
    console.log("🔌 Connecting to Socket.io at:", socketURL);
    setDebugInfo(`Connecting to ${socketURL}`);
    
    const socketIO = io(socketURL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 10,
      transports: ["websocket", "polling"],
      autoConnect: true,
      rejectUnauthorized: false,
    });

    socketIO.on("connect", () => {
      const msg = `✅ Socket connected: ${socketIO.id}`;
      console.log(msg);
      setDebugInfo(msg);
      setIsConnected(true);
    });

    socketIO.on("disconnect", () => {
      const msg = "⚠️ Socket disconnected";
      console.log(msg);
      setDebugInfo(msg);
      setIsConnected(false);
    });

    socketIO.on("connect_error", (error) => {
      const msg = `❌ Socket connection error: ${error.message}`;
      console.error(msg, error);
      setDebugInfo(msg);
    });

    socketIO.on("new-recipe", (data) => {
      const msg = `📢 Socket event received: new-recipe - ${JSON.stringify(data)}`;
      console.log(msg);
      setDebugInfo(msg);
    });

    setSocket(socketIO);

    return () => {
      socketIO.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected, debugInfo }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketContextProvider");
  }
  return context;
}
