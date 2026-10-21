import type { ReactNode } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { VisionModeSwitcher } from "@/components/vision-mode-switcher";
import { signOut } from "@/app/admin/actions";

export function AdminShell({
  children,
  signedIn = false,
  section = "writing",
}: {
  children: ReactNode;
  signedIn?: boolean;
  section?: "writing" | "now" | "messages";
}) {
  return (
    <div className="admin-shell">
      <header className="admin-bar">
        <Link href="/" className="rail-name">
          Dave Lima
        </Link>
        <nav className="admin-switch" aria-label="Desk">
          <Link href="/admin" aria-current={section === "writing" ? "page" : undefined}>
            Writing
          </Link>
          <Link href="/admin/now" aria-current={section === "now" ? "page" : undefined}>
            Now
          </Link>
          <Link href="/admin/messages" aria-current={section === "messages" ? "page" : undefined}>
            Messages
          </Link>
        </nav>
        <div className="admin-bar-tools">
          <VisionModeSwitcher />
          <ThemeToggle />
          {signedIn ? (
            <form action={signOut}>
              <button type="submit" className="text-button">
                Sign out
              </button>
            </form>
          ) : null}
        </div>
      </header>
      <main id="content" className="admin-main">
        {children}
      </main>
    </div>
  );
}
