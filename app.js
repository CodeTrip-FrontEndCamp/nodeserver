// app.js
const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/users");
const uploadRouter = require("./routes/upload");
const authRoutes = require("./routes/auth");
const authMiddleware = require("./globalhandler/jwtauth");

const app = express();
app.use(bodyParser.json());

app.use(authMiddleware);

app.use("/users", userRoutes);
// 处理上传路由
app.use("/upload", uploadRouter);
app.use("/auth", authRoutes); // 注册登录路由

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
