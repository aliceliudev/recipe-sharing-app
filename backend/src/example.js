import { initDatabase } from "./db/init.js";
import { Recipe } from "./db/models/recipe.js";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  await initDatabase(); // wait for the database to initialize
  const recipe = new Recipe({
    title: "Alice's Famous Chocolate Cake",
    author: "Alice Liu", 
    content: "This is a delicious chocolate cake recipe.",
    ingredients: ["2 cups flour", "1 cup sugar", "3 eggs", "1/2 cup cocoa powder"],
    tags: ["sample", "recipe", "alice", "dessert"],
  });

  const createdRecipe = await recipe.save();

  await Recipe.findByIdAndUpdate(createdRecipe._id, {
    $set: { content: "This is the updated description of the sample recipe." },
    timestamps: true,
  });

  const recipes = await Recipe.find({});
  console.log("All Recipes:", recipes);
}

main().catch(console.error);
