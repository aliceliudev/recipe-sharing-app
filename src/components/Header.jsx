import { Link } from "react-router-dom";
import { User } from "./User.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";

export function Header() {
  const [token, user, setToken] = useAuth();
  
  if (token && user) {
    return (
      <div>
        <h1>Recipe Sharing App</h1>
        Logged in as <User id={user.sub} />
        <br />
        <div style={{ marginTop: '15px' }}>
          <button 
            onClick={() => setToken(null)}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: 'bold',
              color: 'white',
              backgroundColor: '#28a745',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(40, 167, 69, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              transform: 'translateY(0px)',
              transition: 'all 0.2s ease'
            }}
            onMouseDown={(e) => {
              e.target.style.transform = 'translateY(2px)';
              e.target.style.boxShadow = '0 2px 4px rgba(40, 167, 69, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
            }}
            onMouseUp={(e) => {
              e.target.style.transform = 'translateY(0px)';
              e.target.style.boxShadow = '0 4px 8px rgba(40, 167, 69, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0px)';
              e.target.style.boxShadow = '0 4px 8px rgba(40, 167, 69, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
            }}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <h1>Recipe Sharing App</h1>
      <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
        <Link 
          to="/login"
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: '#28a745',
            border: 'none',
            borderRadius: '8px',
            textDecoration: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(40, 167, 69, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            transform: 'translateY(0px)',
            transition: 'all 0.2s ease',
            display: 'inline-block'
          }}
          onMouseDown={(e) => {
            e.target.style.transform = 'translateY(2px)';
            e.target.style.boxShadow = '0 2px 4px rgba(40, 167, 69, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
          }}
          onMouseUp={(e) => {
            e.target.style.transform = 'translateY(0px)';
            e.target.style.boxShadow = '0 4px 8px rgba(40, 167, 69, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0px)';
            e.target.style.boxShadow = '0 4px 8px rgba(40, 167, 69, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
          }}
        >
          Log In
        </Link>
        <Link 
          to="/signup"
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: '#28a745',
            border: 'none',
            borderRadius: '8px',
            textDecoration: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(40, 167, 69, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            transform: 'translateY(0px)',
            transition: 'all 0.2s ease',
            display: 'inline-block'
          }}
          onMouseDown={(e) => {
            e.target.style.transform = 'translateY(2px)';
            e.target.style.boxShadow = '0 2px 4px rgba(40, 167, 69, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
          }}
          onMouseUp={(e) => {
            e.target.style.transform = 'translateY(0px)';
            e.target.style.boxShadow = '0 4px 8px rgba(40, 167, 69, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0px)';
            e.target.style.boxShadow = '0 4px 8px rgba(40, 167, 69, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
          }}
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
