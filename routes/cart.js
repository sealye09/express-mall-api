import express from "express";
import authenticateToken from "../middleware/auth.js";

import {
  addProductToCart,
  removeProductFromCart,
  getCartProducts,
  updateCartProductQuantity,
} from "../controllers/CartController.js";

const router = express.Router();

// 获取购物车商品
router.get("/cart", authenticateToken, getCartProducts);

// 添加到购物车
router.post("/cart", authenticateToken, addProductToCart);

// 从购物车移除
router.delete("/cart", authenticateToken, removeProductFromCart);

// 更新购物车商品数量
router.put("/cart", authenticateToken, updateCartProductQuantity);

export default router;
