import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = express.Router();

// Define max allowed users per role (according to brief)
const MAX_USERS = {
  sales: 3,       // Max 3 sales personnel
  finance: 3,     // Max 3 finance personnel
  admin: 3,       // Max 3 developers (renamed from 'admin' to match brief)
  investor: Infinity, // No limit specified for investors
  client: Infinity,   // Unlimited clients

};

// Valid roles based on brief
const VALID_ROLES = ["sales", "finance", "admin", "investor", "client"];

// SIGNUP with enhanced permission checks
router.post("/signup", async (req, res) => {
  const { username, email, password, role = "client", registrationCode } = req.body;

  // Validate role
  if (!VALID_ROLES.includes(role)) {
    return res.status(400).json({ error: "Invalid role specified." });
  }

  // Special handling for restricted roles (require registration code)
  if (["sales", "finance", "admin"].includes(role)) {
    if (!registrationCode || !validateRegistrationCode(role, registrationCode)) {
      return res.status(403).json({ error: "Invalid or missing registration code for this role." });
    }
  }

  // Validate username
  if (username.length < 3) {
    return res.status(400).json({ error: "Username must be at least 3 characters." });
  }

  try {
    // Check for existing email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already exists." });
    }

    // Check role capacity
    const roleCount = await User.countDocuments({ role });
    if (roleCount >= MAX_USERS[role]) {
      return res.status(403).json({ 
        error: `Maximum number of ${role} users reached (${MAX_USERS[role]}).` 
      });
    }

    // Hash password and create user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
      mfaEnabled: ["sales", "finance", "admin", "investor"].includes(role) // Enforce MFA for these roles
    });

    await newUser.save();
    res.status(201).json({ 
      message: "Signup successful.",
      requiresMFA: newUser.mfaEnabled
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error during signup." });
  }
});

// LOGIN with MFA reminder
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials." });

    // Check if MFA is required but not set up
    if (user.mfaEnabled && !user.mfaSecret) {
      return res.status(206).json({  // 206 Partial Content
        message: "MFA setup required",
        requiresMfaSetup: true
      });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        requiresMFA: user.mfaEnabled
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login." });
  }
});

function validateRegistrationCode(role, code) {
  // In production, implement proper code validation (database lookup, JWT, etc.)
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