import { signOut } from "@/app/admin/actions";

export function NotAuthorized() {
  return (
    <div className="admin-card">
      <h1 className="type-title">Not authorized</h1>
      <p className="admin-note">This account cannot edit the writing.</p>
      <form action={signOut}>
        <button type="submit" className="button-ink">
          Sign out
        </button>
      </form>
    </div>
  );
}
