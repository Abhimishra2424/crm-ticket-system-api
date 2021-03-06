const express = require("express");
const router = express.Router();
const { hashPassword, comparePassword } = require("../helpers/bcryptPassword");
const { emailProcessor } = require("../helpers/emailhelper");
const { createAccessjwt, createRefreshjwt } = require("../helpers/jwthelper");
const { deleteJWT } = require("../helpers/redishelper");
const { userAuthorization } = require("../middleware/authMiddleware");
const {
  resetPassReqValidation,
  updatePassValidation,
} = require("../middleware/formValidationMiddleware");
const {
  setPasswordRestPin,
  getPinByEmailPin,
  deletePin,
} = require("../models/resetPin/ResetPinmodel");
const {
  insertUser,
  getUserByEmail,
  getUserById,
  updatePassword,
  storeUserRefreshJWT,
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

router.post("/reset-password", resetPassReqValidation, async (req, res) => {
  const { email } = req.body;

  const user = await getUserByEmail(email);

  if (user && user._id) {
    const setPin = await setPasswordRestPin(email);
    await emailProcessor({
      email,
      pin: setPin.pin,
      type: "request-new-password",
    });

    return res.json({
      status: "success",
      message:
        "If the email is exist in our database, the password reset pin will be sent shortly.",
    });
  }

  res.json({
    status: "error",
    message:
      "If the email is exist in our database, the password reset pin will be sent shortly.",
  });
});

router.patch("/reset-password", updatePassValidation, async (req, res) => {
  const { email, pin, password } = req.body;
  const getPin = await getPinByEmailPin(email, pin);
  if (getPin._id) {
    const dbDate = getPin.addedAt;
    const expiresIn = 1;
    let expDate = dbDate.setDate(dbDate.getDate() + expiresIn);
    const today = new Date();
    if (today > expDate) {
      return res.json({
        status: "error",
        message: "Pin expired",
      });
    }
    // encrypt new password
    const hashedPass = await hashPassword(password);
    const user = await updatePassword(email, hashedPass);
    if (user._id) {
      await emailProcessor({ email, type: "password-update-success" });

      deletePin(email, pin);

      return res.json({
        status: "success",
        message: "Password updated successfully",
      });
    }
  }

  res.json({
    status: "error",
    message: "Unable to update passsword",
  });
});

// User logout and invalidate jwts

router.delete("/logout", userAuthorization, async (req, res) => {
  const { authorization } = req.headers;
  //this data coming form database
  const _id = req.userId;

  // 2. delete accessJWT from redis database
  deleteJWT(authorization);

  // 3. delete refreshJWT from mongodb
  const result = await storeUserRefreshJWT(_id, "");

  if (result._id) {
    return res.json({ status: "success", message: "Loged out successfully" });
  }

  res.json({
    status: "error",
    message: "Unable to logg you out, plz try again later",
  });
});
module.exports = router;
