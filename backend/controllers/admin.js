import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate
    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing required fields" });

    // Check if admin already exists
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Admin already exists" });

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create admin user
    await User.create({
      name,
      email,
      password: hashed,
      role: "admin",
    });

    res.json({ message: "Admin created successfully" });
  } catch (err) {
    console.error("ADMIN CREATION ERROR:", err);
    res.status(500).json({ message: "Failed to create admin" });
  }
};
