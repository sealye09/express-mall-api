import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

// 读取.env文件
dotenv.config();

// 密钥
const JWT_SECRET = process.env.JWT_SECRET;

// 注册
export async function register(req, res) {
  const { username, password } = req.body;
  try {
    // 检查用户名是否已存在
    const user = await User.findOne({ username });
    if (!!user && user.username === username) {
      return res.status(409).json({ code: 409, message: "Username already exists", data: {} });
    }

    // 生成盐并哈希密码
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 创建新用户
    const newUser = { username, password: hashedPassword };
    await User.create(newUser);

    res.status(200).json({ code: 200, message: "User registered successfully", data: {} });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ code: 500, message: "Internal server error", data: {} });
  }
}

// 登录
export async function login(req, res) {
  const { username, password } = req.body;
  try {
    // 查找用户
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ code: 401, message: "Invalid credentials", data: {} });
    }

    // 验证密码
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ code: 401, message: "Invalid credentials", data: {} });
    }

    // 生成JWT
    const token = jwt.sign({ username }, JWT_SECRET);

    res.status(200).json({ code: 200, message: "Login success", data: { user, token } });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ code: 500, message: "Internal server error", data: {} });
  }
}

// 分页查询用户列表
export async function getUsers(req, res) {
  const page = parseInt(req.query.page) || 1; // 当前页码，默认为第一页
  const limit = parseInt(req.query.limit) || 10; // 每页显示的用户数量，默认为10个

  try {
    const totalUsers = await User.countDocuments(); // 获取用户总数

    const totalPages = Math.ceil(totalUsers / limit); // 总页数
    const offset = (page - 1) * limit; // 查询偏移量

    const users = await User.find().skip(offset).limit(limit); // 查询用户数据

    res.status(200).json({
      code: 200,
      message: "Users fetched successfully",
      data: {
        page,
        pages: totalPages,
        total: totalUsers,
        users,
      },
    });
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({ code: 500, message: "Internal server error", data: {} });
  }
}

// 更新用户信息
export async function updateUser(req, res) {
  const { id, ...updateData } = req.body;
  delete updateData.password; // 禁止更新密码
  try {
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true, // 返回更新后的用户对象
    });

    if (!updatedUser) {
      return res.status(401).json({
        code: 401,
        message: "Invalid user id",
        data: {},
      });
    }

    res.status(200).json({
      code: 200,
      message: "User updated successfully",
      data: { user: updatedUser },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ code: 500, message: "Internal server error", data: {} });
  }
}

// 修改密码
export async function updatePassword(req, res) {
  const { id, oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(401).json({ code: 401, message: "Invalid user id", data: {} });
    }

    // 验证旧密码
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ code: 401, message: "Invalid old password", data: {} });
    }

    // 生成盐并哈希新密码
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 更新用户密码
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ code: 200, message: "Password updated successfully", data: {} });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ code: 500, message: "Internal server error", data: {} });
  }
}

// 获取用户信息
export async function getUserInfo(req, res) {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(401).json({ code: 401, message: "Invalid user id", data: {} });
    }
    res
      .status(200)
      .json({ code: 200, message: "User info fetched successfully", data: { user: user } });
  } catch (error) {
    console.error("Error getting user info:", error);
    res.status(500).json({ code: 500, message: "Internal server error", data: {} });
  }
}

// 删除用户
export async function deleteUserByIds(req, res) {
  const { ids } = req.body;
  try {
    await User.deleteMany({ _id: { $in: ids } });
    res.status(200).json({
      code: 200,
      message: "Users deleted successfully",
      data: {},
    });
  } catch (error) {
    console.error("Error deleting users:", error);
    res.status(500).json({ code: 500, message: "Internal server error", data: {} });
  }
}
