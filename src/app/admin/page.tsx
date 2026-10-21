import type { Metadata } from "next";
import { listAdminPosts } from "@/lib/blog";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/app/admin/shell";
import { NotAuthorized } from "@/app/admin/not-authorized";
import { PostEditor } from "@/app/admin/editor";
import { SignInForm } from "@/app/admin/sign-in-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Writing desk",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const supabase = await createClient();
  if (!supabase) {
    return (
      <AdminShell section="writing">
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
      <AdminShell section="writing">
        <SignInForm />
      </AdminShell>
    );
  }

  const { data: allowed, error } = await supabase.rpc("is_blog_admin");
  if (error || !allowed) {
    return (
      <AdminShell section="writing">
        <NotAuthorized />
      </AdminShell>
    );
  }

  const posts = await listAdminPosts();

  return (
    <AdminShell signedIn section="writing">
      <PostEditor posts={posts} />
    </AdminShell>
  );
}
