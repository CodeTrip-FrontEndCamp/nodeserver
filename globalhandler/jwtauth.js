const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

  if (!token) {
    return res.status(401).json({ message: "未提供有效的 accessToken" });
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    req.user = decoded;
    return next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ code: "TOKEN_EXPIRED", message: "accessToken 已过期" });
    } else if (err.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ code: "TOKEN_INVALID", message: "accessToken 无效" });
    } else {
      return res.status(401).json({ message: "认证失败", error: err.message });
    }
  }
}

module.exports = authMiddleware;
