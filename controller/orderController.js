const orderService = require("../service/orderService");

exports.createOrder = async (req, res) => {
  try {
    const result = await orderService.createOrder(
      req.user.id,
      req.body.items
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.orderId);
    res.json(order);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const orders = await orderService.getOrders(
      req.user.id,
      Number(page),
      Number(limit),
      status
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const result = await orderService.cancelOrder(req.params.orderId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
