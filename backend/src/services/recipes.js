// Like a recipe
export async function likeRecipe(userId, recipeId) {
  const recipe = await Recipe.findById(recipeId);
  if (!recipe) return null;
  if (!recipe.likedBy.includes(userId)) {
    recipe.likedBy.push(userId);
    await recipe.save();
  }
  return recipe;
}

// Unlike a recipe
export async function unlikeRecipe(userId, recipeId) {
  const recipe = await Recipe.findById(recipeId);
  if (!recipe) return null;
  recipe.likedBy = recipe.likedBy.filter(
    (id) => id.toString() !== userId.toString()
  );
  await recipe.save();
  return recipe;
}

// Get top recipes by like count (popularity)
export async function getTopRecipes(limit = 10) {
  return await Recipe.aggregate([
    { $addFields: { likeCount: { $size: "$likedBy" } } },
    { $sort: { likeCount: -1, createdAt: -1 } },
    { $limit: limit },
  ]);
}
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
  return await listRecipes({ tags: { $in: tags } }, options);
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