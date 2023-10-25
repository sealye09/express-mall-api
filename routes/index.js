import express from "express";

// routes import
import TestRoutes from "./test.route.js";
import UserRoutes from "./user.route.js";
import ProductRoutes from "./product.route.js";
import CategoryRoutes from "./category.route.js";
import CartRoutes from "./cart.route.js";
import OrderRoutes from "./order.route.js";
import BannerRoutes from "./banner.route.js";
import UploadRoutes from "./upload.route.js";

const router = express.Router();

/* 路由 */
router.use("/api", TestRoutes);
router.use("/api", UserRoutes);
router.use("/api", ProductRoutes);
router.use("/api", CategoryRoutes);
router.use("/api", CartRoutes);
router.use("/api", OrderRoutes);
router.use("/api", BannerRoutes);

router.use("/api", UploadRoutes);

export default router;
