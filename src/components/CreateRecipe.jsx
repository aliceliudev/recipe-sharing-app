import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { createRecipe } from "../api/recipes.js";

export function CreateRecipe() {
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [token] = useAuth();
  const queryClient = useQueryClient();
  
  const createRecipeMutation = useMutation({
    mutationFn: () => createRecipe(token, { 
      title, 
      contents, 
      ingredients: ingredients.split('\n').filter(i => i.trim() !== ''),
      imageUrl,
      tags: [] 
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(["recipes"]);
      setTitle("");
      setContents("");
      setIngredients("");
      setImageUrl("");
      setSuccessMessage("Recipe created successfully! Your delicious recipe has been added to the community.");
      setErrorMessage("");
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    },
    onError: (error) => {
      setErrorMessage(error.message || "Failed to create recipe. Please try again.");
      setSuccessMessage("");
    },
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    createRecipeMutation.mutate();
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
        />
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
        value={createRecipeMutation.isPending ? "Creating...." : "Create Recipe"}
        disabled={!title || !ingredients}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: 'bold',
          color: 'white',
          backgroundColor: createRecipeMutation.isPending ? '#6c757d' : '#2563EB',
          border: 'none',
          borderRadius: '8px',
          cursor: (!title || !ingredients || createRecipeMutation.isPending) ? 'not-allowed' : 'pointer',
          boxShadow: '0 4px 8px rgba(37, 99, 235, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
          transform: 'translateY(0px)',
          transition: 'all 0.2s ease',
          opacity: (!title || !ingredients) ? 0.6 : 1,
          outline: 'none'
        }}
        onMouseDown={(e) => {
          if (!(!title || !ingredients || createRecipeMutation.isPending)) {
            e.target.style.transform = 'translateY(2px)';
            e.target.style.boxShadow = '0 2px 4px rgba(37, 99, 235, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
          }
        }}
        onMouseUp={(e) => {
          if (!(!title || !ingredients || createRecipeMutation.isPending)) {
            e.target.style.transform = 'translateY(0px)';
            e.target.style.boxShadow = '0 4px 8px rgba(37, 99, 235, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
          }
        }}
        onMouseEnter={(e) => {
          if (!(!title || !ingredients || createRecipeMutation.isPending)) {
            e.target.style.backgroundColor = '#1D4ED8';
          }
        }}
        onMouseLeave={(e) => {
          if (!(!title || !ingredients || createRecipeMutation.isPending)) {
            e.target.style.transform = 'translateY(0px)';
            e.target.style.boxShadow = '0 4px 8px rgba(37, 99, 235, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
            e.target.style.backgroundColor = '#2563EB';
          }
        }}
        onFocus={(e) => {
          if (!(!title || !ingredients || createRecipeMutation.isPending)) {
            e.target.style.boxShadow = '0 4px 8px rgba(37, 99, 235, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 0 0 3px rgba(59, 130, 246, 0.5)';
          }
        }}
        onBlur={(e) => {
          if (!(!title || !ingredients || createRecipeMutation.isPending)) {
            e.target.style.boxShadow = '0 4px 8px rgba(37, 99, 235, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
          }
        }}
      />
      
      {/* Success Message */}
      {successMessage && (
        <div style={{
          marginTop: '15px',
          padding: '12px 16px',
          backgroundColor: '#d4edda',
          borderLeft: '4px solid #28a745',
          borderRadius: '6px',
          color: '#155724',
          fontWeight: '500',
          boxShadow: '0 2px 4px rgba(40, 167, 69, 0.1)'
        }}>
          {successMessage}
        </div>
      )}
      
      {/* Error Message */}
      {errorMessage && (
        <div style={{
          marginTop: '15px',
          padding: '12px 16px',
          backgroundColor: '#f8d7da',
          borderLeft: '4px solid #dc3545',
          borderRadius: '6px',
          color: '#721c24',
          fontWeight: '500',
          boxShadow: '0 2px 4px rgba(220, 53, 69, 0.1)'
        }}>
          {errorMessage}
        </div>
      )}
      
      {createRecipeMutation.isSuccess ? (
        <>
          <br /> Recipe created successfully!
        </>
      ) : null}
    </form>
  );
}