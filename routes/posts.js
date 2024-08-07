const express = require("express");
const Post = require("../models/post");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/post", authMiddleware, async (req, res) => {
  const { title, content } = req.body;
  try {
    const post = new Post({
      title,
      content,
      authorId: req.user.id,
      authorName: req.user.name,
    });
    await post.save();
    res.status(201).json({ message: "Post created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Post creation failed" });
  }
});

router.get("/posts", async (req, res) => {
  try {
    const { author } = req.query;
    const filter = author ? { authorId: author } : {};
    const posts = await Post.find(filter).populate("authorId", "name email");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Fetching posts failed" });
  }
});

module.exports = router;

router.get("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate("authorId", "name email");
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(post.content);
  } catch (error) {
    res.status(500).json({ error: "Fetching post failed" });
  }
});  

