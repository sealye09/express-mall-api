import express from "express";
import authenticateToken from "../middleware/auth.js";

import { addProductToCart } from "../controllers/CartController.js";

const router = express.Router();

// 添加到购物车
router.post("/cart/update", authenticateToken, addProductToCart);

export default router;
