import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { isAppRole } from "@/lib/types";
import { signInSchema } from "@/lib/validators/auth";

export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const parsed = signInSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await db.user.findUnique({ where: { email: parsed.data.email } });
        if (!user) return null;

        const isValid = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;

        const roleUnknown: unknown = user.role;
        if (isAppRole(roleUnknown)) {
          token.role = roleUnknown;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;

        const roleUnknown: unknown = token.role;
        if (isAppRole(roleUnknown)) {
          session.user.role = roleUnknown;
        }
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/signin"
  }
};
