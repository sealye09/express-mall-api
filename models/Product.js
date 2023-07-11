import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String },
    price: { type: Number },
    stock: { type: Number },
    desc: { type: String },
    cover: { type: String },
    banners: [{ type: mongoose.Schema.Types.ObjectId, ref: "Banner" }],
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    status: { type: Boolean },
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", ProductSchema);
