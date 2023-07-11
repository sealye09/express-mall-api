import express from "express";

const router = express.Router();

router.get("/test", (req, res) => {
  return res.send("test! ");
});

router.get("/hello", (req, res) => {
  return res.send("Hello World! ");
});

export default router;
