const express = require("express");
const { hashPassword } = require("../helpers/bcryptPassword");
const router = express.Router();
const { insertUser } = require("../models/user/Usermodel");

router.all("/", (req, res, next) => {
  next();
});

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

module.exports = router;
