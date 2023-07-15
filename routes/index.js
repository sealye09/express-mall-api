import express from "express";

// routes import
import TestRoutes from "./test.js";
import UserRoutes from "./user.js";
import ProductRoutes from "./product.js";
import CategoryRoutes from "./category.js";
import CartRoutes from "./cart.js";
import OrderRoutes from "./order.js";
import BannerRoutes from "./banner.js";
import UploadRoutes from "./upload.js";

const router = express.Router();

/* 路由 */
router.use("/api", TestRoutes);
router.use("/api", UserRoutes);
router.use("/api", ProductRoutes);
router.use("/api", CategoryRoutes);
router.use("/api", CartRoutes);
router.use("/api", OrderRoutes);

router.use("/api", UploadRoutes);

export default router;
