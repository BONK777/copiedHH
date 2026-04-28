import Link from "next/link";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";

export default async function HomePage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const vacancies = q
    ? await db.$queryRaw<Array<{ id: string; title: string; description: string; location: string }>>`
      SELECT id, title, description, location
      FROM "Vacancy"
      WHERE to_tsvector('simple', title || ' ' || description) @@ plainto_tsquery('simple', ${q})
      ORDER BY "createdAt" DESC
      LIMIT 30
    `
    : await db.vacancy.findMany({ orderBy: { createdAt: "desc" }, take: 30 });

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Вакансии</h1>
      <form className="flex gap-2" method="GET">
        <input name="q" placeholder="Поиск по вакансиям" className="w-full rounded-md border px-3 py-2" />
        <button type="submit" className="rounded-md border px-4 py-2">
          Найти
        </button>
      </form>
      <div className="grid gap-3">
        {vacancies.map((vacancy) => (
          <Card key={vacancy.id}>
            <h2 className="text-lg font-semibold">{vacancy.title}</h2>
            <p className="text-sm text-slate-600">{vacancy.location}</p>
            <p className="mt-2 text-sm">{vacancy.description.slice(0, 160)}...</p>
            <Link href={`/vacancies/${vacancy.id}`} className="mt-3 inline-block text-sm underline">
              Подробнее
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
}
