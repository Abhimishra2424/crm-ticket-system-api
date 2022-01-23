const express = require("express");
const { verifyRefreshJWT, createAccessjwt } = require("../helpers/jwthelper");
const { getUserByEmail } = require("../models/user/Usermodel");
const router = express.Router();

router.get("/", async (req, res) => {
  const { authorization } = req.headers;

  const decoded = await verifyRefreshJWT(authorization);
  if (decoded.email) {
    const userProfile = await getUserByEmail(decoded.email);

    if (userProfile._id) {
      let tokenExp = userProfile.refreshJWT.addedAt;

      tokenExp = tokenExp.setDate(
        tokenExp.getDate() + +process.env.JWT_REFRESH_SECRET_EXP_DAY
      );
      const today = new Date();

      if (tokenExp < today) {
        return res.status(403).json({
          message: "forbidden",
        });
      }

      const accessJWT = await createAccessjwt(
        decoded.email,
        userProfile._id.toString()
      );

      return res.json({
        status: "success",
        accessJWT,
      });
    }
  }
  res.status(403).json({
    message: "forbidden",
  });
});

module.exports = router;
