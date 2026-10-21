/** What Dave is doing now. Edit this file; `/now` reads it and nothing else. */

export const nowUpdated = {
  label: "October 2026",
  dateTime: "2026-10",
} as const;

export const nowIntro =
  "I'm Dave Lima, a senior software engineer at Quirao Group in Iloilo, Philippines. This is what I'm doing now.";

export type NowEntry = {
  id: string;
  label: string;
  paragraphs: string[];
  items?: string[];
  href?: string;
  linkLabel?: string;
};

export const nowEntries: NowEntry[] = [
  {
    id: "work",
    label: "Work",
    paragraphs: [
      "I own the backend infrastructure for a commercial construction product at Quirao Group. Details under NDA.",
    ],
  },
  {
    id: "building",
    label: "Building",
    paragraphs: [
      "I'm polishing this portfolio and the blog, and continuing ColorAid, the accessibility work around color vision.",
    ],
  },
  {
    id: "learning",
    label: "Learning",
    paragraphs: ["Two things I want to practice."],
    // PLACEHOLDER — Dave, replace these. They are drafts, not a finished list.
    // Examples to edit: system design, and mentoring as a new senior.
    items: ["System design", "Mentoring as a new senior"],
  },
  {
    id: "writing",
    label: "Writing",
    paragraphs: ["I published a note on what changed from intern to senior."],
    href: "/blog/from-intern-to-senior",
    linkLabel: "From intern to senior: what actually changed",
  },
  {
    id: "life",
    label: "Life",
    paragraphs: ["I'm based in Iloilo City."],
  },
];
