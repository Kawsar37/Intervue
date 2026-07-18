import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler";
import { getAuth } from "../config/auth";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Try to get session from cookie first, then from Authorization header
    const cookieHeader = req.headers.cookie || "";
    const authHeader = req.headers.authorization || "";
    const sessionToken = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : "";

    const headers = new Headers();
    if (cookieHeader) {
      headers.set("cookie", cookieHeader);
    }
    if (sessionToken) {
      headers.set("cookie", `better-auth.session_token=${sessionToken}`);
    }

    const session = await getAuth().api.getSession({
      headers,
    });

    if (!session?.user?.id) {
      throw new AppError("Unauthorized - please sign in", 401);
    }

    (req as any).userId = session.user.id;
    (req as any).userEmail = session.user.email;
    next();
  } catch {
    throw new AppError("Unauthorized - please sign in", 401);
  }
};
