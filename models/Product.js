import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    productName: { type: String },
    price: { type: Number },
    stock: { type: Number },
    description: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", ProductSchema);
