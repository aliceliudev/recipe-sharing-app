/**
 * Get the backend API URL
 * Handles both local development and Codespaces public URLs
 */
export function getBackendURL() {
  const envURL = import.meta.env.VITE_BACKEND_URL;
  
  if (envURL) {
    // If .env has a URL, use it (for Codespaces/production)
    return envURL;
  }
  
  // Local development - check if we're on a Codespaces public URL
  if (window.location.hostname.includes("github.dev")) {
    // Extract the base domain without the path
    const origin = window.location.origin; // e.g., https://fictional-...-5173.app.github.dev
    const baseURL = origin.replace(":5173", ":3001").replace(/\/$/, "");
    return `${baseURL}/api/v1`;
  }
  
  // Default to localhost
  return "http://localhost:3001/api/v1";
}

/**
 * Get the Socket.io server URL
 * Used for WebSocket connections
 */
export function getSocketURL() {
  const envURL = import.meta.env.VITE_BACKEND_URL;
  
  if (envURL) {
    // Extract just the base URL without /api/v1
    return envURL.replace("/api/v1", "");
  }
  
  // Local development - check if we're on a Codespaces public URL
  if (window.location.hostname.includes("github.dev")) {
    // Extract the base domain
    const origin = window.location.origin;
    return origin.replace(":5173", ":3001");
  }
  
  // Default to localhost
  return "http://localhost:3001";
}
