"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { applicationSchema } from "@/lib/validators/application";

export async function applyToVacancyAction(formData: FormData) {
  const session = await auth();
  if (session?.user.role !== "CANDIDATE" || !session.user.id) {
    return { error: "Only candidates can apply" };
  }

  const parsed = applicationSchema.safeParse({
    vacancyId: formData.get("vacancyId"),
    coverLetter: formData.get("coverLetter")
  });

  if (!parsed.success) return { error: "Validation error" };

  await db.application.create({
    data: {
      vacancyId: parsed.data.vacancyId,
      coverLetter: parsed.data.coverLetter,
      candidateId: session.user.id
    }
  });

  revalidatePath(`/vacancies/${parsed.data.vacancyId}`);
  return { ok: true };
}
