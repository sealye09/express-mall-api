import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: { type: String, unique: true },
  desc: { type: String },
});

const Category = mongoose.model("Category", CategorySchema);


export default Category;
