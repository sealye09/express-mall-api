import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     description: Create a new order in the database.
 *     tags: [Orders]
 *     requestBody:
 *       description: Object containing user ID, products, and address information.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID for whom the order is being created.
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       description: Product ID of the item in the order.
 *                     quantity:
 *                       type: integer
 *                       description: Quantity of the product in the order.
 *                 description: An array of products and their quantities.
 *               address:
 *                 type: string
 *                 description: Address for shipping the order (optional, will use default address if not provided).
 *             example:
 *               userId: 617d2132a1b7d8a0506112a1
 *               products: [
 *                 { productId: "617d2132a1b7d8a0506112a3", quantity: 2 },
 *                 { productId: "617d2132a1b7d8a0506112a4", quantity: 1 }
 *               ]
 *               address: "123 Main St, City, State, Zip"
 *     responses:
 *       200:
 *         description: Order created successfully.
 *       401:
 *         description: Invalid user ID or product IDs.
 *       404:
 *         description: Products not found.
 *       500:
 *         description: Internal server error.
 */
export async function createOrder(req, res) {
  const { userId, products, address } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(401).json({ code: 401, message: "用户不存在", data: {} });
  }

  // 获取产品信息并处理为包含 productId 和 quantity 的数组
  const orderProducts = await Promise.all(
    products.map(async (product) => {
      const { productId, quantity } = product;
      const foundProduct = await Product.findById(productId);
      if (!foundProduct) {
        return null; // 或者根据需求返回适当的错误信息
      }
      return { product: foundProduct._id, price: foundProduct.price, quantity: quantity };
    }),
  );

  // 过滤掉未找到的产品
  const validProducts = orderProducts.filter((product) => product !== null);

  if (validProducts.length === 0) {
    return res.status(404).json({ code: 404, message: "产品不存在", data: {} });
  }

  // 计算订单总价
  const price = validProducts.reduce((sum, product) => {
    console.log("🚀 ~ file: OrderController.js:36 ~ price ~ product:", product.price);

    return sum + product.price * product.quantity;
  }, 0);
  console.log("🚀 ~ file: OrderController.js:38 ~ price ~ price:", price);

  try {
    const order = await Order.create({
      user: userId,
      products: validProducts,
      address: address || user.default_address,
      price,
      status: "待支付",
    });

    user.orders.push(order._id);
    await user.save();

    return res.status(200).json({ code: 200, message: "订单添加成功", data: order });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 500, message: "服务端错误", data: {} });
  }
}

/**
 * @swagger
 * /api/orders/all:
 *   get:
 *     summary: Get all orders with pagination
 *     description: Retrieve a list of all orders from the database with pagination.
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: page
 *         description: The page number to retrieve (default is 1).
 *         schema:
 *           type: integer
 *         required: false
 *       - in: query
 *         name: limit
 *         description: The number of orders per page (default is 10).
 *         schema:
 *           type: integer
 *         required: false
 *     responses:
 *       200:
 *         description: List of orders fetched successfully.
 *       500:
 *         description: Internal server error.
 */
export async function getOrders(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10; // 每页显示的订单数量，默认为10个

  try {
    const total = await Order.countDocuments(); // 获取订单总数
    const pages = Math.ceil(total / limit); // 总页数
    const offset = (page - 1) * limit; // 查询偏移量

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .populate("products.product")
      .populate("user");
    return res
      .status(200)
      .json({ code: 200, message: "获取所有订单成功", data: { page, pages, total, orders } });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 500, message: "服务端错误", data: {} });
  }
}

/**
 * @swagger
 * /api/orders/user/{id}:
 *   get:
 *     summary: Get user orders
 *     description: Retrieve a list of all orders placed by a specific user.
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the user whose orders to retrieve.
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: List of user orders fetched successfully.
 *       401:
 *         description: Invalid user id.
 *       500:
 *         description: Internal server error.
 */
