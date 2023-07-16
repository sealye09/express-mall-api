import Banner from "../models/Banner.js";

// 获取首页轮播图
export async function getBanners(req, res) {
  try {
    const banners = await Banner.find({ status: true }).sort({ rank: -1 });
    res.status(200).json({
      code: 200,
      message: "Banner fetched successfully",
      data: { banners },
    });
  } catch (error) {
    console.error("Error getting banner:", error);
    res.status(500).json({ code: 500, message: "Internal server error", data: {} });
  }
}

// 获取所有轮播图（分页）
export async function getAllBanners(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const total = await Banner.countDocuments();
    const pages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;

    const banners = await Banner.find().sort({ rank: -1 }).skip(offset).limit(limit);
    res.status(200).json({
      code: 200,
      message: "Banner fetched successfully",
      data: { page, pages, total, banners },
    });
  } catch (error) {
    console.error("Error getting banner:", error);
    res.status(500).json({ code: 500, message: "Internal server error", data: {} });
  }
}

// 添加轮播图
export async function addBanner(req, res) {
  const { title, image, url, rank, desc } = req.body;
  try {
    const newBanner = await Banner.create({ title, image, url, rank, desc });
    res.status(200).json({
      code: 200,
      message: "Banner added successfully",
      data: { banner: newBanner },
    });
  } catch (error) {
    console.error("Error adding banner:", error);
    res.status(500).json({ code: 500, message: "Internal server error", data: {} });
  }
}

// 修改轮播图
export async function updateBanner(req, res) {
  const { id, ...banner } = req.body;
  try {
    const bannerToUpdate = await Banner.findById(id);
    if (!bannerToUpdate) {
      return res.status(401).json({ code: 401, message: "Invalid banner id", data: {} });
    }

    bannerToUpdate.title = banner.title;
    bannerToUpdate.image = banner.image;
    bannerToUpdate.url = banner.url;
    bannerToUpdate.rank = banner.rank;
    bannerToUpdate.desc = banner.desc;
    await bannerToUpdate.save();
    res.status(200).json({
      code: 200,
      message: "Banner updated successfully",
      data: { banner: bannerToUpdate },
    });
  } catch (error) {
    console.error("Error updating banner:", error);
    res.status(500).json({ code: 500, message: "Internal server error", data: {} });
  }
}

// 删除轮播图
export async function deleteBanner(req, res) {
  const { id } = req.body;
  try {
    const bannerToDelete = await Banner.findByIdAndDelete(id);
    if (!bannerToDelete) {
      return res.status(401).json({ code: 401, message: "Invalid banner id", data: {} });
    }

    res.status(200).json({
      code: 200,
      message: "Banner deleted successfully",
      data: { banner: bannerToDelete },
    });
  } catch (error) {
    console.error("Error deleting banner:", error);
    res.status(500).json({ code: 500, message: "Internal server error", data: {} });
  }
}
