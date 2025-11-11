import { Post } from "../db/models/post.js";
import { User } from "../db/models/user.js";

export async function createPost(userId, { title, contents, tags, ingredients, imageUrl }) {
  const post = new Post({ title, author: userId, content: contents, tags, ingredients, imageUrl });
  return await post.save();
}

async function listPosts(
  query = {},
  { sortBy = "createdAt", sortOrder = "descending" } = {},
) {
  return await Post.find(query).sort({ [sortBy]: sortOrder });
}

export async function listAllPosts(options) {
  return await listPosts({}, options);
}

export async function listPostsByAuthor(authorUsername, options) {
  const user = await User.findOne({ username: authorUsername });
  if (!user) return [];
  return await listPosts({ author: user._id }, options);
}

export async function listPostsByTag(tags, options) {
  return await listPosts({ tags }, options);
}

export async function getPostById(postId) {
  return await Post.findById(postId);
}

export async function updatePost(
  userId,
  postId,
  { title, author, contents, tags, ingredients, imageUrl } = {},
) {
  const updateData = {};
  if (title !== undefined) updateData.title = title;
  if (author !== undefined) updateData.author = author;
  if (contents !== undefined) updateData.content = contents;
  if (tags !== undefined) updateData.tags = tags;
  if (ingredients !== undefined) updateData.ingredients = ingredients;
  if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

  return await Post.findOneAndUpdate(
    { _id: postId, author: userId },
    { $set: updateData },
    { new: true },
  );
}

export async function deletePost(userId, postId) {
  return await Post.deleteOne({ _id: postId, author: userId });
}
