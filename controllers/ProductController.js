import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Banner from "../models/Banner.js";

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Add a new product
 *     description: Add a new product to the database.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Product data to be added
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *               desc:
 *                 type: string
 *               cover:
 *                 type: string
 *               banners:
 *                 type: array
 *                 items:
 *                   type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: objectId
 *               status:
 *                 type: boolean
 *               hot:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Product created successfully.
 *       500:
 *         description: Internal server error.
 */
export async function addProduct(req, res) {
  const { ...productData } = req.body;

  try {
    const product = await Product.create(productData);
    res.status(200).json({ code: 200, message: "Create success", data: { product } });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 500, message: "Internal server error", data: {} });
  }
}

/**
 * @swagger
 * /api/products/{id}:
 *   post:
 *     summary: Update a product
 *     description: Update an existing product in the database.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the product to be updated
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Product data to be updated
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *               desc:
 *                 type: string
 *               cover:
 *                 type: string
 *               banners:
 *                 type: array
 *                 items:
 *                   type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: objectId
 *               status:
 *                 type: boolean
 *               hot:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Product updated successfully.
 *       401:
 *         description: Invalid product id.
 *       500:
 *         description: Internal server error.
 */
export async function updateProduct(req, res) {
  const { id } = req.params;
  const { ...productData } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, productData, { new: true });
    if (!updatedProduct) {
      return res.status(401).json({
        code: 401,
        message: "Invalid product id",
        data: {},
      });
    }
    res.status(200).json({
      code: 200,
      message: "Product updated successfully",
      data: { product: updatedProduct },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 500, message: "Internal server error", data: {} });
  }
}

/**
 * @swagger
 * /api/products/delete:
 *   post:
 *     summary: Delete multiple products by IDs
 *     description: Delete multiple products from the database based on their IDs.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: List of product IDs to be deleted
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: objectId
 *     responses:
 *       200:
 *         description: Products deleted successfully.
 *       500:
 *         description: Internal server error.
 */
export async function deleteProductsByIds(req, res) {
  const { ids } = req.body;
  try {
    const products = await Product.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      code: 200,
      message: "Product deleted successfully",
      data: { products },
    });
  } catch (error) {
    return res.status(500).json({ code: 500, message: "Internal server error", data: {} });
  }
}

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get paginated list of products
 *     description: Retrieve a paginated list of products from the database.
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of products per page (default 10)
 *     responses:
 *       200:
 *         description: Products fetched successfully.
 *       500:
 *         description: Internal server error.
 */
export async function getProducts(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const total = await Product.countDocuments();
    const pages = Math.ceil(total / limit);
    const offset = limit * (page - 1);

    let products = await Product.find()
      .skip(offset)
      .limit(limit)
      .populate("banners")
      .populate("categories");

    if (!products) {
      return res.status(401).json({
        code: 401,
        message: "Invalid product id",
        data: {},
      });
    }

    res
      .status(200)
      .json({ code: 200, message: "Get success", data: { page, pages, total, products } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: "Internal server error", data: {} });
  }
}

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product details by ID
 *     description: Retrieve the details of a product by its ID from the database.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the product to retrieve
 *     responses:
 *       200:
 *         description: Product details fetched successfully.
 *       401:
 *         description: Invalid product ID.
 *       500:
 *         description: Internal server error.
 */
export async function getProductById(req, res) {
  const { id } = req.params;

  try {
    let product = await Product.findById(id).populate("banners").populate("categories");
    if (!product) {
      return res.status(401).json({
        code: 401,
        message: "Invalid product id",
        data: {},
      });
    }

    res.status(200).json({ code: 200, message: "Get success", data: { product } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ code: 500, message: "Internal server error", data: {} });
  }
}

/**
 * @swagger
 * /api/products/hot:
 *   get:
 *     summary: Get hot products
 *     description: Retrieve a list of hot products from the database.
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination (optional, default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of products per page (optional, default 10)
 *     responses:
 *       200:
 *         description: Hot products fetched successfully.
 *       401:
 *         description: Invalid product ID.
 *       500:
 *         description: Internal server error.
 */
