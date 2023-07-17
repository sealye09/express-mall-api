import mongoose from "mongoose";
import bcrypt from "bcrypt";

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         username:
 *           type: string
 *         password:
 *           type: string
 *         nickname:
 *           type: string
 *         avatar:
 *           type: string
 *         gender:
 *           type: string
 *         role:
 *           type: string
 *         default_address:
 *            $ref: '#/components/schemas/Address'
 *         address:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Address'
 *         cart:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               product:
 *                  $ref: '#/components/schemas/Product'
 *               quantity:
 *                 type: number
 *         orders:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               order:
 *                 type: string
 */
const UserSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    nickname: { type: String, default: "user" },
    avatar: { type: String, default: "" },
    gender: { type: String, default: "" },
    role: { type: String, default: "user" },
    default_address: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
    address: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
    cart: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number },
      },
    ],
    orders: [
      {
        order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
      },
    ],
  },
  // 会自动添加 createAt 和 updateAt 两个字段
  { timestamps: true },
);

const User = mongoose.model("User", UserSchema);

export default User;
