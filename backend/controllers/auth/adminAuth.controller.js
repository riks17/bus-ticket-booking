const User = require("../../models/User");
const { signToken } = require("../../config/jwt");
const { ROLES } = require("../../config/roles");

/**
 * Admin Signup
 * Typically restricted in real systems; included here for completeness
 */
exports.adminSignup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const admin = await User.create({
      name,
      email,
      password,
      role: ROLES.ADMIN,
    });

    const token = signToken({ id: admin._id, role: admin.role });

    res.status(201).json({
      message: "Admin created successfully",
      token,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin Login
 */
exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ email, role: ROLES.ADMIN }).select(
      "+password"
    );

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken({ id: admin._id, role: admin.role });

    res.status(200).json({
      message: "Admin login successful",
      token,
    });
  } catch (err) {
    next(err);
  }
};
