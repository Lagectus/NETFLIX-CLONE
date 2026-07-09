import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "./errorHandler.js";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export function authMiddleware(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) {
  const token =
    req.headers.authorization?.replace("Bearer ", "") ||
    req.cookies?.token;

  if (!token) {
    return next(new AppError("Authentication required", 401));
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "cinevault-secret-key"
    ) as { id: string; email: string; role: string };

    req.user = decoded;
    next();
  } catch {
    return next(new AppError("Invalid or expired token", 401));
  }
}

export function adminMiddleware(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) {
  if (req.user?.role !== "admin") {
    return next(new AppError("Admin access required", 403));
  }
  next();
}
