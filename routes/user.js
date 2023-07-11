import express from "express";
import {
  register,
  login,
  getUsers,
  getUserInfo,
  updateUser,
  updatePassword,
} from "../controllers/userController.js";

// 中间件
import authenticateToken from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/users", authenticateToken, getUsers);

router.post("/users/:id", authenticateToken, updateUser);

router.get("/users/:id", authenticateToken, getUserInfo);

router.post("/users/update", updateUser);

router.post("users/updatePassword", updatePassword);

export default router;
