import express from "express";
import {
  createOrder,
  getOrders,
  getUserOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  getOrderProducts,
} from "../controllers/OrderController.js";

const router = express.Router();

// 添加订单
router.post("/orders", createOrder);

// 获取所有订单
router.get("/orders", getOrders);

// 获取用户的订单
router.get("/orders/:id", getUserOrders);

// 获取单个订单
router.get("/orders/:id", getOrder);

// 更新订单
router.post("/orders/:id", updateOrder);

// 删除订单
router.delete("/orders/:id", deleteOrder);

// 获取订单下的商品
router.get("/orders/:id/products", getOrderProducts);

export default router;
