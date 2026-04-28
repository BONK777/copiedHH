"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { vacancySchema } from "@/lib/validators/vacancy";

function ensureEmployer(role: string | undefined) {
  if (role !== "EMPLOYER") {
    throw new Error("Access denied");
  }
}

export async function createVacancyAction(formData: FormData) {
  const session = await auth();
  ensureEmployer(session?.user.role);

  const parsed = vacancySchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    location: formData.get("location"),
    salaryFrom: formData.get("salaryFrom") || undefined,
    salaryTo: formData.get("salaryTo") || undefined
  });

  if (!parsed.success || !session?.user.id) throw new Error("Validation error");

  await db.vacancy.create({
    data: {
      ...parsed.data,
      employerId: session.user.id
    }
  });

  revalidatePath("/");
  redirect("/dashboard/employer/vacancies/new");
}

export async function updateVacancyAction(vacancyId: string, formData: FormData) {
  const session = await auth();
  ensureEmployer(session?.user.role);

  const parsed = vacancySchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    location: formData.get("location"),
    salaryFrom: formData.get("salaryFrom") || undefined,
    salaryTo: formData.get("salaryTo") || undefined
  });

  if (!parsed.success || !session?.user.id) throw new Error("Validation error");

  await db.vacancy.updateMany({
    where: { id: vacancyId, employerId: session.user.id },
    data: parsed.data
  });

  revalidatePath(`/vacancies/${vacancyId}`);
  
}

export async function deleteVacancyAction(vacancyId: string) {
  const session = await auth();
  ensureEmployer(session?.user.role);

  if (!session?.user.id) throw new Error("Unauthorized");

  await db.vacancy.deleteMany({ where: { id: vacancyId, employerId: session.user.id } });
  revalidatePath("/");
  
}
