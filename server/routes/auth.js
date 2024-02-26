const express = require("express");

const router = express.Router();

const User = require("../models/user");
const { registerValidation, loginValidation } = require("../validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
  //validate the user input (email, password)
  const { error } = loginValidation(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // if login info is valid, find the user
  const user = await User.findOne({ email: req.body.email });

  // throw error if email is wrong (user does not exist in DB)
  if (!user) {
    return res.status(400).json({ error: "Email is wrong" });
  }

  // user exists - check for password correctness
  const validPassword = await bcrypt.compare(req.body.password, user.password);

  //throw error if password is wrong
  if (!validPassword) {
    return res.status(400).json({ message: "Password is wrong" });
  }

  //create auth token with username and id
  const token = jwt.sign(
    //payload
    {
      name: user.name,
      id: user._id,
    },
    //secret key
    process.env.TOKEN_SECRET,
    //exipration time
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
  //attach auth token to the header
  res.header("auth-token", token).json({
    error: null,
    data: { token },
  });
});
