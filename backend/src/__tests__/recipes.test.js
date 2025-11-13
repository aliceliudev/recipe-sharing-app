import { describe, expect, test, beforeEach, beforeAll } from "@jest/globals";
import {
  createRecipe,
  listAllRecipes,
  listRecipesByAuthor,
  listRecipesByTag,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} from "../services/recipes.js";
import { Recipe } from "../db/models/recipe.js";
import { createUser } from "../services/users.js";

let testUser = null;
let sampleRecipes = [];

beforeAll(async () => {
  testUser = await createUser({ username: "sample", password: "user" });
  sampleRecipes = [
    { 
      title: "Chocolate Cake", 
      author: testUser._id, 
      tags: ["dessert", "chocolate"],
      ingredients: ["2 cups flour", "1 cup sugar", "3 eggs"]
    },
    { 
      title: "Pasta Carbonara", 
      author: testUser._id, 
      tags: ["pasta", "italian"],
      ingredients: ["400g pasta", "200g bacon", "3 eggs", "parmesan cheese"]
    },
    {
      title: "Vegetable Stir Fry",
      author: testUser._id,
      tags: ["vegetarian", "healthy"],
      ingredients: ["mixed vegetables", "soy sauce", "garlic", "ginger"]
    },
  ];
});

let createdSampleRecipes = [];

beforeEach(async () => {
  await Recipe.deleteMany({});
  createdSampleRecipes = [];
  for (const recipe of sampleRecipes) {
    const createdRecipe = new Recipe(recipe);
    createdSampleRecipes.push(await createdRecipe.save());
  }
});

describe("getting a recipe", () => {
  test("should return the full recipe", async () => {
    const recipe = await getRecipeById(createdSampleRecipes[0]._id);
    expect(recipe.toObject()).toEqual(createdSampleRecipes[0].toObject());
  });

  test("should fail if the id does not exist", async () => {
    const recipe = await getRecipeById("000000000000000000000000");
    expect(recipe).toEqual(null);
  });
});

describe("creating a recipe", () => {
  test("should return the created recipe", async () => {
    const recipe = await createRecipe(testUser._id, {
      title: "Test Recipe",
      contents: "Test recipe description",
      ingredients: ["ingredient 1", "ingredient 2"],
      tags: ["test"]
    });
    expect(recipe.title).toEqual("Test Recipe");
    expect(recipe.content).toEqual("Test recipe description");
    expect(recipe.ingredients).toEqual(["ingredient 1", "ingredient 2"]);
    expect(recipe.tags).toEqual(["test"]);
    expect(recipe.author).toEqual(testUser._id);
  });
});

describe("listing recipes", () => {
  test("should return all recipes", async () => {
    const recipes = await listAllRecipes();
    expect(recipes).toHaveLength(3);
  });

  test("should return recipes sorted by createdAt descending by default", async () => {
    const recipes = await listAllRecipes();
    expect(new Date(recipes[0].createdAt).getTime()).toBeGreaterThanOrEqual(
      new Date(recipes[1].createdAt).getTime(),
    );
  });

  test("should return recipes by author", async () => {
    const recipes = await listRecipesByAuthor("sample");
    expect(recipes).toHaveLength(3);
  });

  test("should return recipes by tag", async () => {
    const recipes = await listRecipesByTag(["dessert"]);
    expect(recipes).toHaveLength(1);
    expect(recipes[0].title).toEqual("Chocolate Cake");
  });
});

describe("updating a recipe", () => {
  test("should return the updated recipe", async () => {
    const recipe = await updateRecipe(testUser._id, createdSampleRecipes[0]._id, {
      title: "Updated Recipe Title",
    });
    expect(recipe.title).toEqual("Updated Recipe Title");
  });

  test("should fail if the user is not the author", async () => {
    const otherUser = await createUser({ username: "other", password: "user" });
    const recipe = await updateRecipe(otherUser._id, createdSampleRecipes[0]._id, {
      title: "Updated Recipe Title",
    });
    expect(recipe).toEqual(null);
  });
});

describe("deleting a recipe", () => {
  test("should delete the recipe", async () => {
    const result = await deleteRecipe(testUser._id, createdSampleRecipes[0]._id);
    expect(result.deletedCount).toEqual(1);
  });

  test("should fail if the user is not the author", async () => {
    const otherUser = await createUser({ username: "other2", password: "user" });
    const result = await deleteRecipe(otherUser._id, createdSampleRecipes[0]._id);
    expect(result.deletedCount).toEqual(0);
  });
});