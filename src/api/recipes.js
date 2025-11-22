export const likeRecipe = async (token, recipeId) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/recipes/${recipeId}/like`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to like recipe");
  return await res.json();
};

export const unlikeRecipe = async (token, recipeId) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/recipes/${recipeId}/unlike`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to unlike recipe");
  return await res.json();
};

export const getPopularRecipes = async (limit = 10) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/recipes-popular?limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch popular recipes");
  return await res.json();
};
export const getRecipes = async (queryParams) => {
  // Remove empty string parameters
  const cleanParams = Object.fromEntries(
    Object.entries(queryParams).filter(([, value]) => value !== ""),
  );

  const url = `${import.meta.env.VITE_BACKEND_URL}/recipes?${new URLSearchParams(
    cleanParams,
  )}`;
  console.log("Fetching from URL:", url);
  console.log("Query params:", cleanParams);

  const res = await fetch(url);
  const data = await res.json();
  console.log("Response data length:", data.length);
  return data;
};

export const createRecipe = async (token, recipe) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/recipes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(recipe),
  });
  return await res.json();
};

export const updateRecipe = async (token, recipeId, recipe) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/recipes/${recipeId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(recipe),
  });
  if (!res.ok) throw new Error("Failed to update recipe");
  return await res.json();
};

export const deleteRecipe = async (token, recipeId) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/recipes/${recipeId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to delete recipe");
  return true;
};