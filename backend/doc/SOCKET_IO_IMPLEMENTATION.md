# Socket.io Integration - Real-time Recipe Notifications

## Backend Socket.io Setup

### File: `backend/src/index.js`

The backend initializes Socket.io server:

```javascript
import { createServer } from "http";
import { Server } from "socket.io";

// Create HTTP server and attach Socket.io
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Store the io instance in the app
setIO(io);

// Handle Socket.io connections
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
  
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

httpServer.listen(PORT, HOST, () => {
  console.info(`express server running on http://localhost:${PORT}`);
  console.info(`Socket.io server is ready for connections`);
});
```

### File: `backend/src/routes/recipes.js`

When a new recipe is created, it broadcasts to all connected clients:

```javascript
app.post("/api/v1/recipes", requireAuth, async (req, res) => {
  try {
    const recipe = await createRecipe(req.auth.sub, req.body);
    
    // Get full recipe with populated author
    const populatedRecipe = await recipe.populate("author", "username");
    
    // Broadcast new recipe notification to all connected clients
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
```

## Frontend Socket.io Setup

### File: `src/contexts/SocketContext.jsx`

The frontend Socket.io context manages the connection:

```javascript
import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

export function SocketContextProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketURL = import.meta.env.VITE_API_URL || "http://localhost:3001";
    console.log("Connecting to Socket.io at:", socketURL);
    
    const socketIO = io(socketURL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socketIO.on("connect", () => {
      console.log("Socket connected:", socketIO.id);
      setIsConnected(true);
    });

    socketIO.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    socketIO.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

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

### File: `src/pages/Blog.jsx`

The Blog page listens for new recipe notifications:

```javascript
export function Blog() {
  // ... other state ...
  const [notification, setNotification] = useState(null);
  const { socket } = useSocket();

  // Listen for new recipe notifications
  useEffect(() => {
    if (!socket) return;

    const handleNewRecipe = (recipe) => {
      console.log("Received new recipe notification:", recipe);
      setNotification(recipe);
      // Refresh the recipes list
      recipesQuery.refetch();
    };

    socket.on("new-recipe", handleNewRecipe);

    return () => {
      socket.off("new-recipe", handleNewRecipe);
    };
  }, [socket]);

  return (
    <div>
      {/* ... other components ... */}
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

### File: `src/components/RecipeNotification.jsx`

Displays the popup notification with recipe details:

```javascript
export function RecipeNotification({ recipe, onDismiss }) {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-dismiss after 8 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      onDismiss?.();
    }, 8000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (!isVisible) return null;

  const handleViewRecipe = () => {
    navigate(`/recipe/${recipe.id}`);
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

## How to Test

### Prerequisites
- MongoDB running on `localhost:27017`
- Backend running on `localhost:3001`
- Frontend running on `localhost:5173`

### Steps to Test Real-time Notifications

1. **Start both servers:**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Frontend
   npm run dev
   
   # Terminal 3 - MongoDB (if not already running)
   docker run -d --name recipe-mongodb -p 27017:27017 mongo:6.0.4
   ```

2. **Open two browser windows:**
   - Browser 1: `http://localhost:5173`
   - Browser 2: `http://localhost:5173`

3. **In Browser 1:**
   - Sign up as User A
   - Log in as User A

4. **In Browser 2:**
   - Sign up as User B
   - Log in as User B

5. **Create a recipe in Browser 1:**
   - Click "Add New Recipe"
   - Fill in recipe details
   - Submit

6. **Observe Browser 2:**
   - A popup notification appears with the new recipe title and author
   - Click "View Recipe" to navigate to the recipe detail page
   - Or click "Dismiss" to close the notification

7. **Check browser console:**
   - Browser 2 console should show: `Socket connected: [socket-id]`
   - Browser 2 console should show: `Received new recipe notification: {id, title, author, createdAt}`

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Socket.io Flow                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Browser 1 (User A)          Backend Server           │
│  ─────────────────           ──────────────           │
│  Creates Recipe    ──────→   POST /api/v1/recipes    │
│                              - Save to DB             │
│                              - Populate Author        │
│                              - Broadcast "new-recipe" │
│                                 event via Socket.io   │
│                              ─────────────────────    │
│                                       ↓               │
│  Browser 2 (User B)  ←─────── Socket.io              │
│  ─────────────────            "new-recipe"            │
│  Receives Notification        {id, title,             │
│  Displays Popup               author, createdAt}      │
│  Can Click to View Recipe                             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Key Features

1. **Real-time Broadcasting**: When a recipe is created, all connected clients receive a notification instantly
2. **Auto-dismiss**: Notifications auto-dismiss after 8 seconds
3. **Manual Actions**: Users can dismiss or view the recipe immediately
4. **Recipe Detail Page**: Clicking "View Recipe" navigates to `/recipe/{id}`
5. **Reconnection**: Socket.io automatically reconnects on network failures
6. **Console Logging**: Detailed logging for debugging connection and events
