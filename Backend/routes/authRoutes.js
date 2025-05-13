import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = express.Router();

// Define max allowed users per role (according to brief)
const MAX_USERS = {
  sales: 3,
  finance: 3,
  admin: 3,
  investor: Infinity,
  client: Infinity,
};

// Valid roles based on brief
const VALID_ROLES = ["sales", "finance", "admin", "investor", "client"];

// SIGNUP route
router.post("/signup", async (req, res) => {
  const { username, email, password, role = "client", registrationCode } = req.body;

  // Validate role
  if (!VALID_ROLES.includes(role)) {
    return res.status(400).json({ error: "Invalid role specified." });
  }

  // Registration code check for restricted roles
  if (["sales", "finance", "admin"].includes(role)) {
    if (!registrationCode || !validateRegistrationCode(role, registrationCode)) {
      return res.status(403).json({ error: "Invalid or missing registration code for this role." });
    }
  }

  // Username validation
  if (username.length < 3) {
    return res.status(400).json({ error: "Username must be at least 3 characters." });
  }

  try {
    // Check if email is already used
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already exists." });
    }

    // Check if the role has reached its limit
    const roleCount = await User.countDocuments({ role });
    if (roleCount >= MAX_USERS[role]) {
      return res.status(403).json({
        error: `Maximum number of ${role} users reached (${MAX_USERS[role]}).`
      });
    }

    // Create new user with hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    res.status(201).json({ message: "Signup successful." });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error during signup." });
  }
});

// LOGIN route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials." });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login." });
  }
});

// Registration code check
function validateRegistrationCode(role, code) {
  const validCodes = {
    sales: "SALES-PERSONNEL",
    finance: "FINANCE-PERSONNEL",
    admin: "ADMIN-2025",
  };
  return code === validCodes[role];
}

// Route to get role limits
router.get("/role-limits", (req, res) => {
  res.json(MAX_USERS);
});

export default router;
