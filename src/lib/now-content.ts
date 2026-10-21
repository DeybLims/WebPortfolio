import { revalidatePath, updateTag } from "next/cache";
import { defaultNowPage, type NowEntry, type NowPageContent } from "@/lib/now";
import { createPublicClient } from "@/lib/supabase/public";

export function refreshNow() {
  updateTag("now");
  revalidatePath("/now");
  revalidatePath("/sitemap.xml");
}

export function parseNowPage(value: unknown): NowPageContent | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const updatedLabel = typeof row.updated_label === "string" ? row.updated_label.trim() : "";
  const updatedDate = typeof row.updated_date === "string" ? row.updated_date.trim() : "";
  const intro = typeof row.intro === "string" ? row.intro.trim() : "";
  const sections = parseSections(row.sections);
  if (!updatedLabel || !updatedDate || !intro || !sections) return null;
  return { updatedLabel, updatedDate, intro, sections };
}

export function parseSections(value: unknown): NowEntry[] | null {
  if (!Array.isArray(value) || value.length === 0) return null;
  const sections: NowEntry[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") return null;
    const row = item as Record<string, unknown>;
    const id = typeof row.id === "string" ? row.id.trim() : "";
    const label = typeof row.label === "string" ? row.label.trim() : "";
    if (!id || !label) return null;
    const paragraphs = stringList(row.paragraphs);
    const items = stringList(row.items);
    const href = typeof row.href === "string" ? row.href.trim() : "";
    const linkLabel = typeof row.linkLabel === "string" ? row.linkLabel.trim() : "";
    const entry: NowEntry = { id, label, paragraphs };
    if (items.length > 0) entry.items = items;
    if (href && linkLabel) {
      entry.href = href;
      entry.linkLabel = linkLabel;
    }
    sections.push(entry);
  }
  return sections;
}

function stringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean);
}

export async function getNowPage(): Promise<NowPageContent> {
  const supabase = createPublicClient("now");
  if (!supabase) return defaultNowPage;

  try {
    const { data, error } = await supabase
      .from("now_page")
      .select("updated_label, updated_date, intro, sections")
      .eq("id", 1)
      .maybeSingle();

    if (error || !data) return defaultNowPage;
    return parseNowPage(data) ?? defaultNowPage;
  } catch {
    return defaultNowPage;
  }
}
