import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Blog } from "./pages/Blog.jsx";
import { RecipeDetail } from "./pages/RecipeDetail.jsx";
import { Signup } from "./pages/Signup.jsx";
import { Login } from "./pages/Login.jsx";
import { AuthContextProvider } from "./contexts/AuthContext.jsx";
import { SocketContextProvider } from "./contexts/SocketContext.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <Blog />,
  },
  {
    path: "/recipe/:id",
    element: <RecipeDetail />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SocketContextProvider>
        <AuthContextProvider>
          <RouterProvider router={router} />
        </AuthContextProvider>
      </SocketContextProvider>
    </QueryClientProvider>
  );
}
