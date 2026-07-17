import { Router } from "express";
import { auth } from "../config/auth";

const router = Router();

router.all("/*", async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const path = url.pathname;

    if (path === "/sign-up/email" && req.method === "POST") {
      const body = req.body;
      const result = await auth.api.signUpEmail({
        body: {
          name: body.name,
          email: body.email,
          password: body.password,
        },
      });
      res.json({ data: result });
      return;
    }

    if (path === "/sign-in/email" && req.method === "POST") {
      const body = req.body;
      const result = await auth.api.signInEmail({
        body: {
          email: body.email,
          password: body.password,
        },
      });
      // Set session cookie
      if (result.session) {
        const cookie = `better-auth.session_token=${result.session.token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`;
        res.setHeader("Set-Cookie", cookie);
      }
      res.json({ data: result });
      return;
    }

    if (path === "/sign-out" && req.method === "POST") {
      const cookies = req.headers.cookie || "";
      const sessionCookie = cookies
        .split(";")
        .map((c) => c.trim())
        .find((c) => c.startsWith("better-auth.session_token="));

      if (sessionCookie) {
        const token = sessionCookie.split("=")[1];
        await auth.api.signOut({
          headers: new Headers({ cookie: cookies }),
        });
        res.setHeader(
          "Set-Cookie",
          "better-auth.session_token=; Path=/; HttpOnly; Max-Age=0"
        );
      }
      res.json({ success: true });
      return;
    }

    if (path === "/get-session" && req.method === "GET") {
      const session = await auth.api.getSession({
        headers: new Headers({
          cookie: req.headers.cookie || "",
        }),
      });
      res.json({ data: session });
      return;
    }

    res.status(404).json({ message: "Auth route not found" });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Auth error" });
  }
});

export default router;
