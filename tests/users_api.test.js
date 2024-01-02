const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const app = require("../app");
const supertest = require("supertest");
const { usersInDb } = require("./test_helper");
const User = require("../models/user");

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
  const passwordHash = await bcrypt.hash("sekret", 10);
  const user = new User({ username: "first", name: "first", passwordHash });
  await user.save();
});

test("a valid user can be created", async () => {
  const usersAtStart = await usersInDb();
  const newUser = {
    username: "anri",
    name: "anri",
    password: "anri",
  };

  await api
    .post("/api/users")
    .send(newUser)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const usersAtEnd = await usersInDb();

  expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);
});

test("invalid user can not be created", async () => {
  const usersAtStart = await usersInDb();
  const newUser = {
    password: "anri",
  };
  await api
    .post("/api/users")
    .send(newUser)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  const usersAtEnd = await usersInDb();
  expect(usersAtEnd).toHaveLength(usersAtStart.length);
  expect(usersAtEnd).toEqual(usersAtStart);
});

test("creation fails if username not unique", async () => {
  const usersAtStart = await usersInDb();
  const newUser = {
    username: "first",
    name: "first",
    password: "first",
  };

  const response = await api
    .post("/api/users")
    .send(newUser)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  const usersAtEnd = await usersInDb();

  expect(response.body.error).toContain("expected `username` to be unique");
  expect(usersAtEnd).toHaveLength(usersAtStart.length);
});

afterAll(async () => {
  await mongoose.connection.close();
});
