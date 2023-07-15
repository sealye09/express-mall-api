import express from "express";
import {
  createOrder,
  getOrders,
  getUserOrders,
  getOrder,
  updateOrder,
  deleteOrder,
} from "../controllers/OrderController.js";

const router = express.Router();

// 添加订单
router.post("/orders", createOrder);

// 获取所有订单
router.get("/orders/all", getOrders);

// 获取用户的所有订单
router.get("/orders/user/:id", getUserOrders);

// 获取订单详情
router.get("/orders/:id", getOrder);

// 更新订单
router.post("/orders/:id", updateOrder);

// 删除订单
router.delete("/orders/:id", deleteOrder);

export default router;
