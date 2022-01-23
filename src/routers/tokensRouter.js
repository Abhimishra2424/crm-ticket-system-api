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
      const dBrefreshToken = userProfile.refreshJWT.token;

      tokenExp = tokenExp.setDate(
        tokenExp.getDate() + +process.env.JWT_REFRESH_SECRET_EXP_DAY
      );
      const today = new Date();

      if (dBrefreshToken !== authorization && tokenExp < today) {
        return res.status(403).json({
          message: "forbidden",
        });
      }

      const accessJWT = await createAccessjwt(
        decoded.email,
        userProfile._id.toString()
      );
      // Delete old token




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
