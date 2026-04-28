import { DefaultSession } from "next-auth";
import { AppRole } from "@/lib/types";

declare module "next-auth" {
  interface User {
    role?: AppRole;
  }

  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role?: AppRole;
    };
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser {
    role?: AppRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: AppRole;
  }
}
