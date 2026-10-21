"use client";

import * as React from "react";
import { useActionState } from "react";
import { submitContact } from "@/app/contact-action";

type FieldName = "name" | "email" | "message";
type FieldErrors = Partial<Record<FieldName, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form: FormData): FieldErrors {
  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const message = String(form.get("message") ?? "").trim();
  const errors: FieldErrors = {};
  if (name.length < 1 || name.length > 80) errors.name = "Add your name.";
  if (!EMAIL.test(email) || email.length > 200) errors.email = "That email does not look right.";
  if (message.length < 1 || message.length > 4000) errors.message = "Write a message under 4000 characters.";
  return errors;
}

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: FieldName;
  error?: string;
  children: React.ReactNode;
}) {
  const errorId = `${name}-error`;
  return (
    <label className="admin-field">
      <span>{label}</span>
      {children}
      {error ? (
        <span id={errorId} className="field-error" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
}

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, null);
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const formRef = React.useRef<HTMLFormElement>(null);

  if (state?.ok) {
    return (
      <p className="contact-success" role="status">
        Thanks. I have the message.
      </p>
    );
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    const next = validate(new FormData(event.currentTarget));
    setErrors(next);
    const first = (Object.keys(next) as FieldName[]).find((key) => next[key]);
    if (first) {
      event.preventDefault();
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    }
  }

  return (
    <form ref={formRef} action={action} className="contact-form" noValidate onSubmit={onSubmit}>
      <Field label="Name" name="name" error={errors.name}>
        <input
          name="name"
          type="text"
          autoComplete="name"
          maxLength={80}
          aria-required="true"
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
      </Field>
      <Field label="Email" name="email" error={errors.email}>
        <input
          name="email"
          type="email"
          autoComplete="email"
          maxLength={200}
          aria-required="true"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "email-error" : undefined}
          inputMode="email"
        />
      </Field>
      <Field label="Message" name="message" error={errors.message}>
        <textarea
          name="message"
          maxLength={4000}
          rows={5}
          aria-required="true"
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
      </Field>
      <label className="hp-field" aria-hidden="true">
        Company
        <input name="company_url" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
      {state?.error ? (
        <p className="field-error" role="alert">
          {state.error}
        </p>
      ) : null}
      <button type="submit" className="button-ink" disabled={pending}>
        {pending ? "Sending…" : "Send"}
      </button>
    </form>
  );
}
