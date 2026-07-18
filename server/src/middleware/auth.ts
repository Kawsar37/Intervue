import { Request, Response, NextFunction } from "express";
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
      (req as any).userId = "anonymous";
      (req as any).userEmail = "";
      return next();
    }

    const db = getDb();
    const session = await db.collection("session").findOne({ token });

    if (!session || !session.userId) {
      (req as any).userId = "anonymous";
      (req as any).userEmail = "";
      return next();
    }

    if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
      (req as any).userId = "anonymous";
      (req as any).userEmail = "";
      return next();
    }

    const user = await db.collection("user").findOne({ _id: session.userId });

    (req as any).userId = session.userId;
    (req as any).userEmail = user?.email || "";
    next();
  } catch {
    (req as any).userId = "anonymous";
    (req as any).userEmail = "";
    next();
  }
};
