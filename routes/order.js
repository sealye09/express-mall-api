import express from "express";
import authenticateToken from "../middleware/auth.js";

import {
  createOrder,
  getOrders,
  getUserOrders,
  getOrder,
  cancelOrder,
  deleteOrder,
  getUserCanceledOrders,
} from "../controllers/OrderController.js";

const router = express.Router();

// 获取所有订单
router.get("/orders/all", authenticateToken, getOrders);

// 获取用户的所有订单
router.get("/orders/user/:id", authenticateToken, getUserOrders);

// 添加订单
router.post("/orders", authenticateToken, createOrder);

// 获取订单详情
router.get("/orders/:id", authenticateToken, getOrder);

// 取消订单
router.post("/orders/cancel", authenticateToken, cancelOrder);

// 获取用户的订单(已取消)
router.get("/orders/canceled/:id", authenticateToken, getUserCanceledOrders);

// 删除订单
router.post("/orders/delete", authenticateToken, deleteOrder);

export default router;
