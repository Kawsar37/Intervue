import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

let _auth: any = null;

export function getAuth(): any {
  if (!_auth) {
    const client = new MongoClient(process.env.MONGODB_URI!);
    const db = client.db("intervue");
    _auth = betterAuth({
      database: mongodbAdapter(db, { client }),
      emailAndPassword: {
        enabled: true,
      },
      session: {
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24,
      },
      trustedOrigins: [process.env.CLIENT_URL || "http://localhost:3000"],
    });
  }
  return _auth;
}
