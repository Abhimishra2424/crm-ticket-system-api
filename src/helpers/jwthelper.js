var jwt = require("jsonwebtoken");
const { setJWT, getJWT } = require("./redishelper");
const { storeUserRefreshJWT } = require("../models/user/Usermodel");

const createAccessjwt = async (email, _id) => {
  try {
    var accessJWT = await jwt.sign({ email }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "15m",
    });

    await setJWT(accessJWT, _id);

    return Promise.resolve(accessJWT);
  } catch (error) {
    return Promise.reject(error);
  }
};

const createRefreshjwt = async (email, _id) => {
  try {
    var refreshJWT = jwt.sign({ email }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "30d",
    });

    await storeUserRefreshJWT(_id, refreshJWT);

    return Promise.resolve(refreshJWT);
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = {
  createAccessjwt,
  createRefreshjwt,
};
