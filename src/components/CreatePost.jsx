import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { createPost } from "../api/posts.js";
export function CreatePost() {
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [token] = useAuth();
  const queryClient = useQueryClient();
  const createPostMutation = useMutation({
    mutationFn: () => createPost(token, { 
      title, 
      contents, 
      ingredients: ingredients.split('\n').filter(i => i.trim() !== ''),
      imageUrl,
      tags: [] 
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      setTitle("");
      setContents("");
      setIngredients("");
      setImageUrl("");
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    createPostMutation.mutate();
  };
  if (!token) return <div>Please log in to create new recipes.</div>;
  return (
    <form onSubmit={handleSubmit}>
      <h2>Add New Recipe</h2>
      <div>
        <label htmlFor="create-title">Recipe Title: </label>
        <input
          type="text"
          name="create-title"
          id="create-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: '100%', padding: '5px' }}
        />{" "}
      </div>
      <br />
      <div>
        <label htmlFor="create-contents">Description: </label>
        <textarea
          name="create-contents"
          id="create-contents"
          value={contents}
          onChange={(e) => setContents(e.target.value)}
          style={{ width: '100%', minHeight: '60px', padding: '5px' }}
        />
      </div>
      <br />
      <div>
        <label htmlFor="create-ingredients">Ingredients (one per line): </label>
        <textarea
          name="create-ingredients"
          id="create-ingredients"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="2 cups flour&#10;1 cup sugar&#10;3 eggs"
          style={{ width: '100%', minHeight: '80px', padding: '5px' }}
        />
      </div>
      <br />
      <div>
        <label htmlFor="create-imageUrl">Image URL: </label>
        <input
          type="url"
          name="create-imageUrl"
          id="create-imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/recipe-image.jpg"
          style={{ width: '100%', padding: '5px' }}
        />
      </div>
      <br />
      <input
        type="submit"
        value={createPostMutation.isPending ? "Creating...." : "Create Recipe"}
        disabled={!title || !ingredients}
      />{" "}
      {createPostMutation.isSuccess ? (
        <>
          <br /> Recipe created successfully!{" "}
        </>
      ) : null}{" "}
    </form>
  );
}
