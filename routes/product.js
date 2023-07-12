import express from "express";

import authenticateToken from "../middleware/auth.js";

import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProductsByIds,
  getProductById,
  getProductsByHot,
  getProductsByNew,
} from "../controllers/ProductController.js";

const router = express.Router();

// routes
// 获取商品 limit: 10, page: 1
router.get("/products", getProducts);

// 获取商品详情
router.get("/products/:id", getProductById);

// 添加商品
router.post("/products", authenticateToken, addProduct);

// 更新商品
router.post("/products/:id", authenticateToken, updateProduct);

// 删除商品
router.post("/products/delete", authenticateToken, deleteProductsByIds);

export default router;
