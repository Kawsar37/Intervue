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
    //    On HTTPS, better-auth prefixes with __Secure-
    const cookieHeader = req.headers.cookie || "";
    let cookieToken = parseCookie(cookieHeader, "__Secure-better-auth.session_token");
    if (!cookieToken) {
      cookieToken = parseCookie(cookieHeader, "better-auth.session_token");
    }
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

    // 3) If we have a token, look up the session in DB
    if (token) {
      const db = getDb();
      const session = await db.collection("session").findOne({ token });

      if (session && session.userId) {
        if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
          res.status(401).json({ success: false, message: "Session expired" });
          return;
        }
        const user = await db.collection("user").findOne({ _id: session.userId });
        (req as any).userId = session.userId;
        (req as any).userEmail = user?.email || "";
        next();
        return;
      }
    }

    // 4) Fallback: trust x-user-id header (sent by Next.js proxy after verifying session)
    const headerUserId = req.headers["x-user-id"] as string | undefined;
    if (headerUserId) {
      (req as any).userId = headerUserId;
      (req as any).userEmail = "";
      next();
      return;
    }

    res.status(401).json({ success: false, message: "Authentication required" });
  } catch {
    res.status(401).json({ success: false, message: "Authentication failed" });
  }
};
