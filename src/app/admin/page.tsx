import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { VisionModeSwitcher } from "@/components/vision-mode-switcher";
import { listAdminPosts } from "@/lib/blog";
import { createClient } from "@/lib/supabase/server";
import { NotAuthorized } from "@/app/admin/not-authorized";
import { PostEditor } from "@/app/admin/editor";
import { SignInForm } from "@/app/admin/sign-in-form";
import { signOut } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Writing desk",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const supabase = await createClient();
  if (!supabase) {
    return (
      <AdminShell>
        <div className="admin-card">
          <h1 className="type-title">Writing is not configured</h1>
          <p className="admin-note">Set the Supabase URL and publishable key.</p>
        </div>
      </AdminShell>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <AdminShell>
        <SignInForm />
      </AdminShell>
    );
  }

  const { data: allowed, error } = await supabase.rpc("is_blog_admin");
  if (error || !allowed) {
    return (
      <AdminShell>
        <NotAuthorized />
      </AdminShell>
    );
  }

  const posts = await listAdminPosts();

  return (
    <AdminShell signedIn>
      <PostEditor posts={posts} />
    </AdminShell>
  );
}

function AdminShell({ children, signedIn = false }: { children: ReactNode; signedIn?: boolean }) {
  return (
    <div className="admin-shell">
      <header className="admin-bar">
        <Link href="/" className="rail-name">
          Dave Lima
        </Link>
        <p className="meta">Writing desk</p>
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
