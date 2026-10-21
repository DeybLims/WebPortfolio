"use server";

import { createAnonWriteClient } from "@/lib/supabase/write";

export type ContactState = { ok?: boolean; error?: string } | null;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const honeypot = String(formData.get("company_url") ?? "").trim();
  if (honeypot) return { ok: true };

  const name = String(formData.get("name") ?? "").trim().replace(/\s+/g, " ");
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (name.length < 1 || name.length > 80) return { error: "Add your name." };
  if (!EMAIL.test(email) || email.length > 200) return { error: "That email does not look right." };
  if (message.length < 1 || message.length > 4000) return { error: "Write a message under 4000 characters." };

  const supabase = createAnonWriteClient();
  if (!supabase) return { error: "The form is not ready yet. Please email me instead." };

  const { error } = await supabase.from("contact_messages").insert({
    name,
    email,
    message,
    company_url: "",
  });

  if (error) {
    const text = `${error.message} ${error.details ?? ""}`.toLowerCase();
    if (text.includes("rate limited") || error.code === "54000") {
      return { error: "Too many notes just now. Wait a while, or email me." };
    }
    return { error: "The form is not ready yet. Please email me instead." };
  }

  return { ok: true };
}
