import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    status: { type: String },
    price: { type: Number },
    payTime: { type: Date },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    address: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
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
