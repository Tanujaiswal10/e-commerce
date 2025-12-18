const db = require("../config/db");
const cache = require("../utils/cache");

exports.createProduct = async ({ name, stock }) => {
  const [result] = await db.query(
    "INSERT INTO inventory (name, stock) VALUES (?, ?)",
    [name, stock]
  );
  cache.del("inventory_all");

  return {
    id: result.insertId,
    name,
    stock
  };
};

exports.getAllProducts = async () => {
  const cachedProducts = cache.get("inventory_all");
  if (cachedProducts) {
    return cachedProducts;
  }

  const [products] = await db.query(
    "SELECT id, name, stock FROM inventory"
  );

  cache.set("inventory_all", products, 60);

  return products;
};

exports.getProductById = async (id) => {
  const [[product]] = await db.query(
    "SELECT id, name, stock FROM inventory WHERE id = ?",
    [id]
  );

  if (!product) {
    const err = new Error("Product not found");
    err.statusCode = 404;
    throw err;
  }

  return product;
};
