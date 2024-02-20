const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

require("dotenv").config();

const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});

const taskRoutes = require("./routes/task");
app.use("/api/tasks", taskRoutes);

const authRoutes = require("./routes/auth");
app.use("/api/user", authRoutes);
