import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface DecodedToken extends JwtPayload {
  id: number;
  email: string;
}

export interface AuthRequest extends Request {
  user?: { id: number; email: string };
}

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key_here";

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // Step 1: Validate header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  // Step 2: Extract token
  const token = authHeader.split(" ")[1];

  // Step 3: Validate JWT secret exists
  if (!JWT_SECRET) {
    console.error("❌ JWT_SECRET not defined in environment");
    return res.status(500).json({ message: "Server configuration error" });
  }

  try {
    // Step 4: Verify token safely with non-null values
    const decoded = jwt.verify(token ?? "", JWT_SECRET) as unknown as DecodedToken;

    // Step 5: Attach decoded user to request
    if (!decoded.id || !decoded.email) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    console.error("❌ JWT verification failed:", err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};