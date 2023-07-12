import express from "express";
import {
  register,
  login,
  getUsers,
  getUserInfo,
  updateUser,
  updatePassword,
} from "../controllers/UserController.js";

// 中间件
import authenticateToken from "../middleware/auth.js";

const router = express.Router();

// 注册
router.post("/register", register);

// 登录
router.post("/login", login);

// 获取用户列表
router.get("/users", authenticateToken, getUsers);

// 更改密码
router.post("/users/updatePassword", authenticateToken, updatePassword);

// 获取用户信息
router.get("/users/:id", authenticateToken, getUserInfo);

// 更新用户信息
router.post("/users/:id", authenticateToken, updateUser);

export default router;
