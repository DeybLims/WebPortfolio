"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Minus, Plus } from "lucide-react";
import { portfolioData } from "@/lib/portfolio-data";
import { calendlyUrl } from "@/lib/calendly";
import { Section } from "@/components/ui/section";

const FAQ_ITEMS = [
  {
    id: "availability",
    question: "What is your current availability and preferred role?",
    answer:
      "I am open to full-time remote roles, and to contract work.",
  },
  {
    id: "location",
    question: "Where are you located and what are your working hours?",
    answer:
      "I am based in Iloilo City, Philippines (PHT / UTC+8). I can overlap with US, EU, or AU hours.",
  },
  {
    id: "frontend",
    question: "Are you strictly a frontend developer?",
    answer:
      "No. I also build and deploy backends with Python, Laravel, and Firebase, alongside React and Next.js.",
  },
] as const;

export function RecruiterFAQSection() {
  const [openId, setOpenId] = React.useState<string | null>(FAQ_ITEMS[0].id);
  const mailto = `mailto:${portfolioData.contact.email}`;

  return (
    <Section
      id="recruiter-faq"
      titleId="recruiter-faq-heading"
      className="site-section--stack"
      eyebrow="For recruiters"
      title="Quick answers"
      description="The questions that usually come up first."
    >

      <div className="border-t border-[var(--line)]">
        {FAQ_ITEMS.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div key={item.id} className="border-b border-[var(--line)]">
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full items-baseline justify-between gap-4 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-ring"
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${item.id}`}
                id={`faq-trigger-${item.id}`}
              >
                <span className="font-serif text-xl">{item.question}</span>
                <span className="shrink-0 font-mono text-xs text-[var(--muted)]">
                  {isOpen ? (
                    <Minus className="h-4 w-4" aria-hidden />
                  ) : (
                    <Plus className="h-4 w-4" aria-hidden />
                  )}
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
                    <p className="pb-5 text-base leading-7 text-[var(--muted)]">
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
      <div className="mt-12 border-t border-[var(--line)] pt-8">
        <h3 className="font-serif text-2xl tracking-[-0.02em]">Hiring?</h3>
        <p className="mt-3 max-w-xl text-base leading-7 text-[var(--muted)]">
          I take remote full-time roles and contract work. I build web and mobile software.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href={mailto}
            className="inline-flex min-h-11 items-center gap-2 bg-[var(--ink)] px-4 text-sm text-[var(--paper)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-ring focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)]"
          >
            Email me
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
          <a
            href={calendlyUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center border border-[var(--line)] px-4 text-sm text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-ring"
          >
            Book a call
          </a>
        </div>
      </div>
    </Section>
  );
}
