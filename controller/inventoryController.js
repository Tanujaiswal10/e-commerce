const inventoryService = require('../service/inventoryService');

exports.createProduct = async (req, res, next) => {
  try {
    const { name, stock } = req.body;

    if (!name || stock === undefined) {
      const err = new Error("Name and stock are required");
      err.statusCode = 400;
      throw err;
    }

    if (req.user.role !== "ADMIN") {
      const err = new Error("Access denied");
      err.statusCode = 403;
      throw err;
    }

    const product = await inventoryService.createProduct({ name, stock });
    return res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await inventoryService.getAllProducts();
    return res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await inventoryService.getProductById(id);
    return res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};
