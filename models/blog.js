const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String,
  },
  author: String,
  url: {
    required: true,
    type: String,
  },
  likes: Number,
});

blogSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Blog", blogSchema);
