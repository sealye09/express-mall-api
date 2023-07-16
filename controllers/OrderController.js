import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

// 添加订单
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
      status: true,
    });

    user.orders.push(order._id);
    await user.save();

    return res.status(200).json({ code: 200, message: "订单添加成功", data: order });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 500, message: "服务端错误", data: {} });
  }
}

// 获取所有订单
export async function getOrders(req, res) {
  try {
    const orders = await Order.find();
    return res.status(200).json({ code: 200, message: "获取所有订单成功", data: orders });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 500, message: "服务端错误", data: {} });
  }
}

// 获取用户的订单
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

// 获取用户的订单(已取消)
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

// 获取单个订单
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

// 取消订单
export async function cancelOrder(req, res) {
  const { userId, orderId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ code: 401, message: "用户不存在", data: {} });
    }
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ code: 404, message: "订单不存在", data: {} });
    }
    order.status = false;
    await order.save();
    return res.status(200).json({ code: 200, message: "取消订单成功", data: { order } });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 500, message: "服务端错误", data: {} });
  }
}

// 删除订单
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
