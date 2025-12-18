const db = require("../config/db");
const cache = require("../utils/cache");

const simulatePayment = () => {
  return Math.random() > 0.3;
};

exports.createOrder = async (userId, items) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    for (let item of items) {
      const [[product]] = await conn.query(
        "SELECT stock FROM inventory WHERE id = ?",
        [item.inventory_id]
      );

      if (!product || product.stock < item.quantity) {
        const err = new Error("Insufficient stock");
        err.statusCode = 400;
        throw err;
      }
    }

    const [orderResult] = await conn.query(
      "INSERT INTO orders (user_id, status) VALUES (?, 'CREATED')",
      [userId]
    );

    const orderId = orderResult.insertId;

    for (let item of items) {
      await conn.query(
        "UPDATE inventory SET stock = stock - ? WHERE id = ?",
        [item.quantity, item.inventory_id]
      );

      await conn.query(
        "INSERT INTO order_items (order_id, inventory_id, quantity) VALUES (?, ?, ?)",
        [orderId, item.inventory_id, item.quantity]
      );
    }

    const paymentSuccess = simulatePayment();

    if (!paymentSuccess) {
      for (let item of items) {
        await conn.query(
          "UPDATE inventory SET stock = stock + ? WHERE id = ?",
          [item.quantity, item.inventory_id]
        );
      }

      await conn.query(
        "UPDATE orders SET status = 'CANCELLED' WHERE id = ?",
        [orderId]
      );

      await conn.commit();

      cache.del(`order_${orderId}`);

      return { message: "Payment failed. Order cancelled." };
    }

    await conn.query(
      "UPDATE orders SET status = 'CONFIRMED' WHERE id = ?",
      [orderId]
    );

    await conn.commit();

    cache.del(`order_${orderId}`);

    return { message: "Order confirmed", orderId };

  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

exports.getOrderById = async (orderId) => {
  const cacheKey = `order_${orderId}`;

  const cachedOrder = cache.get(cacheKey);
  if (cachedOrder) {
    return cachedOrder;
  }

  const [[order]] = await db.query(
    "SELECT * FROM orders WHERE id = ?",
    [orderId]
  );

  if (!order) {
    const err = new Error("Order not found");
    err.statusCode = 404;
    throw err;
  }

  const [items] = await db.query(
    "SELECT inventory_id, quantity FROM order_items WHERE order_id = ?",
    [orderId]
  );

  const result = { ...order, items };

  cache.set(cacheKey, result, 60);

  return result;
};

exports.getOrders = async (userId, page, limit, status) => {
  const offset = (page - 1) * limit;

  let query = "SELECT * FROM orders WHERE user_id = ?";
  let params = [userId];

  if (status) {
    query += " AND status = ?";
    params.push(status);
  }

  query += " LIMIT ? OFFSET ?";
  params.push(limit, offset);

  const [orders] = await db.query(query, params);
  return orders;
};

exports.cancelOrder = async (orderId) => {
  const [[order]] = await db.query(
    "SELECT status FROM orders WHERE id = ?",
    [orderId]
  );

  if (!order || order.status === "CANCELLED") {
    const err = new Error("Order cannot be cancelled");
    err.statusCode = 400;
    throw err;
  }

  const [items] = await db.query(
    "SELECT inventory_id, quantity FROM order_items WHERE order_id = ?",
    [orderId]
  );

  for (let item of items) {
    await db.query(
      "UPDATE inventory SET stock = stock + ? WHERE id = ?",
      [item.quantity, item.inventory_id]
    );
  }

  await db.query(
    "UPDATE orders SET status = 'CANCELLED' WHERE id = ?",
    [orderId]
  );

  cache.del(`order_${orderId}`);

  return { message: "Order cancelled" };
};
