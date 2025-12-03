import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getRecipes } from "../api/recipes.js";
import { Header } from "../components/Header.jsx";
import { useState, useEffect } from "react";

export function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRecipe() {
      try {
        setLoading(true);
        console.log("🔍 Looking for recipe with ID:", id);
        const recipes = await getRecipes({});
        console.log("📦 Fetched recipes:", recipes.length);
        console.log("📋 Recipe IDs:", recipes.map(r => r._id));
        
        // Compare as strings since ObjectId toString() should work
        const foundRecipe = recipes.find((r) => String(r._id) === String(id));
        if (foundRecipe) {
          console.log("✅ Found recipe:", foundRecipe.title);
          setRecipe(foundRecipe);
        } else {
          console.log("❌ Recipe not found. Searched IDs:", recipes.map(r => r._id));
          setError("Recipe not found");
        }
      } catch (err) {
        console.error("Error fetching recipe:", err);
        setError("Failed to load recipe");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchRecipe();
    }
  }, [id]);

  if (loading) return <div style={{ padding: 20 }}>Loading recipe...</div>;
  if (error)
    return (
      <div style={{ padding: 20 }}>
        <p>{error}</p>
        <button onClick={() => navigate("/")}>Back to Recipes</button>
      </div>
    );
  if (!recipe) return <div style={{ padding: 20 }}>Recipe not found</div>;

  return (
    <div style={{ padding: 20 }}>
      <Header />
      <br />
      <hr />
      <br />
      <button onClick={() => navigate("/")} style={{ marginBottom: 20 }}>
        ← Back to Recipes
      </button>
      <div
        style={{
          maxWidth: 800,
          margin: "0 auto",
          padding: 20,
          border: "1px solid #ddd",
          borderRadius: 8,
          backgroundColor: "#f9f9f9",
        }}
      >
        {recipe.imageUrl && (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            style={{
              width: "100%",
              maxHeight: 400,
              objectFit: "cover",
              borderRadius: 8,
              marginBottom: 20,
            }}
          />
        )}
        <h1>{recipe.title}</h1>
        <p style={{ color: "#666", marginBottom: 10 }}>
          by <strong>{typeof recipe.author === 'object' ? recipe.author?.username : recipe.author}</strong>
        </p>
        <p style={{ color: "#999", fontSize: 14, marginBottom: 20 }}>
          Created: {new Date(recipe.createdAt).toLocaleDateString()}
        </p>

        <h3>Description</h3>
        <p>{recipe.content}</p>

        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <>
            <h3>Ingredients</h3>
            <ul>
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </>
        )}

        {recipe.tags && recipe.tags.length > 0 && (
          <>
            <h3>Tags</h3>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {recipe.tags.map((tag, index) => (
                <span
                  key={index}
                  style={{
                    backgroundColor: "#e0e0e0",
                    padding: "5px 10px",
                    borderRadius: 20,
                    fontSize: 14,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </>
        )}

        <p style={{ marginTop: 30, color: "#999" }}>
          👍 Likes: {recipe.likedBy?.length || 0}
        </p>
      </div>
    </div>
  );
}
