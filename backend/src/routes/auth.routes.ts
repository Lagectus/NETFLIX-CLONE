import { Router } from "express";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import { AppError } from "../middleware/errorHandler.js";
import { authMiddleware, type AuthRequest } from "../middleware/auth.middleware.js";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "cinevault-secret-key";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "7d";

function generateToken(user: { _id: unknown; email: string; role: string }) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES as any }
  );
}

// Register
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError("Email already registered", 400));
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      data: {
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError("Invalid email or password", 401));
    }

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      data: {
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get current user
router.get("/me", authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) return next(new AppError("User not found", 404));

    res.json({
      success: true,
      data: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
  } catch (error) {
    next(error);
  }
});

// Logout
router.post("/logout", (_req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out" });
});

export { router as authRoutes };
