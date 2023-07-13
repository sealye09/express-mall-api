import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Banner from "../models/Banner.js";

// 添加商品
export async function addProduct(req, res) {
  const { ...productData } = req.body;
  console.log("🚀 ~ file: ProductController.js:6 ~ addProduct ~ productData:", productData);

  try {
    const product = await Product.create(productData);
    res.status(200).json({ code: 200, message: "Create success", data: { product } });
  } catch (error) {
    return res.status(500).json({ code: 500, message: "Internal server error", data: {} });
  }
}

// 更新商品
export async function updateProduct(req, res) {
  const { id } = req.params;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
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
    return res.status(500).json({ code: 500, message: "Internal server error", data: {} });
  }
}

// 删除商品
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

// 获取商品 分页
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

// 获取商品详情
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

// 获取商品列表，hot
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

    res.status(200).json({
      code: 200,
      message: "Get success",
      data: { total, pages, page, products },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 500, message: "Internal server error", data: {} });
  }
}

// 获取商品列表，按创建时间排序
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

    res
      .status(200)
      .json({ code: 200, message: "Get success", data: { total, pages, page, products } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ code: 500, message: "Internal server error", data: {} });
  }
}

// 给商品添加分类(多个分类)
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
