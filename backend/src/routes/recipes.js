import {
  listAllRecipes,
  listRecipesByAuthor,
  listRecipesByTag,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipeById,
} from "../services/recipes.js";
import { requireAuth } from "../middleware/jwt.js";

export function recipesRoutes(app) {
  app.get("/api/v1/recipes", async (req, res) => {
    const { sortBy, sortOrder, author, tag } = req.query;
    const options = { sortBy, sortOrder };
    try {
      if (author && tag) {
        return res
          .status(400)
          .json({ error: "query by either author or tag, not both" });
      } else if (author) {
        return res.json(await listRecipesByAuthor(author, options));
      } else if (tag) {
        return res.json(await listRecipesByTag(tag, options));
      } else {
        return res.json(await listAllRecipes(options));
      }
    } catch (err) {
      console.error("error listing recipes", err);
      return res.status(500).end();
    }
  });

  app.get("/api/v1/recipes/:id", requireAuth, async (req, res) => {
    const { id } = req.params;
    try {
      const recipe = await getRecipeById(id);
      if (recipe === null) return res.status(404).end();
      return res.json(recipe);
    } catch (err) {
      console.error("error getting recipe", err);
      return res.status(500).end();
    }
  });

  app.post("/api/v1/recipes", requireAuth, async (req, res) => {
    try {
      const recipe = await createRecipe(req.auth.sub, req.body);
      return res.json(recipe);
    } catch (err) {
      console.error("error creating recipe", err);
      return res.status(500).end();
    }
  });

  app.patch("/api/v1/recipes/:id", requireAuth, async (req, res) => {
    try {
      const recipe = await updateRecipe(req.auth.sub, req.params.id, req.body);
      return res.json(recipe);
    } catch (err) {
      console.error("error updating recipe", err);
      return res.status(500).end();
    }
  });

  app.delete("/api/v1/recipes/:id", requireAuth, async (req, res) => {
    try {
      const { deletedCount } = await deleteRecipe(req.auth.sub, req.params.id);
      if (deletedCount === 0) return res.sendStatus(404);
      return res.status(204).end();
    } catch (err) {
      console.error("error deleting recipe", err);
      return res.status(500).end();
    }
  });
}