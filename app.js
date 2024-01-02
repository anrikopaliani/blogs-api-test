const express = require("express");
require("express-async-errors");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const { MONGODB_URI } = require("./utils/config");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const middleware = require("./utils/middleware");
const loginRouter = require("./controllers/login");

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("connected to mongo"))
  .catch(() => console.log("unable to connect"));

app.use(cors());
app.use(express.json());

app.use(middleware.tokenExtractor);

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
