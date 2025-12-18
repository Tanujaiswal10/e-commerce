const inventoryService = require('../service/inventoryService');

exports.createProduct = async (req, res) => {
  try {
    const { name, stock } = req.body;

    if (!name || stock === undefined) {
      return res.status(400).json({ message: "Name and stock are required" });
    }
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Access denied" });
    }

    const product = await inventoryService.createProduct({ name, stock });
    return res.status(201).json(product);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


exports.getAllProducts = async (req, res) => {
  try {
    const products = await inventoryService.getAllProducts();
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};


exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await inventoryService.getProductById(id);
    return res.status(200).json(product);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
