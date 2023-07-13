import Category from "../models/Category.js";

// 添加分类
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

// 获取所有分类
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

// 获取分页分类
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

// 获取单个分类信息
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

// 更新分类信息
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

// 删除分类
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

// 获取分类下的所有商品
export async function getCategoryProducts(req, res) {
  const { id } = req.params;
  try {
    const category = await Category.findById(id).populate("products");
    if (!category) {
      return res.status(400).json({ code: 400, message: "分类不存在", data: {} });
    }
    return res
      .status(200)
      .json({ code: 200, message: "分类下的所有商品", data: category.products });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
}
