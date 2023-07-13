import Order from '../models/Order.js';


// 添加订单
export async function createOrder(req, res) {
	try {
		const order = await Order.create(req.body);
		return res.status(201).json(order);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
}


// 获取所有订单




// 获取单个订单




// 更新订单



// 删除订单
