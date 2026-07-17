import { betterAuth } from "better-auth";

export const auth = betterAuth({
  database: {
    provider: "mongodb",
    url: process.env.MONGODB_URI || "mongodb://localhost:27017/intervue",
  },
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  trustedOrigins: [process.env.CLIENT_URL || "http://localhost:3000"],
});
