"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { NowEntry, NowPageContent } from "@/lib/now";
import { saveNowPage } from "@/app/admin/actions";

type SectionDraft = {
  id: string;
  label: string;
  paragraphs: string;
  items: string;
  href: string;
  linkLabel: string;
};

function toDraft(section: NowEntry): SectionDraft {
  return {
    id: section.id,
    label: section.label,
    paragraphs: section.paragraphs.join("\n\n"),
    items: section.items?.join("\n") ?? "",
    href: section.href ?? "",
    linkLabel: section.linkLabel ?? "",
  };
}

function fromDraft(section: SectionDraft): NowEntry {
  const entry: NowEntry = {
    id: section.id.trim(),
    label: section.label.trim(),
    paragraphs: section.paragraphs
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean),
  };
  const items = section.items
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
  if (items.length > 0) entry.items = items;
  if (section.href.trim() && section.linkLabel.trim()) {
    entry.href = section.href.trim();
    entry.linkLabel = section.linkLabel.trim();
  }
  return entry;
}

export function NowEditor({
  initial,
  tableReady,
}: {
  initial: NowPageContent;
  tableReady: boolean;
}) {
  const router = useRouter();
  const [updatedLabel, setUpdatedLabel] = React.useState(initial.updatedLabel);
  const [updatedDate, setUpdatedDate] = React.useState(initial.updatedDate);
  const [intro, setIntro] = React.useState(initial.intro);
  const [sections, setSections] = React.useState<SectionDraft[]>(initial.sections.map(toDraft));
  const [status, setStatus] = React.useState(tableReady ? "" : "Apply the now_page SQL before the first save.");
  const [pending, setPending] = React.useState(false);

  function updateSection(index: number, patch: Partial<SectionDraft>) {
    setSections((current) => current.map((section, i) => (i === index ? { ...section, ...patch } : section)));
  }

  async function onSave(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setStatus("");
    const result = await saveNowPage({
      updatedLabel,
      updatedDate,
      intro,
      sections: sections.map(fromDraft),
    });
    setPending(false);
    if ("error" in result) {
      setStatus(result.error);
      return;
    }
    setStatus("Saved. /now will show this copy.");
    router.refresh();
  }

  return (
    <form className="admin-editor now-admin" onSubmit={(event) => void onSave(event)}>
      <div>
        <h1 className="type-title">Now</h1>
        <p className="admin-note">
          This is the public page at /now. Learning items, and every other section, are edited here. Until a row
          exists, the site uses the defaults in src/lib/now.ts.
        </p>
      </div>

      <div className="admin-editor-fields">
        <label className="admin-field">
          <span>Last updated</span>
          <input value={updatedLabel} onChange={(event) => setUpdatedLabel(event.target.value)} required />
        </label>
        <label className="admin-field">
          <span>Date</span>
          <input
            type="month"
            value={updatedDate.slice(0, 7)}
            onChange={(event) => setUpdatedDate(event.target.value)}
            required
          />
        </label>
        <label className="admin-field">
          <span>Intro</span>
          <textarea rows={3} value={intro} onChange={(event) => setIntro(event.target.value)} required />
        </label>
      </div>

      <ol className="now-admin-sections">
        {sections.map((section, index) => (
          <li key={section.id} className="now-admin-section">
            <p className="meta">{section.id}</p>
            <label className="admin-field">
              <span>Section</span>
              <input
                value={section.label}
                onChange={(event) => updateSection(index, { label: event.target.value })}
                required
              />
            </label>
            <label className="admin-field">
              <span>Paragraphs</span>
              <textarea
                rows={4}
                value={section.paragraphs}
                onChange={(event) => updateSection(index, { paragraphs: event.target.value })}
              />
            </label>
            <label className="admin-field">
              <span>Items, one per line</span>
              <textarea
                rows={3}
                value={section.items}
                onChange={(event) => updateSection(index, { items: event.target.value })}
                placeholder={section.id === "learning" ? "System design\nMentoring as a new senior" : ""}
              />
            </label>
            <label className="admin-field">
              <span>Link</span>
              <input
                value={section.href}
                onChange={(event) => updateSection(index, { href: event.target.value })}
                placeholder="/blog/example or https://"
                spellCheck={false}
              />
            </label>
            <label className="admin-field">
              <span>Link label</span>
              <input
                value={section.linkLabel}
                onChange={(event) => updateSection(index, { linkLabel: event.target.value })}
              />
            </label>
          </li>
        ))}
      </ol>

      <div className="admin-actions">
        <button type="submit" className="button-ink" disabled={pending}>
          Save
        </button>
        <a href="/now" className="text-button">
          View page
        </a>
        <p className="admin-status" role="status">
          {pending ? "Saving…" : status}
        </p>
      </div>
    </form>
  );
}