export async function getUserOrders(req, res) {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(401).json({ code: 401, message: "用户不存在", data: {} });
    }

    const orders = await Order.find({ user: id }).populate("products.product");

    return res.status(200).json({ code: 200, message: "获取用户订单成功", data: { orders } });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 500, message: "服务端错误", data: {} });
  }
}

/**
 * @swagger
 * /api/orders/canceled/{id}:
 *   get:
 *     summary: Get user canceled orders
 *     description: Retrieve a list of all canceled orders placed by a specific user.
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the user whose canceled orders to retrieve.
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: List of user canceled orders fetched successfully.
 *       401:
 *         description: Invalid user id.
 *       500:
 *         description: Internal server error.
 */
export async function getUserCanceledOrders(req, res) {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(401).json({ code: 401, message: "用户不存在", data: {} });
    }

    const orders = await Order.find({ user: id, status: false }).populate("products.product");

    return res.status(200).json({ code: 200, message: "获取用户订单成功", data: { orders } });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 500, message: "服务端错误", data: {} });
  }
}

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order details
 *     description: Retrieve the details of a specific order by its ID.
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the order to retrieve.
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Order details fetched successfully.
 *       404:
 *         description: Order not found.
 *       500:
 *         description: Internal server error.
 */
export async function getOrder(req, res) {
  const { id } = req.params;
  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ code: 404, message: "订单不存在", data: {} });
    }
    return res.status(200).json({ code: 200, message: "获取订单成功", data: { order } });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 500, message: "服务端错误", data: {} });
  }
}

/**
 * @description 更新订单状态 待支付，已支付，已发货，已完成，已取消
 * @swagger
 * /api/orders/update:
 *   post:
 *     summary: Update order status
 *     description: Update the status of a specific order.
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               orderId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: ["待支付", "已支付", "已发货", "已完成", "已取消"]
 *             example:
 *               userId: "617d2132a1b7d8a0506112a1"
 *               orderId: "617d2132a1b7d8a0506112a5"
 *               status: "已取消"
 *     responses:
 *       200:
 *         description: Order status updated successfully.
 *       400:
 *         description: Bad request - Invalid status.
 *       401:
 *         description: User not found.
 *       404:
 *         description: Order not found.
 *       500:
 *         description: Internal server error.
 */
export async function updateOrderStatus(req, res) {
  const constStatus = ["待支付", "已支付", "已发货", "已完成", "已取消"];
  const { userId, orderId, status } = req.body;
  if (!status) {
    return res.status(400).json({ code: 400, message: "状态不能为空", data: {} });
  }
  if (!constStatus.includes(status)) {
    return res.status(400).json({ code: 400, message: "状态不正确", data: {} });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ code: 401, message: "用户不存在", data: {} });
    }
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ code: 404, message: "订单不存在", data: {} });
    }
    order.status = status;
    await order.save();
    return res.status(200).json({ code: 200, message: "取消订单成功", data: { order } });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 500, message: "服务端错误", data: {} });
  }
}

/**
 * @swagger
 * /api/orders/delete:
 *   post:
 *     summary: Delete order
 *     description: Delete a specific order.
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               orderId:
 *                 type: string
 *             example:
 *               userId: "617d2132a1b7d8a0506112a1"
 *               orderId: "617d2132a1b7d8a0506112a5"
 *     responses:
 *       200:
 *         description: Order deleted successfully.
 *       401:
 *         description: User not found.
 *       404:
 *         description: Order not found.
 *       500:
 *         description: Internal server error.
 */
export async function deleteOrder(req, res) {
  const { userId, orderId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ code: 401, message: "用户不存在", data: {} });
    }
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
      return res.status(404).json({ code: 404, message: "订单不存在", data: {} });
    }

    // 删除订单后，删除用户的订单
    const index = user.orders.indexOf(orderId);
    if (index > -1) {
      user.orders.splice(index, 1);
    }
    await user.save();

    return res.status(200).json({ code: 200, message: "订单删除成功", data: { order } });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 500, message: "服务端错误", data: {} });
  }
}
