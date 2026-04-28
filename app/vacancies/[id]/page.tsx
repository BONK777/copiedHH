import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { applyToVacancyAction } from "@/lib/actions/application";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default async function VacancyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const vacancy = await db.vacancy.findUnique({ where: { id }, include: { employer: true } });
  if (!vacancy) notFound();

  return (
    <article className="space-y-4">
      <h1 className="text-2xl font-bold">{vacancy.title}</h1>
      <p>{vacancy.description}</p>
      <p className="text-sm text-slate-600">Работодатель: {vacancy.employer.name}</p>
      {session?.user.role === "CANDIDATE" ? (
        <form action={applyToVacancyAction} className="space-y-2 rounded-lg border p-4">
          <input type="hidden" name="vacancyId" value={vacancy.id} />
          <Textarea name="coverLetter" placeholder="Сопроводительное письмо" required minLength={20} />
          <Button type="submit">Откликнуться</Button>
        </form>
      ) : null}
    </article>
  );
}
