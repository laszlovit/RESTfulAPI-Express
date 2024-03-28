const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { auth } = require("express-oauth2-jwt-bearer");

const app = express();

// Swagger dependencies
const swaggerUi = require("swagger-ui-express");
const yaml = require("yamljs");

// Setup Swagger
const swaggerDefinition = yaml.load("./swagger.yaml");
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDefinition));

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());

const jwtCheck = auth({
  audience: "express-backend-kanban",
  issuerBaseURL: "https://laszlovitkai.eu.auth0.com/",
  tokenSigningAlg: "RS256",
});

// Apply JWT check to all routes except /api/tasks/getAll
app.use((req, res, next) => {
  if (req.path === "/api/tasks/getAll" || req.path === "/favicon.ico") {
    next();
  } else {
    jwtCheck(req, res, next);
  }
});

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
