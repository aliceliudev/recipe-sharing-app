import { Recipe } from "../db/models/recipe.js";
import { User } from "../db/models/user.js";

export async function createRecipe(userId, { title, contents, tags, ingredients, imageUrl }) {
  const recipe = new Recipe({ title, author: userId, content: contents, tags, ingredients, imageUrl });
  return await recipe.save();
}

async function listRecipes(
  query = {},
  { sortBy = "createdAt", sortOrder = "descending" } = {},
) {
  return await Recipe.find(query).sort({ [sortBy]: sortOrder });
}

export async function listAllRecipes(options) {
  return await listRecipes({}, options);
}

export async function listRecipesByAuthor(authorUsername, options) {
  const user = await User.findOne({ username: authorUsername });
  if (!user) return [];
  return await listRecipes({ author: user._id }, options);
}

export async function listRecipesByTag(tags, options) {
  return await listRecipes({ tags }, options);
}

export async function getRecipeById(recipeId) {
  return await Recipe.findById(recipeId);
}

export async function updateRecipe(
  userId,
  recipeId,
  { title, author, contents, tags, ingredients, imageUrl } = {},
) {
  const updateData = {};
  if (title !== undefined) updateData.title = title;
  if (author !== undefined) updateData.author = author;
  if (contents !== undefined) updateData.content = contents;
  if (tags !== undefined) updateData.tags = tags;
  if (ingredients !== undefined) updateData.ingredients = ingredients;
  if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

  return await Recipe.findOneAndUpdate(
    { _id: recipeId, author: userId },
    { $set: updateData },
    { new: true },
  );
}

export async function deleteRecipe(userId, recipeId) {
  return await Recipe.deleteOne({ _id: recipeId, author: userId });
}