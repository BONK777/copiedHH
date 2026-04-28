import { signUpAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignUpPage() {
  return (
    <section className="mx-auto max-w-md space-y-4">
      <h1 className="text-xl font-semibold">Sign up</h1>
      <form action={signUpAction} className="space-y-3">
        <Input name="name" required placeholder="Name" />
        <Input name="email" type="email" required placeholder="Email" />
        <Input name="password" type="password" required placeholder="Password" />
        <select name="role" className="w-full rounded-md border px-3 py-2" defaultValue="CANDIDATE">
          <option value="CANDIDATE">Candidate</option>
          <option value="EMPLOYER">Employer</option>
        </select>
        <Button type="submit">Create account</Button>
      </form>
    </section>
  );
}
