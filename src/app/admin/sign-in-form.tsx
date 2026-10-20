"use client";

import * as React from "react";
import { useActionState } from "react";
import { signIn } from "@/app/admin/actions";

export function SignInForm() {
  const [state, action, pending] = useActionState(signIn, null);

  return (
    <form action={action} className="admin-card">
      <h1 className="type-title">Sign in</h1>
      <p className="admin-note">Email and password for the writing desk.</p>
      <label className="admin-field">
        <span>Email</span>
        <input name="email" type="email" autoComplete="username" required />
      </label>
      <label className="admin-field">
        <span>Password</span>
        <input name="password" type="password" autoComplete="current-password" required />
      </label>
      {state?.error ? (
        <p className="admin-alert" role="alert">
          {state.error}
        </p>
      ) : null}
      <button type="submit" className="button-ink" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
