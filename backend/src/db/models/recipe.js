import mongoose, { Schema } from "mongoose";

const recipeSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String },
    ingredients: [{ type: String }],
    imageUrl: { type: String },
    author: { type: Schema.Types.ObjectId, ref: "user", required: true },
    tags: [{ type: String }],
    likedBy: [{ type: Schema.Types.ObjectId, ref: "user" }], 
  },
  { timestamps: true },
);

export const Recipe = mongoose.model("recipe", recipeSchema);