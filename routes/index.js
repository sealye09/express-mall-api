import express from "express";

// routes import
import TestRoutes from "./test.js";
import UserRoutes from "./user.js";
import ProductRoutes from "./product.js";

const router = express.Router();

/* 路由 */
router.use("/api", TestRoutes);
router.use("/api", UserRoutes);
router.use("/api", ProductRoutes);

export default router;
