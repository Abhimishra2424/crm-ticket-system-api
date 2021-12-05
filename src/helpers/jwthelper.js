var jwt = require("jsonwebtoken");

const createAccessjwt = (payload) => {
  var accessJWT = jwt.sign({ payload }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });

  return Promise.resolve(accessJWT);
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
