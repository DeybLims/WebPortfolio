"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Loader2, MessageCircle, Sparkles, X } from "lucide-react";
import puter from "@heyputer/puter.js";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/cn";

type ChatRole = "user" | "assistant" | "system";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

const SYSTEM_PROMPT =
  "You are the personal AI assistant for Dave Emanuel G. Lima, a versatile Software Engineer based in Iloilo City, Philippines. You are integrated into his portfolio website. Your job is to answer questions from recruiters and clients about Dave concisely, professionally, and enthusiastically. Key facts about Dave: He is a full-stack developer skilled in Next.js, React, Tailwind, Flutter, Python, Laravel, and ERPNext (Frappe framework). He graduated in 2025 with a BS in Computer Science (Major in AI) and a GWA of 1.52. His notable projects include 'PinPoint' (geofenced attendance platform in Laravel/React), 'ColorAid' (accessibility tool in Python/GCP), and extensive internal ERP customization using Frappe. He is currently looking for remote freelance or full-time roles. If you don't know the answer to something, direct the user to email him at daveemanuel.lima@wvsu.edu.ph. Formatting rules: use clean Markdown with short paragraphs and bullet lists on their own lines (use '- ' bullets). Keep answers scannable and recruiter-friendly. Avoid walls of text.";

const WELCOME_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "Hi! I'm Dave's AI assistant. Ask me about his skills, projects, experience, or availability — happy to help recruiters and collaborators.",
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
        strong: ({ children }) => (
          <strong className="font-semibold text-white">{children}</strong>
        ),
        em: ({ children }) => <em className="italic text-gray-200">{children}</em>,
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="underline decoration-emerald-400/60 underline-offset-2 hover:text-emerald-300"
          >
            {children}
          </a>
        ),
        code: ({ children }) => (
          <code className="rounded bg-black/40 px-1 py-0.5 font-mono text-[12px] text-emerald-300">
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
            className="pointer-events-auto flex h-[min(500px,70vh)] w-[min(100vw-2rem,350px)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-gray-900/90 shadow-[0_24px_80px_-12px_rgba(0,0,0,0.75)] backdrop-blur-xl"
            role="dialog"
            aria-label="Dave's AI Assistant"
          >
            <header className="flex items-center justify-between border-b border-gray-800 bg-gray-950/80 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                  <Sparkles className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">Dave&apos;s AI Assistant</p>
                  <p className="text-[11px] text-gray-400">Ask about skills, projects & availability</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
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
                      "max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                      msg.role === "user"
                        ? "rounded-br-md bg-emerald-500 text-white"
                        : "rounded-bl-md border border-gray-800 bg-gray-800 text-gray-100",
                    )}
                  >
                    <MessageBody role={msg.role} content={msg.content} />
                  </div>
                </div>
              ))}

              {loading ? (
                <div className="flex justify-start">
                  <div className="inline-flex items-center gap-2 rounded-2xl rounded-bl-md border border-gray-800 bg-gray-800 px-3 py-2 text-xs text-gray-300">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-400" aria-hidden />
                    typing...
                  </div>
                </div>
              ) : null}
            </div>

            <form
              onSubmit={(e) => void handleSendMessage(e)}
              className="border-t border-gray-800 bg-gray-950/70 p-3"
            >
              <div className="flex items-center gap-2 rounded-xl border border-gray-800 bg-gray-900 px-2 py-1.5 focus-within:border-emerald-500/40">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                  placeholder="Ask about Dave..."
                  className="min-w-0 flex-1 bg-transparent px-2 py-1.5 text-sm text-white outline-none placeholder:text-gray-500 disabled:opacity-50"
                  aria-label="Message Dave's AI assistant"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-white transition hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 disabled:cursor-not-allowed disabled:opacity-40"
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
        className="pointer-events-auto relative inline-flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/30 bg-gray-950 text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.35)] transition hover:bg-gray-900 hover:text-emerald-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70"
        aria-label={open ? "Close Ask My AI chat" : "Open Ask My AI chat"}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
      >
        <motion.span
          className="absolute inset-0 rounded-full bg-emerald-400/20"
          animate={{ scale: [1, 1.35, 1], opacity: [0.55, 0, 0.55] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        />
        {open ? (
          <X className="relative h-5 w-5" aria-hidden />
        ) : (
          <span className="relative inline-flex items-center gap-0.5">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            <MessageCircle className="h-5 w-5" aria-hidden />
          </span>
        )}
      </motion.button>
    </div>
  );
}