export async function getProductsByHot(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const total = await Product.countDocuments({ hot: true });
    const pages = Math.ceil(total / limit);
    const offset = limit * (page - 1);

    const products = await Product.find({ hot: true })
      .skip(offset)
      .limit(limit)
      .populate("banners")
      .populate("categories");
    if (!products) {
      return res.status(401).json({
        code: 401,
        message: "Invalid product id",
        data: {},
      });
    }

    return res.status(200).json({
      code: 200,
      message: "Get success",
      data: { total, pages, page, products },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 500, message: "Internal server error", data: {} });
  }
}

/**
 * @swagger
 * /api/products/new:
 *   get:
 *     summary: Get new products
 *     description: Retrieve a list of new products sorted by creation time from the database.
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination (optional, default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of products per page (optional, default 10)
 *     responses:
 *       200:
 *         description: New products fetched successfully.
 *       401:
 *         description: Invalid product ID.
 *       500:
 *         description: Internal server error.
 */
export async function getProductsByNew(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const total = await Product.countDocuments();
    const pages = Math.ceil(total / limit);
    const offset = limit * (page - 1);

    const products = await Product.find()
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("banners")
      .populate("categories");

    return res
      .status(200)
      .json({ code: 200, message: "Get success", data: { total, pages, page, products } });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 500, message: "Internal server error", data: {} });
  }
}

/**
 * @swagger
 * /api/products/addCats:
 *   post:
 *     summary: Add categories to a product
 *     description: Add multiple categories to a product in the database.
 *     tags: [Products]
 *     requestBody:
 *       description: Object containing product ID and an array of category IDs.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: Product ID to add categories to.
 *               categoryIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: An array of category IDs to add to the product.
 *             example:
 *               productId: 617d2132a1b7d8a0506112a1
 *               categoryIds: [ "617d2132a1b7d8a0506112a3", "617d2132a1b7d8a0506112a4" ]
 *     responses:
 *       200:
 *         description: Categories added to the product successfully.
 *       401:
 *         description: Invalid product ID.
 *       500:
 *         description: Internal server error.
 */
export async function addCategoryToProduct(req, res) {
  const { productId, categoryIds } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(401).json({
        code: 401,
        message: "Invalid product id",
        data: {},
      });
    }

    // 不能重复添加分类
    const categories = product.categories;
    const newCategories = categoryIds.filter((item) => !categories.includes(item));
    product.categories = [...categories, ...newCategories];
    await product.save();

    res.status(200).json({
      code: 200,
      message: "Add category to product successfully",
      data: { product },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ code: 500, message: "Internal server error", data: {} });
  }
}

/**
 * @swagger
 * /api/products/search:
 *   get:
 *     summary: Search products by keyword
 *     description: Get a list of products that match the search keyword.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: query
 *         name: key
 *         description: The keyword to search for products.
 *         required: false
 *         schema:
 *           type: string
 *           example: "smartphone"
 *       - in: query
 *         name: page
 *         description: The page number for pagination.
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         description: The maximum number of products to return per page.
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Successfully retrieved products.
 *       401:
 *         description: Invalid product id or product not found.
 *       500:
 *         description: Internal server error.
 */
export async function searchProducts(req, res) {
  const key = req.query.key || "";
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const total = await Product.countDocuments({ name: { $regex: key, $options: "i" } });
    const pages = Math.ceil(total / limit);
    const offset = limit * (page - 1);

    const products = await Product.find({ name: { $regex: key, $options: "i" } })
      .skip(offset)
      .limit(limit)
      .populate("banners")
      .populate("categories");

    if (!products) {
      return res.status(401).json({
        code: 401,
        message: "Invalid product id",
        data: {},
      });
    }

    return res.status(200).json({
      code: 200,
      message: "Get success",
      data: { total, pages, page, products },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 500, message: "Internal server error", data: {} });
  }
}
