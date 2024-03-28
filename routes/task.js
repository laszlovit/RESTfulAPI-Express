const express = require("express");
const router = express.Router();
const { Todo } = require("../models/task");

const { auth } = require("express-oauth2-jwt-bearer");

const jwtCheck = auth({
  audience: "express-backend-kanban",
  issuerBaseURL: "https://laszlovitkai.eu.auth0.com/",
  tokenSigningAlg: "RS256",
});

module.exports = router;

// Post Method
router.post("/post", jwtCheck, async (req, res) => {
  try {
    const data = new Todo({
      title: req.body.title,
      column: req.body.column,
    });
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all Method
router.get("/getAll", async (req, res) => {
  try {
    const todos = await Todo.find({});
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get by ID Method
router.get("/getOne/:id", async (req, res) => {
  try {
    const data = await Todo.findById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update by ID Method (Modified for Column Updates)
router.put("/update/:id", jwtCheck, async (req, res) => {
  try {
    const id = req.params.id;
    const updatedColumn = req.body.column;
    const options = { new: true };

    const result = await Todo.findByIdAndUpdate(
      id,
      { column: updatedColumn },
      options
    );

    if (!result) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete by ID Method
router.delete("/delete/:id", jwtCheck, async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Todo.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.send(`Document with ${data.title} has been deleted..`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
