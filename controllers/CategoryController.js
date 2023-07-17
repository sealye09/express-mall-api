import Category from "../models/Category.js";
import Product from "../models/Product.js";

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create category
 *     description: Create a new category.
 *     tags:
 *       - Categories
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *             example:
 *               name: "Electronics"
 *               description: "Category for electronic products"
 *     responses:
 *       201:
 *         description: Category created successfully.
 *       500:
 *         description: Internal server error.
 */
export async function createCategory(req, res) {
  const { ...data } = req.body;

  try {
    const category = await Category.create(data);
    if (category) {
      return res.status(201).json({ code: 201, message: "分类添加成功", data: category });
    } else {
      return res.status(400).json({ code: 400, message: "分类添加失败", data: {} });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
}

/**
 * @swagger
 * /api/categories/all:
 *   get:
 *     summary: Get all categories
 *     description: Get all categories with their details.
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: Categories retrieved successfully.
 *       500:
 *         description: Internal server error.
 */
export async function getAllCategories(req, res) {
  try {
    const total = await Category.countDocuments();
    const categories = await Category.find();
    return res.status(200).json({
      code: 200,
      message: "分类获取成功",
      data: {
        total,
        categories,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
}

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get paged categories
 *     description: Get paged categories with their details.
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number for pagination. Default is 1.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The number of categories per page. Default is 10.
 *     responses:
 *       200:
 *         description: Categories retrieved successfully.
 *       500:
 *         description: Internal server error.
 */
export async function getCategories(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  try {
    const total = await Category.countDocuments();
    const pages = Math.ceil(total / limit);
    const categories = await Category.find().skip(offset).limit(limit);
    return res
      .status(200)
      .json({ code: 200, message: "分类获取成功", data: { total, page, pages, categories } });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
}

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     description: Get category details by its ID.
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the category to retrieve.
 *     responses:
 *       200:
 *         description: Category retrieved successfully.
 *       400:
 *         description: Category not found.
 *       500:
 *         description: Internal server error.
 */
export async function getCategory(req, res) {
  const { id } = req.params;
  try {
    const category = await Category.findById(id);
    if (category) {
      return res.status(200).json({ code: 200, message: "分类信息", data: category });
    } else {
      return res.status(400).json({ code: 400, message: "分类不存在", data: {} });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
}

/**
 * @swagger
 * /api/categories/{id}:
 *   post:
 *     summary: Update category by ID
 *     description: Update category information by its ID.
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the category to update.
 *       - in: body
 *         name: body
 *         description: The updated category object.
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/Category'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Category updated successfully.
 *       400:
 *         description: Category not found or update failed.
 *       500:
 *         description: Internal server error.
 */
export async function updateCategory(req, res) {
  const { id } = req.params;

  try {
    const category = await Category.findByIdAndUpdate(id, req.body, { new: true });
    if (!category) {
      return res.status(400).json({ code: 400, message: "分类信息更新失败", data: {} });
    }
    return res.status(200).json({ code: 200, message: "分类信息更新成功", data: category });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
}

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete category by ID
 *     description: Delete a category by its ID.
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the category to delete.
 *     responses:
 *       200:
 *         description: Category deleted successfully.
 *       400:
 *         description: Category not found or delete failed.
 *       500:
 *         description: Internal server error.
 */
export async function deleteCategory(req, res) {
  const { id } = req.params;
  try {
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(400).json({ code: 400, message: "分类删除失败", data: {} });
    }
    return res.status(200).json({ code: 200, message: "分类删除成功", data: category });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
}

/**
 * @swagger
 * /api/categories/{id}/products:
 *   get:
 *     summary: Get products by category ID
 *     description: Retrieve all products belonging to a specific category.
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the category to retrieve products from.
 *     responses:
 *       200:
 *         description: Products retrieved successfully.
 *       400:
 *         description: Category not found or no products found in the category.
 *       500:
 *         description: Internal server error.
 */
export async function getCategoryProducts(req, res) {
  const { id } = req.params;
  try {
    const products = await Product.find({ category: id });
    const category = await Category.findById(id);
    if (!category) {
      return res.status(400).json({ code: 400, message: "分类不存在", data: {} });
    }
    return res.status(200).json({ code: 200, message: "分类下的所有商品", data: { products } });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
}
