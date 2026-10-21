import type { Metadata } from "next";
import { deleteContactMessage } from "@/app/admin/actions";
import { AdminShell } from "@/app/admin/shell";
import { NotAuthorized } from "@/app/admin/not-authorized";
import { SignInForm } from "@/app/admin/sign-in-form";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Messages",
  robots: { index: false, follow: false },
};

type ContactRow = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

function formatWhen(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Manila",
  }).format(date);
}

export default async function MessagesAdminPage() {
  const supabase = await createClient();
  if (!supabase) {
    return (
      <AdminShell section="messages">
        <div className="admin-card">
          <h1 className="type-title">Messages are not configured</h1>
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
      <AdminShell section="messages">
        <SignInForm />
      </AdminShell>
    );
  }

  const { data: allowed, error: authError } = await supabase.rpc("is_blog_admin");
  if (authError || !allowed) {
    return (
      <AdminShell section="messages">
        <NotAuthorized />
      </AdminShell>
    );
  }

  const { data, error } = await supabase
    .from("contact_messages")
    .select("id, name, email, message, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  const missingTable = error?.code === "42P01" || error?.code === "PGRST205";
  const rows = (data ?? []) as ContactRow[];

  return (
    <AdminShell signedIn section="messages">
      <div className="admin-messages">
        <h1 className="type-title">Messages</h1>
        <p className="admin-note">Notes sent from the contact form. Only you can read them.</p>
        {missingTable ? (
          <p className="admin-alert" role="status">
            Apply supabase/migrations/20261021_contact_messages.sql in the TenantHub SQL editor, then reload.
          </p>
        ) : null}
        {error && !missingTable ? <p className="admin-alert">Could not load messages.</p> : null}
        {!error && rows.length === 0 ? <p className="admin-note">No messages yet.</p> : null}
        <ul className="admin-posts">
          {rows.map((row) => (
            <li key={row.id} className="admin-message">
              <p className="admin-note">{formatWhen(row.created_at)}</p>
              <p>
                <strong>{row.name}</strong> · {row.email}
              </p>
              <p className="admin-message-body">{row.message}</p>
              <form action={deleteContactMessage}>
                <input type="hidden" name="id" value={row.id} />
                <button type="submit" className="text-button">
                  Delete
                </button>
              </form>
            </li>
          ))}
        </ul>
      </div>
    </AdminShell>
  );
}
