import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { updateVacancyAction } from "@/lib/actions/vacancy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default async function EditVacancyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (session?.user.role !== "EMPLOYER" || !session.user.id) return <p>Access denied</p>;

  const vacancy = await db.vacancy.findFirst({ where: { id, employerId: session.user.id } });
  if (!vacancy) return <p>Not found</p>;

  return (
    <form action={updateVacancyAction.bind(null, vacancy.id)} className="space-y-3">
      <Input name="title" defaultValue={vacancy.title} required />
      <Textarea name="description" defaultValue={vacancy.description} required />
      <Input name="location" defaultValue={vacancy.location} required />
      <Input name="salaryFrom" type="number" defaultValue={vacancy.salaryFrom ?? undefined} />
      <Input name="salaryTo" type="number" defaultValue={vacancy.salaryTo ?? undefined} />
      <Button type="submit">Save</Button>
    </form>
  );
}
