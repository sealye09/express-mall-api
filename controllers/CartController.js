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
