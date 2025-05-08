import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { username, email, password, role, adminCode } = req.body;

  try {
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "Email already registered." });
    }

    if (role === "admin" && adminCode !== process.env.ADMIN_CODE) {
      return res
        .status(403)
        .json({ message: "Invalid admin registration code." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: "Signup successful. Please verify your email." });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};
