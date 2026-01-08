const User = require("../../models/User");
const { signToken } = require("../../config/jwt");
const { ROLES } = require("../../config/roles");

/**
 * User Signup
 */
exports.userSignup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: ROLES.USER,
    });

    const token = signToken({ id: user._id, role: user.role });

    res.status(201).json({
      message: "Signup successful",
      token,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * User Login
 */
exports.userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, role: ROLES.USER }).select(
      "+password"
    );

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken({ id: user._id, role: user.role });

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    next(err);
  }
};
