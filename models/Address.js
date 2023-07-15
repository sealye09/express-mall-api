import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    detail: { type: String },
  },
  { timestamps: true },
);

const Address = mongoose.model("Address", AddressSchema);

export default Address;
