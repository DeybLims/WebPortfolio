import type { Metadata } from "next";
import { AdminShell } from "@/app/admin/shell";
import { NowEditor } from "@/app/admin/now-editor";
import { NotAuthorized } from "@/app/admin/not-authorized";
import { SignInForm } from "@/app/admin/sign-in-form";
import { defaultNowPage } from "@/lib/now";
import { parseNowPage } from "@/lib/now-content";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Now desk",
  robots: { index: false, follow: false },
};

export default async function NowAdminPage() {
  const supabase = await createClient();
  if (!supabase) {
    return (
      <AdminShell section="now">
        <div className="admin-card">
          <h1 className="type-title">Now is not configured</h1>
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
      <AdminShell section="now">
        <SignInForm />
      </AdminShell>
    );
  }

  const { data: allowed, error } = await supabase.rpc("is_blog_admin");
  if (error || !allowed) {
    return (
      <AdminShell section="now">
        <NotAuthorized />
      </AdminShell>
    );
  }

  const { data, error: readError } = await supabase
    .from("now_page")
    .select("updated_label, updated_date, intro, sections")
    .eq("id", 1)
    .maybeSingle();

  const missingTable = readError?.code === "42P01" || readError?.code === "PGRST205";
  const stored = data ? parseNowPage(data) : null;

  return (
    <AdminShell signedIn section="now">
      <NowEditor initial={stored ?? defaultNowPage} tableReady={!missingTable} />
    </AdminShell>
  );
}
