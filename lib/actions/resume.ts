"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { resumeSchema } from "@/lib/validators/resume";

function ensureCandidate(role: string | undefined) {
  if (role !== "CANDIDATE") throw new Error("Access denied");
}

export async function createResumeAction(formData: FormData) {
  const session = await auth();
  ensureCandidate(session?.user.role);

  const parsed = resumeSchema.safeParse({
    title: formData.get("title"),
    summary: formData.get("summary"),
    experience: formData.get("experience"),
    skills: formData.get("skills")
  });

  if (!parsed.success || !session?.user.id) return { error: "Validation error" };

  await db.resume.create({ data: { ...parsed.data, candidateId: session.user.id } });
  revalidatePath("/dashboard/candidate/resumes/new");
  redirect("/dashboard/candidate/resumes/new");
}

export async function updateResumeAction(resumeId: string, formData: FormData) {
  const session = await auth();
  ensureCandidate(session?.user.role);

  const parsed = resumeSchema.safeParse({
    title: formData.get("title"),
    summary: formData.get("summary"),
    experience: formData.get("experience"),
    skills: formData.get("skills")
  });

  if (!parsed.success || !session?.user.id) return { error: "Validation error" };

  await db.resume.updateMany({
    where: { id: resumeId, candidateId: session.user.id },
    data: parsed.data
  });

  revalidatePath("/dashboard/candidate/resumes/new");
  return { ok: true };
}

export async function deleteResumeAction(resumeId: string) {
  const session = await auth();
  ensureCandidate(session?.user.role);

  if (!session?.user.id) return { error: "Unauthorized" };

  await db.resume.deleteMany({ where: { id: resumeId, candidateId: session.user.id } });
  revalidatePath("/dashboard/candidate/resumes/new");
  return { ok: true };
}
