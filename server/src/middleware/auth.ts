import dns from "node:dns";
dns.setServers(["1.1.1.1", "1.0.0.1"]);

import { Request, Response, NextFunction } from "express";
import { MongoClient } from "mongodb";

let _client: MongoClient | null = null;

function getDb() {
  if (!_client) {
    _client = new MongoClient(process.env.MONGODB_URI!);
  }
  return _client.db();
}

function parseCookie(cookies: string, name: string): string | null {
  const match = cookies.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    let token: string | null = null;

    // 1) Try to read from the signed session cookie.
    //    The cookie value is "<rawToken>.<hmacSignature>" — we only need the
    //    raw token (the part before the first dot) to look up the session.
    const cookieHeader = req.headers.cookie || "";
    const cookieToken = parseCookie(cookieHeader, "better-auth.session_token");
    if (cookieToken) {
      token = cookieToken.split(".")[0] || null;
    }

    // 2) Fall back to the Authorization header.
    if (!token) {
      const authHeader = req.headers.authorization || "";
      const bearerToken = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : "";
      if (bearerToken) {
        token = bearerToken.split(".")[0] || null;
      }
    }

    if (!token) {
      res
        .status(401)
        .json({ success: false, message: "Authentication required" });
      return;
    }

    const db = getDb();
    const session = await db.collection("session").findOne({ token });

    if (!session || !session.userId) {
      res
        .status(401)
        .json({ success: false, message: "Invalid or expired session" });
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
