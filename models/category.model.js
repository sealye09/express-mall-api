import mongoose from "mongoose";

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *           description: Category name (unique)
 *         desc:
 *           type: string
 *           description: Category description
 */
const CategorySchema = new mongoose.Schema({
  name: { type: String, unique: true },
  desc: { type: String },
});

const Category = mongoose.model("Category", CategorySchema);


export default Category;
