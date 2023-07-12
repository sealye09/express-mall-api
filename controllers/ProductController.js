import Product from "../models/Product.js";

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
  const { productId } = req.params;
  const { productData } = req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(productId, productData, {
      new: true,
    });
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
    Product.deleteMany({ _id: { $in: ids } }, (error, products) => {
      if (error)
        return res.status(400).json({ code: 400, message: "Error deleting products", data: {} });
      if (products) {
        return res.status(200).json({ code: 200, message: "Delete success", data: { products } });
      }
    });
  } catch (error) {
    return res.status(500).json({ code: 500, message: "Internal server error", data: {} });
  }
}

// 获取商品 分页
export async function getProducts(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  console.log("🚀 ~ file: ProductController.js:56 ~ getProducts ~  page, limit:", page, limit);

  try {
    const total = await Product.countDocuments();
    const totalPages = Math.ceil(total / limit);
    const offset = limit * (page - 1);

    const products = await Product.find().skip(offset).limit(limit);

    //     if (!!products.banners && products.banners.length > 0) {
    //       await products.populate("banners").execPopulate();
    //     }
    //
    //     if (!!products.categories && products.categories.length > 0) {
    //       await products.populate("categories").execPopulate();
    //     }

    res.status(200).json({ code: 200, message: "Get success", data: { products } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: "Internal server error", data: {} });
  }
}

// 获取商品详情
export async function getProductById(req, res) {
  const { id } = req.params;
  console.log("🚀 ~ file: ProductController.js:88 ~ getProductById ~ id:", id);

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(401).json({
        code: 401,
        message: "Invalid product id",
        data: {},
      });
    }

    if (!!product.banners && product.banners.length > 0) {
      await product.populate("banners").execPopulate();
    }
    if (!!product.categories && product.categories.length > 0) {
      await product.populate("categories").execPopulate();
    }

    res.status(200).json({ code: 200, message: "Get success", data: { product } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ code: 500, message: "Internal server error", data: {} });
  }
}

// 获取商品列表，hot max 20
export async function getProductsByHot(req, res) {
  try {
    Product.find({ hot: true })
      .limit(20)
      .populate("banners")
      .populate("categories")
      .exec((error, products) => {
        if (error)
          return res.status(400).json({ code: 400, message: "Error getting products", data: {} });
        if (products) {
          return res.status(200).json({ code: 200, message: "Get success", data: { products } });
        }
      });
  } catch (error) {
    return res.status(500).json({ code: 500, message: "Internal server error", data: {} });
  }
}

// 获取商品列表，按创建时间排序
export async function getProductsByNew(req, res) {
  try {
    Product.find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("banners", "_id img")
      .populate("categories", "_id name")
      .exec((error, products) => {
        if (error)
          return res.status(400).json({ code: 400, message: "Error getting products", data: {} });
        if (products) {
          return res.status(200).json({ code: 200, message: "Get success", data: { products } });
        }
      });
  } catch (error) {
    return res.status(500).json({ code: 500, message: "Internal server error", data: {} });
  }
}
