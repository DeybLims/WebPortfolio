"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Loader2, MessageCircle, X } from "lucide-react";
import puter from "@heyputer/puter.js";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/cn";

type ChatRole = "user" | "assistant" | "system";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

const SYSTEM_PROMPT = `You answer questions on the portfolio of Dave Emanuel G. Lima, a software developer in Iloilo City, Philippines. Use plain sentences. Do not use hype words such as passionate, cutting-edge, leveraging, seamless, innovative, or impactful. Do not invent jobs, metrics, clients, or project details.

Public facts:
- Email: daveemanuel.lima@wvsu.edu.ph
- GitHub: https://github.com/DeybLims
- I am a software engineer. I develop tools, websites, and applications.
- He graduated in 2025 with a BS in Computer Science (Major in AI) and a GWA of 1.52.
- Skills he lists: React, TypeScript, Expo/React Native, Hono, Laravel, Python, Flutter, Firebase, Frappe/ERPNext, and the database, ERP, and cloud tools shown on the site.
- Current role: Software Engineer (Junior → Senior) at Quirao Group of Companies, La Paz, Iloilo City, November 2025 – Present. He started as a Junior Software Engineer and was promoted to Senior.
- Earlier role: Web Development Intern, Web Dev / Tech Ops Team at Quirao Group of Companies, La Paz, Iloilo City, January 2025 – April 2025. Built and deployed the Unli-Paluto reservation system for a local dining brand (mobile-first UI, unique reservation IDs, HTTP(S) uptime monitoring). QA-tested web and Android builds of a commercial e-commerce platform under NDA, documenting bugs and acceptance criteria. Managed backend product data with bulk CSV uploads, SKU and inventory cleanup, and category standardization. Wrote admin, logistics, and POS user manuals, a driver FAQ, and video tutorials, and helped onboard and train delivery staff. Leave that NDA e-commerce platform unnamed.
- Freelance Web Developer, Independent / Contract, Iloilo, Philippines: PinPoint (geofenced attendance; students sign in only inside the classroom) and CarPass (QR code scanned per car at entry; date and time logged). No public CarPass link.
- Front-End Web Developer at MSL Philippines in 2025: React interfaces on a Laravel backend.
- Other projects he can discuss: an internal ERPNext customization at Quirao Group of Companies, the MSL Philippines website, ColorAid (color-vision accessibility, Python, Firebase, GCP), Paluto reservations (Python and Google Sheets), Story Creation with Gemini (Streamlit), and Káon (Flutter food logging).
- He is open to remote full-time roles and contract work, and can overlap with US, EU, or AU hours.

BuildMaster is a project at Quirao Group of Companies, under NDA. If asked, say only this: BuildMaster is a commercial construction product. Details under NDA. Do not mention or guess any tech stack, tools, architecture, features, APIs, databases, deployments, metrics, client names, screenshots, repositories, or links for BuildMaster. Do not elaborate beyond that sentence.

If you do not know something, say so and point to daveemanuel.lima@wvsu.edu.ph. Use short Markdown paragraphs and '- ' bullets.`;

const WELCOME_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "I am a software engineer. I develop tools, websites, and applications. Ask about the work or whether I am available.",
};

