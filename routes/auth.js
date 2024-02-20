const express = require("express");

const router = express.Router();

const User = require("../models/user");
const { registerValidation } = require("../validation");
const bcrypt = require("bcrypt");

module.exports = router;

// /registration
router.post("/register", async (req, res) => {
  // validate the user input (name, email, password)
  const { error } = registerValidation(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // check if the email is already registered
  const emailExist = await User.findOne({ email: req.body.email });

  if (emailExist) {
    return res.status(400).json({ error: "Email already exist" });
  }

  // hash the password
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  // create a new user and save it to the db
  const userObject = new User({
    name: req.body.name,
    email: req.body.email,
    password: password,
  });

  try {
    const savedUser = await userObject.save();
    return res.status(201).json({ user: userObject._id });
  } catch (error) {
    return res.status(400).json({ error });
  }
});

// /login
router.post("/login", async (req, res) => {
  return res.status(200).json({ message: "Login route" });
});
