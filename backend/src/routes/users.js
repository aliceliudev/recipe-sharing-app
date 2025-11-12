import { createUser, loginUser, getUserInfoById } from "../services/users.js";
export function userRoutes(app) {
  app.get("/api/v1/users/:id", async (req, res) => {
    const userInfo = await getUserInfoById(req.params.id);
    return res.status(200).send(userInfo);
  });
  app.post("/api/v1/user/signup", async (req, res) => {
    try {
      const user = await createUser(req.body);
      return res.status(201).json({ username: user.username });
    } catch (err) {
      if (err.message === "USER_ALREADY_EXISTS") {
        return res.status(409).json({
          error: "A user with this username already exists. Please choose a different username.",
        });
      }
      console.error("Signup error:", err);
      return res.status(400).json({
        error: "Failed to create user account. Please try again.",
      });
    }
  });

  app.post("/api/v1/user/login", async (req, res) => {
    try {
      const token = await loginUser(req.body);
      return res.status(200).send({ token });
    } catch (err) {
      if (err.message === "USER_NOT_FOUND") {
        return res.status(404).json({
          error: "No user found with this username. Please check your username or sign up.",
        });
      }
      if (err.message === "INVALID_PASSWORD") {
        return res.status(401).json({
          error: "Incorrect password. Please try again.",
        });
      }
      console.error("Login error:", err);
      return res.status(400).json({
        error: "Login failed. Please check your credentials and try again.",
      });
    }
  });
}
