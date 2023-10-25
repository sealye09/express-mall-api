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
  addCategoryToProduct,
  searchProducts,
} from "../controllers/product.controller.js";

import { addProductToCart } from "../controllers/cart.controller.js";

const router = express.Router();

// routes
// 获取商品 limit: 10, page: 1
router.get("/products", getProducts);

// 添加商品
router.post("/products", authenticateToken, addProduct);

// 删除商品
router.post("/products/delete", authenticateToken, deleteProductsByIds);

// 获取热门商品
router.get("/products/hot", getProductsByHot);

// 获取新品商品
router.get("/products/new", getProductsByNew);

// 搜索商品 key query
router.get("/products/search", searchProducts);

// 给商品添加分类
router.post("/products/addCats", authenticateToken, addCategoryToProduct);

// 获取商品详情
router.get("/products/:id", getProductById);

// 更新商品
router.post("/products/:id", authenticateToken, updateProduct);

export default router;
