import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    nickname: { type: String, default: "user" },
    avatar: { type: String, default: "" },
    gender: { type: String, default: "" },
    role: { type: String, default: "user" },
    address: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
    cart: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number },
      },
    ],
    orders: [
      {
        order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
      },
    ],
  },
  // 会自动添加 createAt 和 updateAt 两个字段
  { timestamps: true },
);

const User = mongoose.model("User", UserSchema);

export default User;
