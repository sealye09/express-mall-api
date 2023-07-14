import express from "express";
import multer from "multer";
import path from "path";

// 配置 Multer 中间件
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 指定文件保存的目录
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    // 指定文件保存的文件名
    const ext = path.extname(file.originalname);
    const filename = Date.now() + "-" + file.originalname;
    cb(null, filename);
  },
});

const upload = multer({ storage });

const router = express.Router();

// 定义文件上传的路由
router.post("/upload", upload.single("file"), (req, res) => {
  // 获取上传的文件信息
  const file = req.file;
  console.log("🚀 ~ file: upload.js:27 ~ router.post ~ req:", req);

  if (!file) {
    return res.status(400).json({ code: 400, message: "No file uploaded", data: {} });
  }

  // 构建文件的 URL
  const fileUrl = req.protocol + "://" + req.get("host") + "/uploads/" + file.filename;

  // 文件上传成功，返回文件的 URL
  res
    .status(200)
    .json({
      code: 200,
      message: "File Uploaded Successfully",
      data: { name: file.filename, url: fileUrl },
    });
});

export default router;
