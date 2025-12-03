import PropTypes from "prop-types";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "./User.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { updateRecipe, deleteRecipe, likeRecipe, unlikeRecipe } from "../api/recipes.js";

export function Recipe({ _id, title, content, author, ingredients, imageUrl, createdAt, likedBy = [] }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editContent, setEditContent] = useState(content || "");
  const [editIngredients, setEditIngredients] = useState(ingredients ? ingredients.join('\n') : "");
  const [editImageUrl, setEditImageUrl] = useState(imageUrl || "");
  const [token, user] = useAuth();
  const queryClient = useQueryClient();
  const [likePending, setLikePending] = useState(false);

  // Handle both populated author (object) and ID-only author (string)
  const authorId = typeof author === 'object' ? author?._id : author;
  const authorUsername = typeof author === 'object' ? author?.username : null;

  // Defensive: ensure user and likedBy are defined before use
  const isLiked = user && Array.isArray(likedBy) && likedBy.includes(user.sub);
  const likeCount = Array.isArray(likedBy) ? likedBy.length : 0;

  const handleLike = async () => {
    if (!token) return;
    setLikePending(true);
    try {
      if (isLiked) {
        await unlikeRecipe(token, _id);
      } else {
        await likeRecipe(token, _id);
      }
      queryClient.invalidateQueries(["recipes"]);
    } catch (e) {
      alert("Failed to update like");
    } finally {
      setLikePending(false);
    }
  };

  // Check if current user is the author
  const isAuthor = user && user.sub === authorId;
  // Debug logging (remove this later)
  // console.log('Recipe debug:', { userId, user, userSub: user?.sub, isAuthor, token: token ? 'present' : 'missing' });

  const updateRecipeMutation = useMutation({
    mutationFn: () => updateRecipe(token, _id, {
      title: editTitle,
      contents: editContent,
      ingredients: editIngredients.split('\n').filter(i => i.trim() !== ''),
      imageUrl: editImageUrl,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(["recipes"]);
      setIsEditing(false);
    },
    onError: () => alert("Failed to update recipe"),
  });

  const deleteRecipeMutation = useMutation({
    mutationFn: () => deleteRecipe(token, _id),
    onSuccess: () => {
      queryClient.invalidateQueries(["recipes"]);
    },
    onError: () => alert("Failed to delete recipe"),
  });

  const handleEdit = () => setIsEditing(true);
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle(title);
    setEditContent(content || "");
    setEditIngredients(ingredients ? ingredients.join('\n') : "");
    setEditImageUrl(imageUrl || "");
  };
  const handleSave = (e) => {
    e.preventDefault();
    updateRecipeMutation.mutate();
  };
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      deleteRecipeMutation.mutate();
    }
  };

  if (isEditing) {
    return (
      <article style={{ 
        border: '2px solid #007bff', 
        padding: '20px', 
        marginBottom: '20px',
        borderRadius: '8px',
        backgroundColor: '#f0f8ff'
      }}>
        <form onSubmit={handleSave}>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="edit-title">Recipe Title: </label>
            <input
              type="text"
              id="edit-title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              style={{ width: '100%', padding: '5px' }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="edit-content">Description: </label>
            <textarea
              id="edit-content"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              style={{ width: '100%', minHeight: '60px', padding: '5px' }}
            />
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="edit-ingredients">Ingredients (one per line): </label>
            <textarea
              id="edit-ingredients"
              value={editIngredients}
              onChange={(e) => setEditIngredients(e.target.value)}
              style={{ width: '100%', minHeight: '80px', padding: '5px' }}
            />
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="edit-imageUrl">Image URL: </label>
            <input
              type="url"
              id="edit-imageUrl"
              value={editImageUrl}
              onChange={(e) => setEditImageUrl(e.target.value)}
              style={{ width: '100%', padding: '5px' }}
            />
          </div>
          
          <div style={{ marginTop: '15px' }}>
            <button 
              type="submit" 
              disabled={updateRecipeMutation.isPending}
              style={{ marginRight: '10px', padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              {updateRecipeMutation.isPending ? "Saving..." : "Save"}
            </button>
            <button 
              type="button" 
              onClick={handleCancelEdit}
              style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </article>
    );
  }

  return (
    <article style={{ 
      border: '1px solid #ddd', 
      padding: '20px', 
      marginBottom: '20px',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
            {/* Like button and count */}
            <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
              <button
                onClick={handleLike}
                disabled={!token || likePending}
                style={{
                  marginRight: '10px',
                  padding: '6px 14px',
                  backgroundColor: 'transparent',
                  color: 'inherit',
                  border: 'none',
                  borderRadius: '50%',
                  cursor: token && !likePending ? 'pointer' : 'not-allowed',
                  fontWeight: 'bold',
                  fontSize: '1.6em',
                  lineHeight: 1,
                  transition: 'color 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label={isLiked ? 'Unlike' : 'Like'}
              >
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'color 0.2s',
                }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill={isLiked ? '#e53935' : '#9CA3AF'}
                  >
                    <path d="M12 21.35l-1.45-1.32C6.1 15.36 3 12.55 3 9.25 3 7.02 4.79 5.2 7 5.2c1.41 0 2.8.7 3.65 1.82.85-1.12 2.24-1.82 3.65-1.82 2.21 0 4 1.82 4 4.05 0 3.3-3.1 6.11-7.55 10.78L12 21.35z" />
                  </svg>
                </span>
              </button>
              <span style={{ fontSize: '1em', color: isLiked ? '#e53935' : '#9CA3AF', fontWeight: isLiked ? 'bold' : 'normal' }}>{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
            </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        {true && (
          <div>
            <button 
              onClick={handleEdit}
              disabled={!isAuthor}
              style={{ 
                marginRight: '8px', 
                padding: '8px 16px', 
                backgroundColor: isAuthor ? '#28a745' : '#ccc', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px', 
                fontSize: '12px',
                boxShadow: isAuthor ? '0 4px 8px rgba(40, 167, 69, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)' : '0 2px 4px rgba(0,0,0,0.1)',
                cursor: isAuthor ? 'pointer' : 'not-allowed',
                transform: 'translateY(0)',
                transition: 'all 0.2s ease',
                textShadow: '0 1px 2px rgba(0,0,0,0.2)'
              }}
              onMouseDown={(e) => isAuthor && (e.target.style.transform = 'translateY(1px)')}
              onMouseUp={(e) => isAuthor && (e.target.style.transform = 'translateY(0)')}
              onMouseLeave={(e) => isAuthor && (e.target.style.transform = 'translateY(0)')}
            >
              Edit
            </button>
            <button 
              onClick={handleDelete}
              disabled={deleteRecipeMutation.isPending || !isAuthor}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: isAuthor ? '#dc3545' : '#ccc', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px', 
                fontSize: '12px',
                boxShadow: isAuthor ? '0 4px 8px rgba(220, 53, 69, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)' : '0 2px 4px rgba(0,0,0,0.1)',
                cursor: isAuthor ? 'pointer' : 'not-allowed',
                transform: 'translateY(0)',
                transition: 'all 0.2s ease',
                textShadow: '0 1px 2px rgba(0,0,0,0.2)'
              }}
              onMouseDown={(e) => isAuthor && (e.target.style.transform = 'translateY(1px)')}
              onMouseUp={(e) => isAuthor && (e.target.style.transform = 'translateY(0)')}
              onMouseLeave={(e) => isAuthor && (e.target.style.transform = 'translateY(0)')}
            >
              {deleteRecipeMutation.isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        )}
      </div>
      
      {imageUrl && (
        <div style={{ marginBottom: '15px' }}>
          <img 
            src={imageUrl} 
            alt={title} 
            style={{ 
              maxWidth: '100%', 
              height: 'auto', 
              maxHeight: '300px',
              objectFit: 'cover',
              borderRadius: '4px'
            }} 
          />
        </div>
      )}
      
      {content && (
        <div style={{ marginBottom: '15px' }}>
          <strong>Description:</strong>
          <p>{content}</p>
        </div>
      )}
      
      {ingredients && ingredients.length > 0 && (
        <div style={{ marginBottom: '15px' }}>
          <strong>Ingredients:</strong>
          <ul>
            {ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
        {authorId && (
          <em style={{ color: '#666', fontSize: '0.9em' }}>
            Recipe by {authorUsername ? <strong>{authorUsername}</strong> : <User id={authorId} />}
          </em>
        )}
        {createdAt && (
          <small style={{ color: '#666' }}>
            Created: {new Date(createdAt).toLocaleDateString()}
          </small>
        )}
      </div>
      
      {/* Debug info (remove this later) */}
      <div style={{ fontSize: '10px', color: '#999', marginTop: '5px' }}>
        Debug: Author ID: {authorId}, User ID: {user?.sub}, IsAuthor: {isAuthor ? 'Yes' : 'No'}, Token: {token ? 'Present' : 'Missing'}
      </div>
    </article>
  );
}

Recipe.propTypes = {
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  author: PropTypes.string,
  ingredients: PropTypes.arrayOf(PropTypes.string),
  imageUrl: PropTypes.string,
  createdAt: PropTypes.string,
  likedBy: PropTypes.arrayOf(PropTypes.string),
};