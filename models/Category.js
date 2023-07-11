import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: { type: String, unique: true },
  description: { type: String },
});

const Category = mongoose.model("Category", CategorySchema);
