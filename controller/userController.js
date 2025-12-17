const userService = require("../service/userService");

exports.create = async (req, res) => {
  try 
  {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) 
    {
      return res.status(400).json({ message: "All fields are required" });
    }
    const result = await userService.create(req,res);
    res.status(201).json(result);
  } 
  catch (error) 
  {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try 
  {
    const { email, password } = req.body; 
    if (!email || !password ) 
    {
      return res.status(400).json({ message: "All fields are required" });
    }  
    const result = await userService.login(req,res);
    res.status(200).json(result);
  } 
  catch (error) 
  {
    res.status(401).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try 
  {
    const user = await userService.getUserById(req,res);
    res.status(200).json(user);
  }
  catch (error) 
  {
    res.status(404).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try 
  {
    const users = await userService.getAllUsers(req,res);
    res.status(200).json(users);
  } 
  catch (error) 
  {
    res.status(403).json({ message: error.message });
  }
};
