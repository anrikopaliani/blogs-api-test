const Blog = require("../models/blog");
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

module.exports = {
  initialBlogs,
  blogsInDb,
};
