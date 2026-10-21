"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { nowEntries } from "@/lib/now";

export function NowBoard() {
  const reduce = useReducedMotion();

  return (
    <ol className="now-list">
      {nowEntries.map((entry, index) => (
        <motion.li
          key={entry.id}
          className="now-row"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.45, delay: reduce ? 0 : index * 0.05, ease: "easeOut" }}
        >
          <p className="now-index" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </p>
          <div>
            <h2 id={`${entry.id}-title`} className="now-label" tabIndex={-1}>
              {entry.label}
            </h2>
            {entry.paragraphs.map((paragraph) => (
              <p key={paragraph} className="now-body">
                {paragraph}
              </p>
            ))}
            {entry.items && entry.items.length > 0 ? (
              <ul className="now-items">
                {entry.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
            {entry.href && entry.linkLabel ? (
              <p className="now-link-row">
                <Link href={entry.href} className="text-link">
                  {entry.linkLabel}
                </Link>
              </p>
            ) : null}
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
