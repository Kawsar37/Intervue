import { Request, Response, NextFunction } from "express";
import { MongoClient, Db } from "mongodb";

let _client: MongoClient | null = null;
let _db: Db | null = null;

function getDb(): Db {
  if (!_client) {
    _client = new MongoClient(process.env.MONGODB_URI!);
  }
  if (!_db) {
    _db = _client.db("intervue");
  }
  return _db;
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
    // 1) Try JWT from Authorization header
    const authHeader = req.headers.authorization || "";
    if (authHeader.startsWith("Bearer ")) {
      const bearerToken = authHeader.slice(7);

      // Check if it's a JWT (has 3 parts separated by dots)
      if (bearerToken.split(".").length === 3) {
        // JWKS is on the client's better-auth instance (Vercel)
        const jwksUrl = `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/api/auth/jwks`;
        try {
          const { jwtVerify, createRemoteJWKSet } = await import("jose");
          const JWKS = createRemoteJWKSet(new URL(jwksUrl));
          const { payload } = await jwtVerify(bearerToken, JWKS, {
            issuer: process.env.BETTER_AUTH_URL || "http://localhost:3000",
          });
          if (payload?.sub) {
            (req as any).userId = payload.sub;
            (req as any).userEmail = (payload.email as string) || "";
            next();
            return;
          }
        } catch {
          // JWT verification failed, fall through to other methods
        }
      }

      // Not a JWT — try as raw session token (fallback for localhost)
      const rawToken = bearerToken.split(".")[0] || null;
      if (rawToken) {
        const db = getDb();
        const session = await db.collection("session").findOne({ token: rawToken });
        if (session?.userId) {
          (req as any).userId = session.userId;
          (req as any).userEmail = "";
          next();
          return;
        }
      }
    }

    // 2) Try session cookie (fallback for same-origin)
    const cookieHeader = req.headers.cookie || "";
    let cookieToken = parseCookie(cookieHeader, "__Secure-better-auth.session_token");
    if (!cookieToken) {
      cookieToken = parseCookie(cookieHeader, "better-auth.session_token");
    }
    if (cookieToken) {
      const rawToken = cookieToken.split(".")[0] || null;
      if (rawToken) {
        const db = getDb();
        const session = await db.collection("session").findOne({ token: rawToken });
        if (session?.userId) {
          (req as any).userId = session.userId;
          (req as any).userEmail = "";
          next();
          return;
        }
      }
    }

    // 3) Fallback: trust x-user-id header (from Next.js proxy)
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
