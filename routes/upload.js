import express from "express";
import multer from "multer";

// 配置 Multer 中间件
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 指定文件保存的目录
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // 指定文件保存的文件名
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

const router = express.Router();

// 定义文件上传的路由
router.post("/upload", upload.single("file"), (req, res) => {
  // 获取上传的文件信息
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // 文件上传成功
  res.status(200).json({ message: "File uploaded successfully", filename: file.filename });
});

export default router;
