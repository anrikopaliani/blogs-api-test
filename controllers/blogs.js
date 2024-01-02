const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.post("/", async (request, response) => {
  const body = request.body;
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid!" });
  }
  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    title: body.title,
    url: body.url,
    likes: body.likes || 0,
    author: body.author,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }

  const blog = await Blog.findById(request.params.id);

  if (!blog) {
    return response.status(204).end();
  }

  if (!(blog.user.toString() === decodedToken.id)) {
    return response
      .status(401)
      .json({ error: "You do not have the permission to delete this blog." });
  }
  await Blog.findByIdAndDelete(request.params.id);

  return response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const body = request.body;
  const newBlog = await Blog.findByIdAndUpdate(request.params.id, body, {
    new: true,
  });
  response.json(newBlog);
});

module.exports = blogsRouter;
