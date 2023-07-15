import Product from "../models/Product.js";
import User from "../models/User.js";

// 添加商品到购物车
export async function addProductToCart(req, res) {
  const { id } = req.params;
  const { productId, quantity } = req.body;

  try {
    // 检查用户是否存在
    const user = await User.findById(id);
    if (!user) {
      return res.status(401).json({ code: 401, message: "User not found", data: {} });
    }

    // 检查商品是否存在
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(401).json({ code: 401, message: "Product not found", data: {} });
    }

    // 检查购物车中是否已存在该商品
    const cartItem = user.cart.find((item) => item.productId === productId);

    if (cartItem) {
      // 商品已存在，增加数量
      cartItem.quantity += quantity;
    } else {
      // 商品不存在，创建新的购物车项
      user.cart.push({ productId, quantity });
    }

    // 保存用户信息
    await user.save();

    res.status(200).json({ code: 200, message: "Product added to cart successfully", data: {} });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ code: 500, message: "Internal server error", data: {} });
  }
}

// 将商品移除购物车
export async function removeProductFromCart(req, res) {
  const { userId, productId } = req.body;

  try {
    let user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        code: 401,
        message: "Invalid user id",
        data: {},
      });
    }

    user.cart = user.cart.filter((product) => product.productId !== productId);
    await user.save();

    res.status(200).json({
      code: 200,
      message: "Remove product from cart successfully",
      data: { user },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ code: 500, message: "Internal server error", data: {} });
  }
}

// 获取购物车商品
export async function getCartProducts(req, res) {
  const { id } = req.params;

  try {
    let user = await User.findById(id).populate("cart.product").exec();
    if (!user) {
      console.log("🚀 ~ file: CartController.js:69 ~ getCartProducts ~ user:", user);
      return res.status(401).json({
        code: 401,
        message: "Invalid user id",
        data: {},
      });
    }

    const cart = user.cart;

    res.status(200).json({
      code: 200,
      message: "Get cart products successfully",
      data: { user },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ code: 500, message: "Internal server error", data: {} });
  }
}

// 更新购物车商品数量
export async function updateCartProductQuantity(req, res) {
  const { userId, productId, quantity } = req.body;

  try {
    let user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        code: 401,
        message: "Invalid user id",
        data: {},
      });
    }

    const product = user.cart.find((product) => product.productId === productId);
    product.quantity = quantity;
    await user.save();

    res.status(200).json({
      code: 200,
      message: "Update cart product quantity successfully",
      data: { user },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ code: 500, message: "Internal server error", data: {} });
  }
}
