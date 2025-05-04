// routes/users.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");
// const { v4: uuidv4 } = require("uuid");

// // 获取所有用户
// router.get("/", async (req, res) => {
//   const [rows] = await db.query("SELECT * FROM users");
//   res.json(rows);
// });

// 根据用户名获取用户
router.get("/:username", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [
    req.params.username,
  ]);
  rows.length ? res.json(rows[0]) : res.status(404).send("User not found");
});

// 根据用户名修改用户
router.put("/:username", async (req, res) => {
  const { password, nickname, avatar, role } = req.body;
  try {
    await db.query(
      `UPDATE users SET password=?, nickname=?, avatar=?, role=? WHERE username=?`,
      [password, nickname, avatar, role, req.params.username]
    );
    res.send("User updated");
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// // 添加用户
// router.post("/", async (req, res) => {
//   const { username, password, nickname, avatar, role } = req.body;
//   const id = uuidv4();
//   try {
//     await db.query(
//       "INSERT INTO users (id, username, password, nickname, avatar, role) VALUES (?, ?, ?, ?, ?, ?)",
//       [id, username, password, nickname, avatar || null, role || 0]
//     );
//     res.status(200).json({ id });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // 修改用户
// router.put("/:id", async (req, res) => {
//   const { username, password, nickname, avatar, role } = req.body;
//   try {
//     await db.query(
//       `UPDATE users SET username=?, password=?, nickname=?, avatar=?, role=? WHERE id=?`,
//       [username, password, nickname, avatar, role, req.params.id]
//     );
//     res.send("User updated");
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // 删除用户
// router.delete("/:id", async (req, res) => {
//   await db.query("DELETE FROM users WHERE id = ?", [req.params.id]);
//   res.send("User deleted");
// });

module.exports = router;
