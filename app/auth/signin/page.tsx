import { signIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignInPage() {
  return (
    <section className="mx-auto max-w-md space-y-4">
      <h1 className="text-xl font-semibold">Sign in</h1>
      <form
        action={async (formData) => {
          "use server";
          await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirectTo: "/"
          });
        }}
        className="space-y-3"
      >
        <Input name="email" type="email" required placeholder="Email" />
        <Input name="password" type="password" required placeholder="Password" />
        <Button type="submit">Sign in</Button>
      </form>
    </section>
  );
}
