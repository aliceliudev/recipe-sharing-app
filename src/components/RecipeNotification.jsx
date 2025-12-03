import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RecipeNotification.css";

export function RecipeNotification({ recipe, onDismiss }) {
  const navigate = useNavigate();

  const handleViewRecipe = () => {
    navigate(`/recipe/${recipe.id}`);
    onDismiss?.();
  };

  const handleDismiss = () => {
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
