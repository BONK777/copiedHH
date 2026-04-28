"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { db } from "@/lib/db";
import { signIn } from "@/lib/auth";
import { signUpSchema } from "@/lib/validators/auth";

export async function signUpAction(formData: FormData) {
  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role")
  });

  if (!parsed.success) {
    return { error: "Invalid form data" };
  }

  const exists = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (exists) {
    return { error: "Email already in use" };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  await db.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
      role: parsed.data.role === "EMPLOYER" ? Role.EMPLOYER : Role.CANDIDATE
    }
  });

  await signIn("credentials", {
    email: parsed.data.email,
    password: parsed.data.password,
    redirect: false
  });

  redirect("/");
}
