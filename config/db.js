import mongoose from "mongoose";
import dotenv from "dotenv";

/* 配置 */
dotenv.config();

export const dbConnext = () => {
  return mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};
