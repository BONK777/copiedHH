import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { updateResumeAction } from "@/lib/actions/resume";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default async function EditResumePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (session?.user.role !== "CANDIDATE" || !session.user.id) return <p>Access denied</p>;

  const resume = await db.resume.findFirst({ where: { id, candidateId: session.user.id } });
  if (!resume) return <p>Not found</p>;

  return (
    <form action={updateResumeAction.bind(null, resume.id)} className="space-y-3">
      <Input name="title" defaultValue={resume.title} required />
      <Textarea name="summary" defaultValue={resume.summary} required />
      <Input name="experience" type="number" defaultValue={resume.experience} min={0} max={50} required />
      <Input name="skills" defaultValue={resume.skills} required />
      <Button type="submit">Save</Button>
    </form>
  );
}
