// routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const jwtConfig = require("../config/jwt");
const authMiddleware = require("../globalhandler/jwtauth");

// 登录接口 POST /authorizations
router.post("/authorizations", async (req, res) => {
  const { username, password } = req.body;

  const [users] = await db.query("SELECT * FROM users WHERE username = ?", [
    username,
  ]);
  const user = users[0];

  if (!user) return res.status(404).json({ message: "用户不存在" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "密码错误" });

  const payload = { id: user.id, username: user.username, role: user.role };

  const token = jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.accessTokenExpiresIn,
  });

  res.json({
    message: "success",
    data: {
      token,
      id: user.id,
      username: user.username,
      role: user.role,
    },
  });
});

// 获取个人信息 GET /user/profile
router.get("/user/profile", authMiddleware, async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, username, nickname, role, avatar, create_time, update_time FROM users WHERE id = ?",
      [req.user.id]
    );

    if (!users.length) {
      return res.status(404).json({ message: "用户不存在" });
    }

    res.json({
      message: "success",
      data: users[0],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 注册接口
router.post("/register", async (req, res) => {
  const { username, password, nickname, role } = req.body;

  const [user] = await db.query("SELECT * FROM users WHERE username = ?", [
    username,
  ]);
  if (user.length) return res.status(409).json({ message: "用户名已存在" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const id = uuidv4();

  await db.query(
    "INSERT INTO users (id, username, password, nickname, role) VALUES (?, ?, ?, ?, ?)",
    [id, username, hashedPassword, nickname, role || 0]
  );

  res.status(201).json({ message: "注册成功" });
});

// ✅ 刷新 Token 接口
router.post("/refresh", (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "缺少 refreshToken" });
  }

  try {
    const decoded = jwt.verify(refreshToken, jwtConfig.refreshSecret);
    const payload = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
    };
    const newAccessToken = jwt.sign(payload, jwtConfig.secret, {
      expiresIn: jwtConfig.accessTokenExpiresIn,
    });
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(401).json({ message: "无效的 refreshToken 或已过期" });
  }
});

module.exports = router;
