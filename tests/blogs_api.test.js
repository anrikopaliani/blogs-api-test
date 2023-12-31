const mongoose = require("mongoose");
const app = require("../app");
const supertest = require("supertest");
const Blog = require("../models/blog");
const helper = require("./test_helper");
const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  // const blogsArray = helper.initialBlogs.map((blog) => new Blog(blog));
  // const promiseArray = blogsArray.map((blog) => blog.save());

  // await Promise.all(promiseArray);
  await Blog.insertMany(helper.initialBlogs);
});

test("return corrent amount of blog posts", async () => {
  const response = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test("identifier of blog posts is named id", async () => {
  const response = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  expect(response.body[0].id).toBeDefined();
  expect(response.body[1].id).toBeDefined();
});

test("create a blog post", async () => {
  const newBlog = {
    title: "ragaca1",
    author: "avtori 1 ",
    likes: 3,
    url: "ragaca url 1 ",
  };

  const response = await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  const titles = blogsAtEnd.map((b) => b.title);
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
  expect(titles).toContain(newBlog.title);
});

test("if likes property is missing default to zero", async () => {
  const newBlog = {
    title: "ragaca1",
    author: "avtori 1 ",
    url: "ragaca url 1 ",
  };

  const response = await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  expect(response.body.likes).toBeDefined();
  expect(response.body.likes).toBe(0);
});

test("if url or title is missing dont create blog", async () => {
  const newBlog = {
    author: "vigaca 1",
    likes: 2,
  };

  await api.post("/api/blogs").send(newBlog).expect(400);

  const blogsAtEnd = await helper.blogsInDb();

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
});

test("delete a blog", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToDelete = blogsAtStart[0];

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

  const blogsAtEnd = await helper.blogsInDb();

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);
});

test("return a specific blog by id", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToSee = blogsAtStart[0];

  const response = await api.get(`/api/blogs/${blogToSee.id}`).expect(200);

  expect(response.body).toEqual(blogToSee);
});

test("updating a specific blog", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const newBlog = {
    title: "updated Title",
    author: "updated Author",
    likes: 5,
    url: "updated Url",
  };
  const blogToUpdate = blogsAtStart[0];

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(newBlog)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(blogsAtStart.length);
  expect(blogsAtEnd[0]).toEqual(response.body);
});

test("fails with the status code 400 if id is invalid", async () => {
  const invalidId = "dasd123)rdaf_";

  await api.get(`/api/blogs/${invalidId}`).expect(400);
});

test("fail with status code 404 if blog doesnt exist", async () => {
  const nonExistingId = await helper.nonExistingId();

  await api.get(`/api/blogs/${nonExistingId}`).expect(404);
});

afterAll(async () => {
  await mongoose.connection.close();
});
