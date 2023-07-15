import Order from "../models/Order.js";

// 添加订单
export async function createOrder(req, res) {
  const { ...orderData } = req.body;

  try {
    const order = await Order.create(req.body);
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
    const orders = await Order.findById(id);
    return res.status(200).json({ code: 200, message: "获取用户订单成功", data: orders });
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
    return res.status(200).json({ code: 200, message: "获取订单成功", data: order });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 500, message: "服务端错误", data: {} });
  }
}

// 更新订单
export async function updateOrder(req, res) {
  const { id } = req.params;
  const { ...orderData } = req.body;

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ code: 404, message: "订单不存在", data: {} });
    }
    const updatedOrder = await Order.findByIdAndUpdate(id, orderData, { new: true });
    return res.status(200).json({ code: 200, message: "更新订单成功", data: updatedOrder });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 500, message: "服务端错误", data: {} });
  }
}

// 删除订单
export async function deleteOrder(req, res) {
  const { id } = req.params;

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ code: 404, message: "订单不存在", data: {} });
    }
    await Order.findByIdAndDelete(id);
    return res.status(200).json({ code: 200, message: "删除订单成功", data: {} });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 500, message: "服务端错误", data: {} });
  }
}

// 获取订单下的商品
export async function getOrderProducts(req, res) {
  const { id } = req.params;

  try {
    const order = await Order.findById(id).populate("products");
    if (!order) {
      return res.status(404).json({ code: 404, message: "订单不存在", data: {} });
    }
    return res.status(200).json({ code: 200, message: "获取订单商品成功", data: order.products });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 500, message: "服务端错误", data: {} });
  }
}
