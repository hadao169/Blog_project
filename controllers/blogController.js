import express from "express";
const blogRouter = express.Router();
import Blog from "../models/blogSchema.js";
import User from "../models/userSchema.js";
import "express-async-errors";
import { userExtractor } from "../utils/middleware.js";

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", " -blogs");
  response.json(blogs);
});

blogRouter.post("/", userExtractor, async (request, response, next) => {
  const newBlog = new Blog(request.body);

  const user = request.user;

  // console.log("user: ", user);
  if (!newBlog.title || !newBlog.url) {
    response.status(400).json({
      error: "url or title is missing",
    });
  } else {
    newBlog.user = user.id;
    const savedBlog = await newBlog.save();
    user.blogs = user.blogs.concat(savedBlog.id);
    await user.save();
    response.status(201).json(savedBlog);
  }
});

blogRouter.delete("/:id", userExtractor, async (request, response, next) => {
  const id = request.params.id;
  const user = request.user;
  const blog = await Blog.findById(id);

  if (blog.user.toString() === user.id.toString()) {
    await Blog.deleteOne({ _id: id });
    response.status(204).end();
  } else {
    response.status(400).end();
  }
});

blogRouter.put("/:id", async (request, response) => {
  const body = request.body;
  const updatedBlog = {
    likes: body.likes,
  };

  const blog = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, {
    new: true,
  });

  response.json(blog);
});

export default blogRouter;
