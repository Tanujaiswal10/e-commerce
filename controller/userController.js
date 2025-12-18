const userService = require("../service/userService");

exports.create = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      const err = new Error("All fields are required");
      err.statusCode = 400;
      throw err;
    }

    const result = await userService.create(req, res);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const err = new Error("All fields are required");
      err.statusCode = 400;
      throw err;
    }

    const result = await userService.login(req, res);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req, res);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers(req, res);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
