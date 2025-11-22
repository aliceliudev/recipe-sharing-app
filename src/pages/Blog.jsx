import { RecipeList } from "../components/RecipeList.jsx";
import { CreateRecipe } from "../components/CreateRecipe.jsx";
import { RecipeFilter } from "../components/RecipeFilter.jsx";
import { RecipeSorting } from "../components/RecipeSorting.jsx";
import { Header } from "../components/Header.jsx";
import { useQuery } from "@tanstack/react-query";
import { getRecipes, getPopularRecipes } from "../api/recipes.js";
import { useState } from "react";

export function Blog() {
  const [author, setAuthor] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("descending");

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
    </div>
  );
}
