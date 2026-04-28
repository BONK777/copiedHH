import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { createResumeAction, deleteResumeAction } from "@/lib/actions/resume";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default async function CandidateResumesPage() {
  const session = await auth();
  if (session?.user.role !== "CANDIDATE" || !session.user.id) return <p>Access denied</p>;

  const resumes = await db.resume.findMany({ where: { candidateId: session.user.id }, orderBy: { createdAt: "desc" } });

  return (
    <section className="space-y-6">
      <h1 className="text-xl font-semibold">Мои резюме</h1>
      <form action={createResumeAction} className="space-y-3 rounded-lg border p-4">
        <Input name="title" placeholder="Title" required />
        <Textarea name="summary" placeholder="Summary" required minLength={30} />
        <Input name="experience" type="number" min={0} max={50} required placeholder="Years" />
        <Input name="skills" placeholder="Skills" required />
        <Button type="submit">Create resume</Button>
      </form>
      <div className="space-y-2">
        {resumes.map((resume) => (
          <div key={resume.id} className="rounded border p-3">
            <p className="font-medium">{resume.title}</p>
            <p className="text-sm">{resume.skills}</p>
            <form action={deleteResumeAction.bind(null, resume.id)}>
              <Button className="mt-2 bg-red-600 hover:bg-red-700">Delete</Button>
            </form>
          </div>
        ))}
      </div>
    </section>
  );
}
