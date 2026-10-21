"use client";

import * as React from "react";
import { useActionState } from "react";
import { submitContact } from "@/app/contact-action";

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, null);

  if (state?.ok) {
    return (
      <p className="contact-success" role="status">
        Thanks. I have the message.
      </p>
    );
  }

  return (
    <form action={action} className="contact-form">
      <label className="admin-field">
        <span>Name</span>
        <input name="name" type="text" autoComplete="name" required maxLength={80} />
      </label>
      <label className="admin-field">
        <span>Email</span>
        <input name="email" type="email" autoComplete="email" required maxLength={200} />
      </label>
      <label className="admin-field">
        <span>Message</span>
        <textarea name="message" required maxLength={4000} rows={5} />
      </label>
      <label className="hp-field" aria-hidden="true">
        Company
        <input name="company_url" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
      {state?.error ? (
        <p className="admin-alert" role="alert">
          {state.error}
        </p>
      ) : null}
      <button type="submit" className="button-ink" disabled={pending}>
        {pending ? "Sending…" : "Send"}
      </button>
    </form>
  );
}
