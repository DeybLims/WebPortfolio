"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Minus, Plus } from "lucide-react";
import { portfolioData } from "@/lib/portfolio-data";
import { cn } from "@/lib/cn";

const FAQ_ITEMS = [
  {
    id: "availability",
    question: "What is your current availability and preferred role?",
    answer:
      "I am currently open to full-time remote opportunities or contract-based freelance projects.",
  },
  {
    id: "location",
    question: "Where are you located and what are your working hours?",
    answer:
      "I am based in Iloilo City, Philippines (PHT / UTC+8). I am highly adaptable to overlapping hours with US, EU, or AU teams.",
  },
  {
    id: "frontend",
    question: "Are you strictly a frontend developer?",
    answer:
      "No, I am a full-stack developer. While I excel in React and Next.js, I actively build and deploy backends using Python, Laravel, and Firebase.",
  },
] as const;

export function RecruiterFAQSection() {
  const [openId, setOpenId] = React.useState<string | null>(FAQ_ITEMS[0].id);
  const mailto = `mailto:${portfolioData.contact.email}`;

  return (
    <section
      id="recruiter-faq"
      className="scroll-mt-28 border-t border-black/10 py-16 dark:border-white/10 sm:py-20"
      aria-labelledby="recruiter-faq-heading"
    >
      <header className="mb-8">
        <p className="font-mono text-xs font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          For recruiters
        </p>
        <h2
          id="recruiter-faq-heading"
          className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-3xl"
        >
          Quick answers
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-base">
          Straight responses to the questions that usually come up first.
        </p>
      </header>

      <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
        {FAQ_ITEMS.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div key={item.id}>
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full items-start gap-3 py-4 text-left transition hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-ring dark:hover:text-white"
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${item.id}`}
                id={`faq-trigger-${item.id}`}
              >
                <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                  <motion.span
                    initial={false}
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="inline-flex"
                  >
                    {isOpen ? (
                      <Minus className="h-4 w-4" aria-hidden />
                    ) : (
                      <Plus className="h-4 w-4" aria-hidden />
                    )}
                  </motion.span>
                </span>
                <span className="pt-1 text-base font-medium text-zinc-950 dark:text-white">
                  {item.question}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    id={`faq-panel-${item.id}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${item.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pb-5 pl-11 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-[15px] sm:leading-7">
                      {item.answer}
                    </p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Hire-me CTA */}
      <div
        className={cn(
          "relative mt-12 overflow-hidden rounded-2xl border p-6 sm:p-8",
          "border-emerald-500/35 bg-gradient-to-br from-emerald-500/[0.08] via-zinc-100/80 to-sky-500/[0.06]",
          "shadow-[0_0_0_1px_rgba(16,185,129,0.12),0_20px_50px_-20px_rgba(16,185,129,0.25)]",
          "dark:border-emerald-400/25 dark:from-emerald-500/10 dark:via-zinc-950 dark:to-sky-500/5",
          "dark:shadow-[0_0_0_1px_rgba(52,211,153,0.15),0_24px_60px_-24px_rgba(16,185,129,0.2)]",
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(16,185,129,0.15),transparent)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(52,211,153,0.12),transparent)]"
          aria-hidden
        />
        <div className="relative">
          <h3 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Looking for a versatile developer who ships?
          </h3>
          <p className="mt-3 max-w-xl text-gray-600 dark:text-gray-400">
            I specialize in building full-stack web and mobile solutions. Available for remote roles or
            freelance projects.
          </p>
          <a
            href={mailto}
            className={cn(
              "mt-6 inline-flex min-h-[48px] items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition",
              "bg-zinc-950 text-white shadow-lg hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70 focus-visible:ring-offset-2 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 dark:focus-visible:ring-offset-zinc-950",
            )}
          >
            <span className="inline-flex items-center gap-2">
              <span className="text-white/60 dark:text-zinc-500" aria-hidden>
                [
              </span>
              Let&apos;s talk details
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
              <span className="text-white/60 dark:text-zinc-500" aria-hidden>
                ]
              </span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
