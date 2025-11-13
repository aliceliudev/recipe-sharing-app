import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";

export const AuthContext = createContext({
  token: null,
  setToken: () => {},
  user: null,
});

// Helper function to decode JWT token
function decodeToken(token) {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

export const AuthContextProvider = ({ children }) => {
  const [token, setTokenState] = useState(null);
  const [user, setUser] = useState(null);

  const setToken = (newToken) => {
    setTokenState(newToken);
    const decodedUser = decodeToken(newToken);
    setUser(decodedUser);
  };

  useEffect(() => {
    const decodedUser = decodeToken(token);
    setUser(decodedUser);
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken, user }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthContextProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export function useAuth() {
  const { token, setToken, user } = useContext(AuthContext);
  return [token, user, setToken];
}
