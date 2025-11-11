import { initDatabase } from "./db/init.js";
import { Post } from "./db/models/post.js";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  await initDatabase(); // wait for the database to initialize
  const post = new Post({
    title: "Hello from Alice Liu",
    author: "Alice Liu",
    content: "This is a sample post content.",
    tags: ["sample", "post", "alice"],
  });

  const createdPost = await post.save();

  await Post.findByIdAndUpdate(createdPost._id, {
    $set: { content: "This is the updated content of the sample post." },
    timestamps: true,
  });

  const posts = await Post.find({});
  console.log("All Posts:", posts);
}

main().catch(console.error);
