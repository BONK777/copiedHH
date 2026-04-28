import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function EmployerApplicationsPage() {
  const session = await auth();
  if (session?.user.role !== "EMPLOYER" || !session.user.id) return <p>Access denied</p>;

  const applications = await db.application.findMany({
    where: { vacancy: { employerId: session.user.id } },
    include: { candidate: true, vacancy: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <section className="space-y-3">
      <h1 className="text-xl font-semibold">Отклики</h1>
      {applications.map((app) => (
        <div key={app.id} className="rounded border p-3">
          <p className="font-medium">{app.vacancy.title}</p>
          <p className="text-sm">Кандидат: {app.candidate.name}</p>
          <p className="text-sm text-slate-700">{app.coverLetter}</p>
        </div>
      ))}
    </section>
  );
}
