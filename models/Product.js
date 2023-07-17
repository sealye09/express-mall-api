import mongoose from "mongoose";

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         stock:
 *           type: number
 *         desc:
 *           type: string
 *         cover:
 *           type: string
 *         banners:
 *           type: array
 *           items:
 *             type: string
 *         categories:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Category'
 *         status:
 *           type: boolean
 *         hot:
 *           type: boolean
 */
const ProductSchema = new mongoose.Schema(
  {
    name: { type: String },
    price: { type: Number },
    stock: { type: Number },
    desc: { type: String },
    cover: { type: String },
    banners: [{ type: String }],
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    status: { type: Boolean },
    hot: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", ProductSchema);

export default Product;
