const bcrypt = require("bcrypt");
const db = require("../config/db");
const jwt = require("jsonwebtoken");

exports.create = async (req, res) => {
try{
    const { name, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [name, email, hashedPassword, role]
    );

    res.status(201).json({
    message: role === "ADMIN" ? "Admin registered" : "User registered"
    });
} catch (error) {
    res.status(500).json({ message: error.message });
  }

};




exports.login = async (req, res) => {
 try{
     const { email, password } = req.body;

  const [[user]] = await db.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

    res.json({
    token,
    id: user.id
    });
 } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getUserById = async (req, res) => {
try{
      const { id } = req.params;
      if (req.user.role !== "CUSTOMER") {
      return res.status(403).json({ message: "Access denied" });
    }

  const [[user]] = await db.query(
    "SELECT id, name, email, role FROM users WHERE id = ?",
    [id]
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
} catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Access denied" });
    }

    const [users] = await db.query(
      "SELECT id, name, email, role FROM users WHERE role = ?",
      ["CUSTOMER"]
    );

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
