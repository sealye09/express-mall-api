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
router.get("/banners", getBanners);

// 获取所有轮播图
router.get("/banners/all", getAllBanners);

// 添加轮播图
router.post("/banners", authenticateToken, addBanner);

// 修改轮播图
router.put("/banners", authenticateToken, updateBanner);

// 删除轮播图
router.delete("/banners", authenticateToken, deleteBanner);

export default router;
