import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = express.Router();

// SIGNUP
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  // Check username length again (extra protection)
  if (username.length < 3) {
    return res.status(400).json({ error: "Username must be at least 3 characters." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ error: "Email already exists." });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "Signup successful." });
  } catch (err) {
    res.status(500).json({ error: "Server error during signup." });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid email or password." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid email or password." });

    res.status(200).json({ message: "Login successful", user: { email: user.email, username: user.username, isAdmin: user.isAdmin } });
  } catch (err) {
    res.status(500).json({ error: "Server error during login." });
  }
});

export default router;
