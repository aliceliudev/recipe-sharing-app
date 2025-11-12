import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../api/users.js";

export function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  
  const signupMutation = useMutation({
    mutationFn: () => signup({ username, password }),
    onSuccess: () => {
      setSuccessMessage("Account created successfully! Redirecting to login...");
      setErrorMessage("");
      
      // Redirect after showing success message for 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    },
    onError: (error) => {
      // Extract error message from the response
      if (error.message) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Failed to sign up. Please try again.");
      }
      setSuccessMessage("");
    },
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous errors
    signupMutation.mutate();
  };
  return (
    <form onSubmit={handleSubmit}>
      <Link to="/">Back to main page</Link>
      <hr />
      <div>
        <label htmlFor="create-username">Username: </label>
        <input
          type="text"
          name="create-username"
          id="create-username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <br />
      <div>
        <label htmlFor="create-password">Password: </label>
        <input
          type="password"
          name="create-password"
          id="create-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <br />
      
      {/* Success Message */}
      {successMessage && (
        <div style={{
          marginBottom: '15px',
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
          marginBottom: '15px',
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
      
      <input
        type="submit"
        value={signupMutation.isPending ? "Signing up..." : "Sign Up"}
        disabled={!username || !password || signupMutation.isPending}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: 'bold',
          color: 'white',
          backgroundColor: signupMutation.isPending ? '#6c757d' : '#28a745',
          border: 'none',
          borderRadius: '8px',
          cursor: (!username || !password || signupMutation.isPending) ? 'not-allowed' : 'pointer',
          boxShadow: '0 4px 8px rgba(40, 167, 69, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
          transform: 'translateY(0px)',
          transition: 'all 0.2s ease',
          opacity: (!username || !password) ? 0.6 : 1
        }}
        onMouseDown={(e) => {
          if (!(!username || !password || signupMutation.isPending)) {
            e.target.style.transform = 'translateY(2px)';
            e.target.style.boxShadow = '0 2px 4px rgba(40, 167, 69, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
          }
        }}
        onMouseUp={(e) => {
          if (!(!username || !password || signupMutation.isPending)) {
            e.target.style.transform = 'translateY(0px)';
            e.target.style.boxShadow = '0 4px 8px rgba(40, 167, 69, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
          }
        }}
        onMouseLeave={(e) => {
          if (!(!username || !password || signupMutation.isPending)) {
            e.target.style.transform = 'translateY(0px)';
            e.target.style.boxShadow = '0 4px 8px rgba(40, 167, 69, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
          }
        }}
      />
    </form>
  );
}
