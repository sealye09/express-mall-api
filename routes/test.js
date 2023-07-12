import express from "express";

const router = express.Router();

router.get("/test", (req, res) => {
  return res.status(200).json({ code: 200, message: "Test success", data: "test! " });
});

export default router;
