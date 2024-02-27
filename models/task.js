const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Todo", "In Progress", "Backlog", "Done", "Cancelled"],
    default: "Todo",
  },
  label: {
    type: String,
    enum: ["Bug", "Documentation", "Feature"],
    default: "Feature",
  },
  priority: {
    type: String,
    enum: ["High", "Medium", "Low"],
    default: "Medium",
  },
});

const Todo = mongoose.model("Todo", todoSchema);

module.exports = {
  Todo,
  todoSchema,
};