function MessageBody({ role, content }: { role: ChatRole; content: string }) {
  if (role === "user") {
    return <span className="whitespace-pre-wrap">{content}</span>;
  }

  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
        ul: ({ children }) => (
          <ul className="my-2 list-disc space-y-1 pl-4 last:mb-0">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="my-2 list-decimal space-y-1 pl-4 last:mb-0">{children}</ol>
        ),
        li: ({ children }) => <li className="leading-snug">{children}</li>,
        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2"
          >
            {children}
          </a>
        ),
        code: ({ children }) => (
          <code className="bg-[var(--soft)] px-1 py-0.5 font-mono text-[12px]">
            {children}
          </code>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

function extractReply(result: unknown): string {
  if (typeof result === "string") return result.trim();
  if (!result || typeof result !== "object") return "Sorry — I couldn't generate a reply just now.";

  const r = result as {
    message?: { content?: unknown } | string;
    text?: unknown;
    content?: unknown;
  };

  if (typeof r.message === "string") return r.message.trim();
  if (r.message && typeof r.message === "object") {
    const c = r.message.content;
    if (typeof c === "string") return c.trim();
    if (Array.isArray(c)) {
      return c
        .map((part) => (typeof part === "string" ? part : ""))
        .filter(Boolean)
        .join("\n")
        .trim();
    }
  }
  if (typeof r.text === "string") return r.text.trim();
  if (typeof r.content === "string") return r.content.trim();

  return "Sorry — I couldn't generate a reply just now.";
}

export function Chatbot() {
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    { role: "system", content: SYSTEM_PROMPT },
    WELCOME_MESSAGE,
  ]);

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const visibleMessages = messages.filter((m) => m.role !== "system");

  React.useEffect(() => {
    if (!open) return;
    const t = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(t);
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading, open]);

  const handleSendMessage = React.useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      const text = input.trim();
      if (!text || loading) return;

      const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
      setMessages(nextMessages);
      setInput("");
      setLoading(true);

      try {
        const reply = await puter.ai.chat(
          nextMessages.map((m) => ({
            role: m.role,
            content: m.content,
            images: [] as { type: string; image_url: { url: string } }[],
          })),
        );
        const content = extractReply(reply) || "I didn't catch that — try asking another way.";
        setMessages((prev) => [...prev, { role: "assistant", content }]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Something went wrong reaching the AI. Please try again, or email Dave directly at daveemanuel.lima@wvsu.edu.ph.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [input, loading, messages],
  );

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open ? (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, scale: 0.85, y: 24, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 16 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="pointer-events-auto flex h-[min(500px,70vh)] w-[min(100vw-2rem,22rem)] flex-col overflow-hidden border border-[var(--line)] bg-[var(--paper)] text-[var(--ink)]"
            role="dialog"
            aria-label="Questions about Dave"
          >
            <header className="flex items-center justify-between border-b border-[var(--line)] px-4 py-3">
              <div>
                <p className="font-serif text-lg">Ask about Dave</p>
                <p className="text-xs text-[var(--muted)]">Work, tools, availability</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center text-[var(--muted)] hover:text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-ring"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-3 py-3"
            >
              {visibleMessages.map((msg, i) => (
                <div
                  key={`${msg.role}-${i}-${msg.content.slice(0, 24)}`}
                  className={cn(
                    "flex",
                    msg.role === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] px-3 py-2 text-sm leading-relaxed",
                      msg.role === "user"
                        ? "bg-[var(--ink)] text-[var(--paper)]"
                        : "border border-[var(--line)] text-[var(--ink)]",
                    )}
                  >
                    <MessageBody role={msg.role} content={msg.content} />
                  </div>
                </div>
              ))}

              {loading ? (
                <div className="flex justify-start">
                  <div className="inline-flex items-center gap-2 border border-[var(--line)] px-3 py-2 text-xs text-[var(--muted)]">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                    typing...
                  </div>
                </div>
              ) : null}
            </div>

            <form
              onSubmit={(e) => void handleSendMessage(e)}
              className="border-t border-[var(--line)] p-3"
            >
              <div className="flex items-center gap-2 border border-[var(--line)] px-2 py-1.5">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                  placeholder="Ask about Dave"
                  className="min-w-0 flex-1 bg-transparent px-2 py-1.5 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--muted)] disabled:opacity-50"
                  aria-label="Message about Dave"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center bg-[var(--ink)] text-[var(--paper)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-ring disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Send message"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  ) : (
                    <ArrowUp className="h-4 w-4" aria-hidden />
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="pointer-events-auto inline-flex h-12 items-center gap-2 border border-[var(--line)] bg-[var(--ink)] px-4 text-sm text-[var(--paper)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-ring focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)]"
        aria-label={open ? "Close chat" : "Ask"}
      >
        {open ? (
          <X className="h-5 w-5" aria-hidden />
        ) : (
          <>
            <MessageCircle className="h-5 w-5" aria-hidden />
            <span>Ask</span>
          </>
        )}
      </motion.button>
    </div>
  );
}
