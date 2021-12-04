const express = require("express");
const { hashPassword, comparePassword } = require("../helpers/bcryptPassword");
const router = express.Router();
const { insertUser, getUserByEmail } = require("../models/user/Usermodel");

router.all("/", (req, res, next) => {
  next();
});

// create user route
router.post("/", async (req, res) => {
  const { name, company, address, phone, email, password } = req.body; // destructuring

  try {
    //  hash password
    const hashedPass = await hashPassword(password);
    const newUserObj = {
      name,
      company,
      address,
      phone,
      email,
      password: hashedPass,
    };
    const result = await insertUser(newUserObj);
    console.log(result);
    res.json({
      message: "User created successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      statux: "error",
      message: error.message,
    });
  }
});

// user login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({
      status: "error",
      message: "email and password are required",
    });
  }
  const user = await getUserByEmail(email);
  const passfromDb = user && user._id ? user.password : null;
  if (!passfromDb) {
    return res.json({
      status: "error",
      message: "Invalid email or password",
    });
  }
  const isMatch = await comparePassword(password, passfromDb);
  console.log(isMatch);

  res.json({
    status: "success",
    message: "User logged in successfully",
  });
});

module.exports = router;
