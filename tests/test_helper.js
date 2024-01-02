const Blog = require("../models/blog");
const User = require("../models/user");
const initialBlogs = [
  {
    author: "Fyodor Dostoevsky",
    title: "Crime and Punishment",
    url: "ragaca url 1",
    likes: 2,
  },
  {
    author: "Albert Camus",
    title: "The Stranger",
    url: "ragaca url 2",
    likes: 3,
  },
];

const blogsInDb = async () => {
  const response = await Blog.find({});

  return response.map((r) => r.toJSON());
};
const usersInDb = async () => {
  const response = await User.find({});

  return response.map((r) => r.toJSON());
};

const nonExistingId = async () => {
  const blog = new Blog({ title: "dsadsa", author: "dasdasd", url: "dasdas" });
  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

module.exports = {
  initialBlogs,
  blogsInDb,
  nonExistingId,
  usersInDb,
};
