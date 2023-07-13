import mongoose from "mongoose";

const BannerSchema = new mongoose.Schema({
  title: { type: String },
  image: { type: String },
  url: { type: String },
  rank: { type: Number },
  desc: { type: String },
  status: { type: Boolean },
});

const Banner = mongoose.model("Banner", BannerSchema);


export default Banner;
