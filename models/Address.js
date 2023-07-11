import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    default: { type: Boolean },
    province: { type: String },
    city: { type: String },
    district: { type: String },
    detail: { type: String },
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", AddressSchema);
