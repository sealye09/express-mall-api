import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
// 读取.env文件
dotenv.config();

// 密钥
const JWT_SECRET = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
  let token = req.headers.authorization;

  if (token) {
    token = token.split(" ").pop();
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        // 验证失败
        console.error("jwt verification failed:", err);
        res.status(403).send({
          code: 403,
          message: "Invalid token!",
          data: {},
        });
      }
      // JWT验证成功，将用户信息附加到请求对象中
      req.user = decoded;
      next();
    });
  } else {
    // 请求中缺少JWT，返回未认证状态码
    res.status(401).send({
      code: 401,
      message: "Invalid token!",
      data: {},
    });
  }
}

export default authenticateToken;
