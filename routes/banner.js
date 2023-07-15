import express from "express";
import authenticateToken from "../middleware/auth.js";

import {
  getBanners,
  addBanner,
  updateBanner,
  deleteBanner,
  getAllBanners,
} from "../controllers/BannerController.js";

const router = express.Router();

// 轮播图
router.get("/api/banners", getBanners);

// 获取所有轮播图
router.get("/api/banners/all", getAllBanners);

// 添加轮播图
router.post("/api/banners", authenticateToken, addBanner);

// 修改轮播图
router.put("/api/banners", authenticateToken, updateBanner);

// 删除轮播图
router.delete("/api/banners", authenticateToken, deleteBanner);

export default router;
