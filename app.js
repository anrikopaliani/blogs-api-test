const express = require("express");
require("express-async-errors");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const { MONGODB_URI } = require("./utils/config");
const blogsRouter = require("./controllers/blogs");
const middleware = require("./utils/middleware");

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("connected to mongo"))
  .catch(() => console.log("unable to connect"));

app.use(cors());
app.use(express.json());

app.use("/api/blogs", blogsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
