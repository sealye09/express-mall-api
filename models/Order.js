import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    // 待支付，已支付，已发货，已完成，已取消
    status: { type: String },
    price: { type: Number },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    address: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number },
      },
    ],
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", OrderSchema);

export default Order;
