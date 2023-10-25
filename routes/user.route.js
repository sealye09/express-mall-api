import express from "express";
import {
  register,
  login,
  getUsers,
  getUserInfo,
  updateUser,
  updatePassword,
  deleteUserByIds,
} from "../controllers/user.controller.js";
import {
  updateUserAddress,
  updateUserDefaultAddress,
  getUserAddress,
  addUserAddress,
  deleteAddress,
} from "../controllers/address.controller.js";

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
router.post("/users/update", authenticateToken, updateUser);

// 删除用户
router.post("/users/delete", authenticateToken, deleteUserByIds);

// 添加用户地址
router.post("/users/address", authenticateToken, addUserAddress);

// 获取用户地址
router.get("/users/address/:id", authenticateToken, getUserAddress);

// 修改用户地址
router.post("/users/address/update", authenticateToken, updateUserAddress);

// 修改用户默认地址
router.post("/users/address/default", authenticateToken, updateUserDefaultAddress);

// 删除用户地址
router.delete("/users/address/delete", authenticateToken, deleteAddress);

export default router;
