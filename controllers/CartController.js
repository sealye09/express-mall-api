import Product from "../models/Product.js";
import User from "../models/User.js";

// 添加商品到购物车
export async function addProductToCart(req, res) {
  const { userId, products } = req.body;

  try {
    let user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        code: 401,
        message: "Invalid user id",
        data: {},
      });
    }

    // product 的 productId 为 _id
    user.cart = products;
    await user.save();

    res.status(200).json({
      code: 200,
      message: "Add product to cart successfully",
      data: { user },
    });
  } catch (error) {
    console.log(error);
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
  const { userId } = req.body;

  try {
    let user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        code: 401,
        message: "Invalid user id",
        data: {},
      });
    }

    const products = await Product.find({
      _id: { $in: user.cart.map((product) => product.productId) },
    });

    res.status(200).json({
      code: 200,
      message: "Get cart products successfully",
      data: { products },
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
