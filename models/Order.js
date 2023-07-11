import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    orderTime: { type: Date, default: Date.now },
    status: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number },
      },
    ],
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", OrderSchema);

export default Order;
