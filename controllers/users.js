const usersRouter = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    url: 1,
    likes: 1,
    author: 1,
    id: 1,
    title: 1,
  });

  response.json(users);
});

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  if (password.length < 3) {
    return response
      .status(400)
      .json({ error: "password length should be more than 3" });
  }

  const saltRound = 10;
  const passwordHash = await bcrypt.hash(password, saltRound);

  const user = new User({
    username,
    passwordHash,
    name,
  });

  const savedUser = await user.save();
  response.status(201).json(savedUser);
});

module.exports = usersRouter;
