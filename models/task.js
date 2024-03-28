const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  column: {
    type: String,
    default: "Backlog",
  },
});

const Todo = mongoose.model("Todo", todoSchema);

module.exports = {
  Todo,
};
