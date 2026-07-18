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

async function verifyJwt(token: string): Promise<{ userId: string; email: string } | null> {
  try {
    // Fetch JWKS from better-auth
    const baseURL = process.env.BETTER_AUTH_URL || "http://localhost:3000";
    const jwksUrl = `${baseURL}/api/auth/jwks`;
    const jwksRes = await fetch(jwksUrl);
    const jwks = await jwksRes.json();

    if (!jwks?.keys?.length) return null;

    // Use jose to verify the JWT with the JWKS
    const { jwtVerify, createRemoteJWKSet } = await import("jose");
    const JWKS = createRemoteJWKSet(new URL(jwksUrl));
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: baseURL,
    });

    return {
      userId: (payload.sub as string) || "",
      email: (payload.email as string) || "",
    };
  } catch {
    return null;
  }
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
        const payload = await verifyJwt(bearerToken);
        if (payload) {
          (req as any).userId = payload.userId;
          (req as any).userEmail = payload.email;
          next();
          return;
        }
      }

      // Not a JWT — try as raw session token (fallback for localhost)
      const token = bearerToken.split(".")[0] || null;
      if (token) {
        const db = getDb();
        const session = await db.collection("session").findOne({ token });
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
