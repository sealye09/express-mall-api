import Banner from "../models/Banner.js";

/**
 * @swagger
 * /api/banners:
 *   get:
 *     summary: Get home page banners
 *     description: Retrieve the home page banners that are currently active, sorted by rank.
 *     tags: [Banners]
 *     responses:
 *       200:
 *         description: Banners fetched successfully.
 *       500:
 *         description: Internal server error.
 */
export async function getBanners(req, res) {
  try {
    const banners = await Banner.find({ status: true }).sort({ rank: -1 }).limit(5);
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

/**
 * @description 获取所有轮播图（分页）
 * @swagger
 * /api/banners/all:
 *   get:
 *     summary: Get all banners (paginated)
 *     description: Get a list of all banners with pagination.
 *     tags: [Banners]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           description: Page number for pagination (default 1).
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           description: Number of banners per page (default 10).
 *     responses:
 *       200:
 *         description: List of banners fetched successfully.
 *       500:
 *         description: Internal server error.
 */
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

/**
 * @swagger
 * /api/banners:
 *   post:
 *     summary: Add a new banner
 *     description: Add a new banner to the database.
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Banner object to be added
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "New Banner"
 *               image:
 *                 type: string
 *                 example: "https://example.com/banner.jpg"
 *               url:
 *                 type: string
 *                 example: "https://example.com"
 *               rank:
 *                 type: integer
 *                 example: 1
 *               desc:
 *                 type: string
 *                 example: "Banner description"
 *     responses:
 *       200:
 *         description: Banner added successfully.
 *       500:
 *         description: Internal server error.
 */
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

/**
 * @swagger
 * /api/banners:
 *   put:
 *     summary: Update a banner
 *     description: Update an existing banner in the database.
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Banner object to be updated
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "615c3f3b9a8a165d38d82d52"
 *               title:
 *                 type: string
 *                 example: "Updated Banner"
 *               image:
 *                 type: string
 *                 example: "https://example.com/updated_banner.jpg"
 *               url:
 *                 type: string
 *                 example: "https://example.com/updated"
 *               rank:
 *                 type: integer
 *                 example: 2
 *               desc:
 *                 type: string
 *                 example: "Updated banner description"
 *     responses:
 *       200:
 *         description: Banner updated successfully.
 *       500:
 *         description: Internal server error.
 */
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

/**
 * @swagger
 * /api/banners:
 *   delete:
 *     summary: Delete a banner
 *     description: Delete an existing banner from the database.
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Banner ID to be deleted
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "615c3f3b9a8a165d38d82d52"
 *     responses:
 *       200:
 *         description: Banner deleted successfully.
 *       401:
 *         description: Invalid banner id.
 *       500:
 *         description: Internal server error.
 */
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
