import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { createVacancyAction, deleteVacancyAction } from "@/lib/actions/vacancy";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default async function NewVacancyPage() {
  const session = await auth();
  if (session?.user.role !== "EMPLOYER" || !session.user.id) return <p>Access denied</p>;

  const vacancies = await db.vacancy.findMany({ where: { employerId: session.user.id }, orderBy: { createdAt: "desc" } });

  return (
    <section className="space-y-6">
      <h1 className="text-xl font-semibold">Управление вакансиями</h1>
      <form action={createVacancyAction} className="space-y-3 rounded-lg border p-4">
        <Input name="title" placeholder="Title" required />
        <Textarea name="description" placeholder="Description" required minLength={20} />
        <Input name="location" placeholder="Location" required />
        <Input name="salaryFrom" type="number" placeholder="Salary from" />
        <Input name="salaryTo" type="number" placeholder="Salary to" />
        <Button type="submit">Create vacancy</Button>
      </form>

      <div className="space-y-2">
        {vacancies.map((vacancy) => (
          <div key={vacancy.id} className="rounded border p-3">
            <p className="font-medium">{vacancy.title}</p>
            <form action={deleteVacancyAction.bind(null, vacancy.id)}>
              <Button className="mt-2 bg-red-600 hover:bg-red-700">Delete</Button>
            </form>
          </div>
        ))}
      </div>
    </section>
  );
}
