import { Router } from "express";
import { getAuth } from "../config/auth";

const router = Router();

router.all("/*", async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const path = url.pathname;

    if (path === "/sign-up/email" && req.method === "POST") {
      const body = req.body;
      const result = await getAuth().api.signUpEmail({
        body: {
          name: body.name,
          email: body.email,
          password: body.password,
        },
      });
      // Only return user data, not session token
      const user = result.user || result;
      res.json({ data: { user } });
      return;
    }

    if (path === "/sign-in/email" && req.method === "POST") {
      const body = req.body;
      const result = await getAuth().api.signInEmail({
        body: {
          email: body.email,
          password: body.password,
        },
      });
      // Set session cookie only - don't return token in body
      if (result.token) {
        const cookie = `better-auth.session_token=${result.token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`;
        res.setHeader("Set-Cookie", cookie);
      }
      const user = result.user;
      res.json({ data: { user } });
      return;
    }

    if (path === "/sign-out" && req.method === "POST") {
      try {
        await getAuth().api.signOut({
          headers: new Headers({ cookie: req.headers.cookie || "" }),
        });
      } catch {
        // Ignore errors on sign-out
      }
      res.setHeader(
        "Set-Cookie",
        "better-auth.session_token=; Path=/; HttpOnly; Max-Age=0"
      );
      res.json({ success: true });
      return;
    }

    if (path === "/get-session" && req.method === "GET") {
      const session = await getAuth().api.getSession({
        headers: new Headers({
          cookie: req.headers.cookie || "",
        }),
      });
      // Only return user data and session metadata, not the token
      const safeSession = session
        ? {
            user: session.user,
            session: {
              id: session.session?.id,
              expiresAt: session.session?.expiresAt,
            },
          }
        : null;
      res.json({ data: safeSession });
      return;
    }

    res.status(404).json({ message: "Auth route not found" });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Auth error" });
  }
});

export default router;
