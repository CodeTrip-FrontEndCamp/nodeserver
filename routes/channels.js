const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET /channels - 获取频道列表
router.get("/", async (req, res) => {
  try {
    const [channels] = await db.query(
      "SELECT * FROM channels WHERE is_deleted = 0"
    );

    res.json({
      message: "success",
      data: channels,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
