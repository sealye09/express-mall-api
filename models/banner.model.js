import mongoose from "mongoose";

/**
 * @swagger
 * tags:
 *   name: Banners
 *   description: Banner management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Banner:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *           description: Banner title
 *         image:
 *           type: string
 *           description: Image URL for the banner
 *         url:
 *           type: string
 *           description: URL link for the banner
 *         rank:
 *           type: number
 *           description: Rank of the banner (optional)
 *         desc:
 *           type: string
 *           description: Description of the banner (optional)
 *         status:
 *           type: boolean
 *           description: Status of the banner
 */
const BannerSchema = new mongoose.Schema({
  title: { type: String },
  image: { type: String },
  url: { type: String },
  rank: { type: Number },
  desc: { type: String },
  status: { type: Boolean, default: true },
});

const Banner = mongoose.model("Banner", BannerSchema);

export default Banner;
