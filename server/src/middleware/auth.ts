import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const cookies = req.headers.cookie || "";
  const sessionCookie = cookies
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("better-auth.session_token="));

  if (sessionCookie) {
    const token = sessionCookie.split("=")[1];
    try {
      const parts = token.split(".");
      if (parts.length === 3) {
        const payload = JSON.parse(
          Buffer.from(parts[1], "base64url").toString()
        );
        (req as any).userId = payload.userId || payload.sub;
        (req as any).userEmail = payload.email;
      }
    } catch {
      // Token decode failed
    }
  }

  if (!(req as any).userId) {
    throw new AppError("Unauthorized - please sign in", 401);
  }

  next();
};
