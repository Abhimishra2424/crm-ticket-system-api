var jwt = require("jsonwebtoken");
const { setJWT, getJWT } = require("./redishelper");

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

const createRefreshjwt = (payload) => {
  var refreshJWT = jwt.sign({ payload }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "30d",
  });

  return Promise.resolve(refreshJWT);
};

module.exports = {
  createAccessjwt,
  createRefreshjwt,
};
