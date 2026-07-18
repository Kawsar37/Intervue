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
      res.status(401).json({ success: false, message: "Authentication required" });
      return;
    }

    const db = getDb();
    const session = await db.collection("session").findOne({ token });

    if (!session || !session.userId) {
      res.status(401).json({ success: false, message: "Invalid or expired session" });
      return;
    }

    if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
      res.status(401).json({ success: false, message: "Session expired" });
      return;
    }

    const user = await db.collection("user").findOne({ _id: session.userId });

    (req as any).userId = session.userId;
    (req as any).userEmail = user?.email || "";
    next();
  } catch {
    res.status(401).json({ success: false, message: "Authentication failed" });
  }
};
