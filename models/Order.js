import mongoose from "mongoose";

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         status:
 *           type: string
 *           description: 待支付，已支付，已发货，已完成，已取消
 *         price:
 *           type: number
 *         user:
 *           $ref: '#/components/schemas/User'
 *         address:
 *           $ref: '#/components/schemas/Address'
 *         products:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               product:
 *                 $ref: '#/components/schemas/Product'
 *               quantity:
 *                 type: number
 */
const OrderSchema = new mongoose.Schema(
  {
    // 待支付，已支付，已发货，已完成，已取消
    status: { type: String },
    price: { type: Number },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    address: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number },
      },
    ],
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", OrderSchema);

export default Order;
