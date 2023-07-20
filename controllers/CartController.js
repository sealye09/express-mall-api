import Product from "../models/Product.js";
import User from "../models/User.js";

/**
 * @swagger
 * /api/cart/{id}:
 *   post:
 *     summary: Add product to user's cart
 *     description: Add a product with quantity to the user's cart.
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to add the product to the cart.
 *       - in: body
 *         name: product
 *         description: Product ID and quantity to be added to the cart.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             productId:
 *               type: string
 *             quantity:
 *               type: integer
 *         example:
 *           productId: "617d2132a1b7d8a0506112a6"
 *           quantity: 2
 *     responses:
 *       200:
 *         description: Product added to cart successfully.
 *       401:
 *         description: User or product not found.
 *       500:
 *         description: Internal server error.
 */
export async function addProductToCart(req, res) {
  const { id } = req.params;
  const { productId, quantity } = req.body;
  console.log("🚀 ~ file: CartController.js:8 ~ addProductToCart ~ productId:", productId);

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
    const cartItem = user.cart.find((item) => item.product.toString() === productId);
    console.log("🚀 ~ file: CartController.js:25 ~ addProductToCart ~ cartItem:", cartItem);

    if (cartItem) {
      // 商品已存在，增加数量
      cartItem.quantity += Number(quantity);
    } else {
      // 商品不存在，创建新的购物车项
      user.cart.push({ product: productId, quantity });
    }

    // 保存用户信息
    await user.save();

    res.status(200).json({ code: 200, message: "Product added to cart successfully", data: {} });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ code: 500, message: "Internal server error", data: {} });
  }
}

/**
 * @swagger
 * /api/cart:
 *   delete:
 *     summary: Remove product from cart
 *     description: Remove a product from the user's shopping cart.
 *     tags: [Cart]
 *     requestBody:
 *       description: The user ID and product ID to remove from the cart.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user.
 *                 example: "6151b515f785e54cc8888d9d"
 *               productId:
 *                 type: string
 *                 description: The ID of the product to remove from the cart.
 *                 example: "6151b515f785e54cc8888d9e"
 *     responses:
 *       200:
 *         description: Product removed from cart successfully.
 *       401:
 *         description: Invalid user id or user not found.
 *       500:
 *         description: Internal server error.
 */
export async function removeProductFromCart(req, res) {
  const { userId, productId } = req.body;

  try {
    let user = await User.findById(userId).populate("cart.product").exec();
    if (!user) {
      return res.status(401).json({
        code: 401,
        message: "Invalid user id",
        data: {},
      });
    }

    const updatedCart = user.cart.filter((item) => item.product._id.toString() !== productId);

    user.cart = updatedCart;
    await user.save();
    const cart = user.cart;
    console.log("🚀 ~ file: CartController.js:129 ~ removeProductFromCart ~ cart:", cart)

    res.status(200).json({
      code: 200,
      message: "Remove product from cart successfully",
      data: { cart },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ code: 500, message: "Internal server error", data: {} });
  }
}

/**
 * @swagger
 * /api/cart/{id}:
 *   get:
 *     summary: Get cart products for a user
 *     description: Get the list of products in the user's cart.
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to get the cart products.
 *     responses:
 *       200:
 *         description: Cart products retrieved successfully.
 *       401:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
export async function getCartProducts(req, res) {
  const { id } = req.params;

  try {
    let user = await User.findById(id).populate("cart.product").exec();
    if (!user) {
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
      data: { cart },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ code: 500, message: "Internal server error", data: {} });
  }
}

/**
 * @swagger
 * /api/cart:
 *   put:
 *     summary: Update cart product quantity
 *     description: Update the quantity of a product in the user's cart.
 *     tags: [Cart]
 *     requestBody:
 *       description: Request body with user ID, product ID, and new quantity.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *             example:
 *               userId: "617d2132a1b7d8a0506112a6"
 *               productId: "617d2132a1b7d8a0506112a7"
 *               quantity: 3
 *     responses:
 *       200:
 *         description: Cart product quantity updated successfully.
 *       401:
 *         description: User not found.
 *       404:
 *         description: Product not found in cart.
 *       500:
 *         description: Internal server error.
 */
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

    const cartItem = user.cart.find((item) => item.product.toString() === productId);
    if (!cartItem) {
      return res.status(404).json({
        code: 404,
        message: "Product not found in cart",
        data: {},
      });
    }

    cartItem.quantity = quantity;
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
