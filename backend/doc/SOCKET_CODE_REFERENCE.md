# Socket.io Implementation - Code Reference

## 📍 Backend - Socket.io Server Code

### File: `backend/src/index.js`
**SHOWS THE SOCKET.IO BACKEND SETUP**

```javascript
import dotenv from "dotenv";
dotenv.config();
import { initDatabase } from "./db/init.js";
import { app, setIO } from "./app.js";
import { createServer } from "http";
import { Server } from "socket.io";

try {
  await initDatabase();
  const PORT = process.env.PORT || 8080;
  const HOST = process.env.HOST || "0.0.0.0";
  console.log(`Starting server with PORT=${PORT}, HOST=${HOST}`);
  
  // ✅ CREATE HTTP SERVER AND ATTACH SOCKET.IO
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
  
  // ✅ STORE THE IO INSTANCE IN THE APP
  setIO(io);
  
  // ✅ HANDLE SOCKET.IO CONNECTIONS
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);
    
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
  
  httpServer.listen(PORT, HOST, () => {
    console.info(`express server running on http://localhost:${PORT}`);
    console.info(`server is accessible on all interfaces at port ${PORT}`);
    console.info(`Socket.io server is ready for connections`);
  });
} catch (err) {
  console.error("error connecting to database:", err);
}
```

---

### File: `backend/src/app.js`
**SHOWS IO GETTER/SETTER**

```javascript
import express from "express";
import { recipesRoutes } from "./routes/recipes.js";
import { userRoutes } from "./routes/users.js";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

app.use(bodyParser.json());
app.use(cors());

recipesRoutes(app);
userRoutes(app);

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

// ✅ STORE SOCKET.IO INSTANCE
let io;

export function setIO(socketIO) {
  io = socketIO;
}

export function getIO() {
  return io;
}

export { app };
```

---

### File: `backend/src/routes/recipes.js`
**SHOWS THE SOCKET CODE THAT SENDS BROADCAST MESSAGE WHEN NEW RECIPE IS ADDED**

```javascript
import {
  listAllRecipes,
  listRecipesByAuthor,
  listRecipesByTag,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipeById,
  likeRecipe,
  unlikeRecipe,
  getTopRecipes,
} from "../services/recipes.js";
import { requireAuth } from "../middleware/jwt.js";
import { getIO } from "../app.js";

export function recipesRoutes(app) {
  // ... other routes ...

  app.post("/api/v1/recipes", requireAuth, async (req, res) => {
    try {
      const recipe = await createRecipe(req.auth.sub, req.body);
      
      // ✅ GET FULL RECIPE WITH POPULATED AUTHOR
      const populatedRecipe = await recipe.populate("author", "username");
      
      // ✅ BROADCAST NEW RECIPE NOTIFICATION TO ALL CONNECTED CLIENTS
      const io = getIO();
      if (io) {
        io.emit("new-recipe", {
          id: recipe._id,
          title: recipe.title,
          author: populatedRecipe.author?.username || "Anonymous",
          createdAt: recipe.createdAt,
        });
        console.log("Broadcasted new recipe:", recipe.title, "by", populatedRecipe.author?.username);
      }
      
      return res.json(recipe);
    } catch (err) {
      console.error("error creating recipe", err);
      return res.status(500).end();
    }
  });

  // ... other routes ...
}
```

**Broadcast Message Format:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "title": "Chocolate Cake",
  "author": "alice",
  "createdAt": "2025-12-03T05:25:00.000Z"
}
```

---

## 📍 Frontend - Socket.io Client Code

### File: `src/contexts/SocketContext.jsx`
**SHOWS THE SOCKET CODE THAT RECEIVES MESSAGES ON FRONTEND**

```javascript
import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

export function SocketContextProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // ✅ CONNECT TO BACKEND SOCKET.IO SERVER
    const socketURL = import.meta.env.VITE_API_URL || "http://localhost:3001";
    console.log("Connecting to Socket.io at:", socketURL);
    
    const socketIO = io(socketURL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    // ✅ HANDLE CONNECTION
    socketIO.on("connect", () => {
      console.log("Socket connected:", socketIO.id);
      setIsConnected(true);
    });

    // ✅ HANDLE DISCONNECTION
    socketIO.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    // ✅ HANDLE CONNECTION ERRORS
    socketIO.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    // ✅ LISTEN FOR NEW RECIPE EVENTS
    socketIO.on("new-recipe", (data) => {
      console.log("Socket event received: new-recipe", data);
    });

    setSocket(socketIO);

    return () => {
      socketIO.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
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
```

---

### File: `src/pages/Blog.jsx`
**SHOWS THE SOCKET CODE THAT SHOWS THE POPUP WHEN NEW RECIPE IS ADDED**

