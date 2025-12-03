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
  const [notifications, setNotifications] = useState([]);
  const { socket, isConnected, debugInfo } = useSocket();

  const recipesQuery = useQuery({
    queryKey: [sortBy === "popularity" ? "popularRecipes" : "recipes", { author, sortBy, sortOrder }],
    queryFn: () => {
      if (sortBy === "popularity") {
        // getPopularRecipes returns descending by default, reverse if ascending
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
  
  // Listen for new recipe notifications
  useEffect(() => {
    if (!socket) {
      console.log("⚠️ Socket not available yet");
      return;
    }

    console.log("📌 Setting up listener for new-recipe events");
    
    const handleNewRecipe = (recipe) => {
      console.log("🎉 Received new recipe notification:", recipe);
      // Create a unique ID for this notification (keep recipeId separate from notification tracking)
      const notificationId = `${Date.now()}-${Math.random()}`;
      const newNotification = { ...recipe, notificationId };
      
      // Add to notifications array
      setNotifications(prev => [...prev, newNotification]);
      
      // Refresh the recipes list
      recipesQuery.refetch();
    };

    socket.on("new-recipe", handleNewRecipe);

    return () => {
      socket.off("new-recipe", handleNewRecipe);
    };
  }, [socket, recipesQuery]);

  const handleDismissNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.notificationId !== notificationId));
  };

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
      
      {/* Display all active notifications - stack vertically */}
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 999, display: 'flex', flexDirection: 'column', gap: '10px', pointerEvents: 'none' }}>
        {notifications.map((notification, index) => (
          <div key={notification.notificationId} style={{ pointerEvents: 'auto' }}>
            <RecipeNotification 
              recipe={notification} 
              onDismiss={() => handleDismissNotification(notification.notificationId)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
