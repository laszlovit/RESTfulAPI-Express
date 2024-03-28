const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Swagger dependencies
const swaggerUi = require("swagger-ui-express");
const yaml = require("yamljs");

// Setup Swagger
const swaggerDefinition = yaml.load("./swagger.yaml");
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDefinition));

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://react-restful-kanban.vercel.app",
    ],
  })
);
app.use(express.json());

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

require("dotenv").config();

const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on("error", (error) => {
  console.error("Database connection error:", error);
});

database.once("connected", () => {
  console.log("Database Connected");
});

app.get("/api/welcome", (req, res) => {
  res.send("Welcome to the Task Manager API");
});

const taskRoutes = require("./routes/task");
app.use("/api/tasks", taskRoutes); // Apply taskRoutes to /api/tasks

const authRoutes = require("./routes/auth");
app.use("/api/user", authRoutes);
