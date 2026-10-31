import { type CollectionEntry, getCollection } from "astro:content";
import type { Lang } from "~/i18n/ui";

export type Doc = CollectionEntry<"docs">;

export const GROUPS = ["start", "guides", "reference", "help"] as const;

export const GROUP_LABELS: Record<Lang, Record<(typeof GROUPS)[number], string>> = {
  en: { start: "Start here", guides: "Guides", reference: "Reference", help: "Help" },
  my: { start: "စတင်ရန်", guides: "လမ်းညွှန်များ", reference: "အညွှန်းများ", help: "အကူအညီ" },
};

export function docSlug(doc: Doc): string {
  return doc.id.split("/").slice(1).join("/");
}

export async function docsFor(lang: Lang): Promise<Doc[]> {
  const all = await getCollection("docs", (d) => d.data.lang === lang);
  return all.sort(
    (a, b) =>
      GROUPS.indexOf(a.data.group) - GROUPS.indexOf(b.data.group) || a.data.order - b.data.order,
  );
}

export async function docsBySlug(): Promise<Map<string, Partial<Record<Lang, Doc>>>> {
  const map = new Map<string, Partial<Record<Lang, Doc>>>();
  for (const doc of await getCollection("docs")) {
    const slug = docSlug(doc);
    map.set(slug, { ...map.get(slug), [doc.data.lang]: doc });
  }
  return map;
}
