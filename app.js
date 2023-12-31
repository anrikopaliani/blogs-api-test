const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const { MONGODB_URI } = require("./utils/config");

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("connected to mongo"))
  .catch(() => console.log("unable to connect"));

app.use(cors());
app.use(express.json());

module.exports = app;
