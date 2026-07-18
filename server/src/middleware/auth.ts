import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler";
import { getAuth } from "../config/auth";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const session = await getAuth().api.getSession({
      headers: new Headers({
        cookie: req.headers.cookie || "",
      }),
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
