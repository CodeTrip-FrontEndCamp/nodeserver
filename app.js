// app.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoutes = require("./routes/users");
const uploadRouter = require("./routes/upload");
const authRoutes = require("./routes/auth");
const articleRoutes = require("./routes/articles");
const channelRoutes = require("./routes/channels");
const authMiddleware = require("./globalhandler/jwtauth");

const app = express();

// Enable CORS
app.use(cors());
app.use(bodyParser.json());

// Public routes (no auth required)
app.use("/auth", authRoutes); // 注册登录路由
app.use("/channels", channelRoutes);

// Protected routes (auth required)
app.use(authMiddleware);
app.use("/users", userRoutes);
app.use("/upload", uploadRouter);
app.use("/mp", articleRoutes);

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
