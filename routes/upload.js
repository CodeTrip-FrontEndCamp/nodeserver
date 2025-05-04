const express = require("express");
const client = require("../oss/client");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const mime = require("mime-types");
const path = require("path");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });


// 接收 multipart/form-data 格式文件
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "未上传文件" });
    }

    const originalName = file.originalname;
    const ext = path.extname(originalName).replace(".", "") || "bin";
    const mimeType = mime.lookup(ext) || "application/octet-stream";
    const filename = `${uuidv4()}.${ext}`;

    const headers = {
      "x-oss-storage-class": "Standard",
      "x-oss-object-acl": "private",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "x-oss-tagging": "Tag1=1&Tag2=2",
      "x-oss-forbid-overwrite": "true",
      "Content-Type": mimeType,
    };

    const result = await client.put(filename, file.buffer, { headers });

    res.json({
      message: "上传成功",
      fileName: filename,
      url: result.url,
    });
  } catch (err) {
    console.error("上传失败：", err);
    res.status(500).json({ error: "上传失败" });
  }
});

module.exports = router;
