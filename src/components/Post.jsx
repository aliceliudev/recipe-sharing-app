import PropTypes from "prop-types";
import { User } from "./User.jsx";
export function Post({ title, content, author: userId, ingredients, imageUrl }) {
  return (
    <article style={{ 
      border: '1px solid #ddd', 
      padding: '20px', 
      marginBottom: '20px',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h3>{title}</h3>
      
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
      
      {userId && (
        <em style={{ color: '#666', fontSize: '0.9em' }}>
          Recipe by <User id={userId} />
        </em>
      )}
    </article>
  );
}
Post.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  author: PropTypes.string,
  ingredients: PropTypes.arrayOf(PropTypes.string),
  imageUrl: PropTypes.string,
};
