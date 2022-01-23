const express = require("express");
const router = express.Router();
const { hashPassword, comparePassword } = require("../helpers/bcryptPassword");
const { createAccessjwt, createRefreshjwt } = require("../helpers/jwthelper");
const { userAuthorization } = require("../middleware/authMiddleware");
const { setPasswordRestPin } = require("../models/resetPin/ResetPinmodel");
const {
  insertUser,
  getUserByEmail,
  getUserById,
} = require("../models/user/Usermodel");

router.all("/", (req, res, next) => {
  next();
});

// Get users profile router
router.get("/", userAuthorization, async (req, res) => {
  const _id = req.userId;

  const userProfile = await getUserById(_id);

  res.json({ user: userProfile });
});

// create new user route
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

  if (!isMatch) {
    res.json({
      status: "error",
      message: "Invalid email or password",
    });
  }

  const accessJWT = await createAccessjwt(user.email, `${user._id}`);
  const refreshJWT = await createRefreshjwt(user.email, `${user._id}`);

  res.json({
    status: "success",
    message: "User logged in successfully",
    accessJWT,
    refreshJWT,
  });
});

router.post("/reset-password", async (req, res) => {
  const { email } = req.body;

  const user = await getUserByEmail(email);

  if (user && user._id) {
    const setpin = await setPasswordRestPin(email);
    return res.json(setpin);
  }

  res.json({
    status: "error",
    message:
      "If the email is registered with us, we will send you a password reset link",
  });
});

module.exports = router;
