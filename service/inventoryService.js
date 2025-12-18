const db = require("../config/db");

exports.createProduct = async ({ name, stock }) => {
  const [result] = await db.query(
    "INSERT INTO inventory (name, stock) VALUES (?, ?)",
    [name, stock]
  );

  return {
    id: result.insertId,
    name,
    stock
  };
};

exports.getAllProducts = async () => {
  const [products] = await db.query(
    "SELECT id, name, stock FROM inventory"
  );
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
