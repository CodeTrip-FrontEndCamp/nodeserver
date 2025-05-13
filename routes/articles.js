const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET /mp/articles - 获取文章列表
router.get("/articles", async (req, res) => {
  try {
    const { page = 1, per_page = 10, status, channel_id } = req.query;
    const offset = (page - 1) * per_page;

    let query = "SELECT * FROM articles WHERE is_deleted = 0";
    const params = [];

    if (status) {
      query += " AND status = ?";
      params.push(status);
    }

    if (channel_id) {
      query += " AND channel_id = ?";
      params.push(channel_id);
    }

    query += " ORDER BY create_time DESC LIMIT ? OFFSET ?";
    params.push(parseInt(per_page), offset);

    const [articles] = await db.query(query, params);
    const [total] = await db.query(
      "SELECT COUNT(*) as total FROM articles WHERE is_deleted = 0"
    );

    res.json({
      message: "success",
      data: {
        results: articles,
        total_count: total[0].total,
        page: parseInt(page),
        per_page: parseInt(per_page),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /mp/articles/:id - 获取单篇文章
router.get("/articles/:id", async (req, res) => {
  try {
    const [article] = await db.query(
      "SELECT * FROM articles WHERE id = ? AND is_deleted = 0",
      [req.params.id]
    );

    if (!article.length) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.json({
      message: "success",
      data: article[0],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /mp/articles/:id - 删除文章（软删除）
router.put("/articles/:id", async (req, res) => {
  try {
    await db.query("UPDATE articles SET is_deleted = 1 WHERE id = ?", [
      req.params.id,
    ]);

    res.json({
      message: "success",
      data: null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /mp/articles/:id/review - 审核文章
router.post("/articles/:id/review", async (req, res) => {
  try {
    const { status, reason } = req.body;

    await db.query(
      "UPDATE articles SET status = ?, review_reason = ? WHERE id = ?",
      [status, reason || null, req.params.id]
    );

    res.json({
      message: "success",
      data: null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