```javascript
import { RecipeList } from "../components/RecipeList.jsx";
import { CreateRecipe } from "../components/CreateRecipe.jsx";
import { RecipeFilter } from "../components/RecipeFilter.jsx";
import { RecipeSorting } from "../components/RecipeSorting.jsx";
import { Header } from "../components/Header.jsx";
import { RecipeNotification } from "../components/RecipeNotification.jsx";
import { useQuery } from "@tanstack/react-query";
import { getRecipes, getPopularRecipes } from "../api/recipes.js";
import { useSocket } from "../contexts/SocketContext.jsx";
import { useState, useEffect } from "react";

export function Blog() {
  const [author, setAuthor] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("descending");
  
  // ✅ STATE FOR NOTIFICATION
  const [notification, setNotification] = useState(null);
  
  // ✅ GET SOCKET FROM CONTEXT
  const { socket } = useSocket();

  const recipesQuery = useQuery({
    queryKey: [sortBy === "popularity" ? "popularRecipes" : "recipes", { author, sortBy, sortOrder }],
    queryFn: () => {
      if (sortBy === "popularity") {
        return getPopularRecipes(20).then(recipes =>
          sortOrder === "ascending"
            ? [...recipes].reverse()
            : recipes
        );
      } else {
        return getRecipes({ author, sortBy, sortOrder });
      }
    },
  });
  
  // ✅ LISTEN FOR NEW RECIPE NOTIFICATIONS
  useEffect(() => {
    if (!socket) return;

    const handleNewRecipe = (recipe) => {
      console.log("Received new recipe notification:", recipe);
      
      // ✅ SET NOTIFICATION STATE - THIS DISPLAYS THE POPUP
      setNotification(recipe);
      
      // ✅ REFRESH THE RECIPES LIST
      recipesQuery.refetch();
    };

    socket.on("new-recipe", handleNewRecipe);

    return () => {
      socket.off("new-recipe", handleNewRecipe);
    };
  }, [socket]);

  const recipes = recipesQuery.data ?? [];
  
  return (
    <div style={{ padding: 8 }}>
      <Header />
      <br />
      <hr />
      <br />
      <h1>Recipe Sharing Community</h1>
      <CreateRecipe />
      <br />
      <hr />
      Filter by:{" "}
      <RecipeFilter
        field="author"
        value={author}
        onChange={(value) => setAuthor(value)}
      />
      <br />
      <RecipeSorting
        fields={["createdAt", "updatedAt", "popularity"]}
        value={sortBy}
        onChange={(value) => {
          setSortBy(value);
        }}
        orderValue={sortOrder}
        onOrderChange={(orderValue) => setSortOrder(orderValue)}
      />
      <hr />
      <RecipeList recipes={recipes} />
      
      {/* ✅ DISPLAY NOTIFICATION POPUP */}
      {notification && (
        <RecipeNotification 
          recipe={notification} 
          onDismiss={() => setNotification(null)}
        />
      )}
    </div>
  );
}
```

---

### File: `src/components/RecipeNotification.jsx`
**SHOWS THE POPUP COMPONENT**

```javascript
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./RecipeNotification.css";

export function RecipeNotification({ recipe, onDismiss }) {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);

  // ✅ AUTO-DISMISS AFTER 8 SECONDS
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onDismiss?.();
    }, 8000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (!isVisible) return null;

  // ✅ HANDLE CLICK TO VIEW RECIPE
  const handleViewRecipe = () => {
    navigate(`/recipe/${recipe.id}`);
    setIsVisible(false);
    onDismiss?.();
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  return (
    <div className="recipe-notification">
      <div className="notification-content">
        <h3>🎉 New Recipe Added!</h3>
        <p className="recipe-title">{recipe.title}</p>
        <p className="recipe-author">by {recipe.author}</p>
        <div className="notification-actions">
          {/* ✅ LINK TO VIEW THE NEW RECIPE */}
          <button className="btn-view" onClick={handleViewRecipe}>
            View Recipe
          </button>
          <button className="btn-dismiss" onClick={handleDismiss}>
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
```

**CSS Styling (`src/components/RecipeNotification.css`):**
```css
.recipe-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  animation: slideIn 0.3s ease-in-out;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.notification-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  min-width: 300px;
  max-width: 400px;
}

.notification-content h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
  font-weight: 600;
}

.recipe-title {
  font-weight: 600;
  font-size: 16px;
  margin: 12px 0;
  word-break: break-word;
}

.recipe-author {
  font-size: 13px;
  opacity: 0.9;
  font-style: italic;
}

.notification-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.btn-view,
.btn-dismiss {
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-view {
  background-color: white;
  color: #667eea;
  flex: 1;
}

.btn-view:hover {
  background-color: #f0f0f0;
  transform: translateY(-2px);
}

.btn-dismiss {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
}

.btn-dismiss:hover {
  background-color: rgba(255, 255, 255, 0.3);
}
```

---

## 🚀 How to Run

### Terminal 1 - Start Backend
```bash
cd /workspaces/recipe-sharing-app/backend
npm run dev
```

### Terminal 2 - Start Frontend
```bash
cd /workspaces/recipe-sharing-app
npm run dev
```

### Terminal 3 - Start MongoDB (if not running)
```bash
docker run -d --name recipe-mongodb -p 27017:27017 mongo:6.0.4
```

---

## ✅ Testing Flow

1. **Open Browser 1**: `http://localhost:5173`
2. **Open Browser 2**: `http://localhost:5173`
3. **Browser 1**: Sign up as "alice" and login
4. **Browser 2**: Sign up as "bob" and login
5. **Browser 1**: Create recipe "Chocolate Cake"
6. **Browser 2**: 🎉 Popup appears with recipe title and author
7. **Browser 2**: Click "View Recipe" to see details
8. Success! ✨

---

## 📊 Communication Sequence

```
Browser 1                    Backend                    Browser 2
   |                            |                           |
   |--- POST /api/v1/recipes ---|                           |
   |                            |                           |
   |                    Save to MongoDB                     |
   |                            |                           |
   |                    io.emit("new-recipe")               |
   |                            |--- WebSocket msg -------->|
   |                            |                    Display popup
   |                            |                           |
   |                            |<--- (Browser 2 clicks View Recipe)
   |                            |          Navigate to /recipe/id
```

---

## 🎯 Key Points

✅ **Backend broadcasts** using `io.emit("new-recipe", data)`
✅ **Frontend receives** using `socket.on("new-recipe", handleNewRecipe)`
✅ **Notification popup** displays instantly with recipe title and author
✅ **View Recipe link** navigates to detailed recipe page
✅ **All users receive** the notification in real-time
✅ **MongoDB stores** recipe data for persistence

---

**Implementation Complete! 🎉**
