const bcrypt = require("bcrypt");
const db = require("../config/db");
const jwt = require("jsonwebtoken");

exports.create = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role]
    );

    return {
      message: role === "ADMIN" ? "Admin registered" : "User registered"
    };
  } catch (error) {
    error.statusCode = 500;
    throw error;
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [[user]] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (!user) {
      const err = new Error("Invalid credentials");
      err.statusCode = 401;
      throw err;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      const err = new Error("Invalid credentials");
      err.statusCode = 401;
      throw err;
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return {
      token,
      id: user.id
    };
  } catch (error) {
    throw error;
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "CUSTOMER") {
      const err = new Error("Access denied");
      err.statusCode = 403;
      throw err;
    }

    const [[user]] = await db.query(
      "SELECT id, name, email, role FROM users WHERE id = ?",
      [id]
    );

    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }

    return user;
  } catch (error) {
    throw error;
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      const err = new Error("Access denied");
      err.statusCode = 403;
      throw err;
    }

    const [users] = await db.query(
      "SELECT id, name, email, role FROM users WHERE role = ?",
      ["CUSTOMER"]
    );

    return users;
  } catch (error) {
    throw error;
  }
};
