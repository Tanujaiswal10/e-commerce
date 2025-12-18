const orderService = require("../service/orderService");

exports.createOrder = async (req, res, next) => {
  try {
    const result = await orderService.createOrder(
      req.user.id,
      req.body.items
    );
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.orderId);
    res.json(order);
  } catch (error) {
    next(error);
  }
};

exports.getOrders = async (req, res, next) => {
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
    next(error);
  }
};

exports.cancelOrder = async (req, res, next) => {
  try {
    const result = await orderService.cancelOrder(req.params.orderId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
