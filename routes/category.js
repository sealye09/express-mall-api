import express from "express";
import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  getCategoryProducts,
  getAllCategories,
} from "../controllers/CategoryController.js";

const router = express.Router();

// 获取分页的分类数据
router.get("/categories", getCategories);

// 获取所有分类数据
router.get("/categories/all", getAllCategories);

// 获取分类详情
router.get("/categories/:id", getCategory);

// 获取分类下的商品
router.get("/categories/:id/products", getCategoryProducts);

// 创建分类
router.post("/categories", createCategory);

// 更新分类
router.post("/categories/:id", updateCategory);

// 删除分类
router.delete("/categories/:id", deleteCategory);

export default router;
