import type { Metadata } from "next";
import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import "./globals.css";

export const metadata: Metadata = {
  title: "Job Board MVP",
  description: "Production-ready MVP job board"
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="ru">
      <body>
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
            <Link href="/" className="font-semibold">
              Job Board MVP
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/">Vacancies</Link>
              {!session ? (
                <>
                  <Link href="/auth/signin">Sign in</Link>
                  <Link href="/auth/signup">Sign up</Link>
                </>
              ) : (
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/" });
                  }}
                >
                  <button type="submit" className="rounded border px-3 py-1">
                    Sign out
                  </button>
                </form>
              )}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl p-4">{children}</main>
      </body>
    </html>
  );
}
