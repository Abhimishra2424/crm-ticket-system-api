const { verifyAccessJWT } = require("../helpers/jwthelper");
const { getJWT } = require("../helpers/redishelper");

const userAuthorization = async (req, res, next) => {
  const { authorization } = req.headers;

  const decoded = await verifyAccessJWT(authorization);

  if (decoded.email) {
    const userId = await getJWT(authorization);
    if (!userId) {
      return res.status(403).json({
        message: "You are not authorized to access this route",
      });
    }
    req.userId = userId;
    return next();
  }
  return res.status(403).json({
    message: "You are not authorized to access this route",
  });
};

module.exports = {
  userAuthorization,
};
