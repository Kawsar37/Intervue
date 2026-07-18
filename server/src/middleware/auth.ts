import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler";
import { MongoClient } from "mongodb";

let _client: MongoClient | null = null;

function getDb() {
  if (!_client) {
    _client = new MongoClient(process.env.MONGODB_URI!);
  }
  return _client.db();
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

    if (!token) {
      throw new AppError("Unauthorized - please sign in", 401);
    }

    const db = getDb();
    const session = await db.collection("session").findOne({ token });

    if (!session || !session.userId) {
      throw new AppError("Unauthorized - please sign in", 401);
    }

    if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
      throw new AppError("Session expired", 401);
    }

    const user = await db.collection("user").findOne({ _id: session.userId });

    if (!user) {
      throw new AppError("User not found", 401);
    }

    (req as any).userId = session.userId;
    (req as any).userEmail = user.email;
    next();
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Unauthorized - please sign in", 401);
  }
};
