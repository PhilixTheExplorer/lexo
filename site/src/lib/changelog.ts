import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { REPO_ROOT } from "~/data/site";

export interface ReleaseSection {
  heading: string;
  items: string[];
  paragraphs: string[];
}

export interface Release {
  version: string;
  date: string | undefined;
  intro: string[];
  sections: ReleaseSection[];
}

// CHANGELOG.md (Keep a Changelog) is the single source; the site only reformats it.
export function readChangelog(): Release[] {
  const raw = readFileSync(resolve(REPO_ROOT, "CHANGELOG.md"), "utf-8").replace(/\r\n/g, "\n");
  const releases: Release[] = [];
  let release: Release | undefined;
  let section: ReleaseSection | undefined;
  let buffer: string[] = [];
  let mode: "item" | "para" | undefined;

  const flush = () => {
    const text = buffer.join(" ").replace(/\s+/g, " ").trim();
    buffer = [];
    if (!text || !release) return;
    if (mode === "item" && section) section.items.push(text);
    else if (section) section.paragraphs.push(text);
    else release.intro.push(text);
  };

  for (const line of raw.split("\n")) {
    const releaseMatch = line.match(/^## \[([^\]]+)\](?:\s*-\s*(\S+))?/);
    if (releaseMatch) {
      flush();
      const version = releaseMatch[1] ?? "";
      section = undefined;
      if (version.toLowerCase() === "unreleased") {
        release = undefined;
        continue;
      }
      release = { version, date: releaseMatch[2], intro: [], sections: [] };
      releases.push(release);
      continue;
    }
    if (!release) continue;
    const sectionMatch = line.match(/^### (.+)/);
    if (sectionMatch) {
      flush();
      section = { heading: (sectionMatch[1] ?? "").trim(), items: [], paragraphs: [] };
      release.sections.push(section);
      continue;
    }
    if (/^- /.test(line)) {
      flush();
      mode = "item";
      buffer.push(line.slice(2));
    } else if (line.trim() === "") {
      flush();
      mode = undefined;
    } else {
      if (!mode) mode = "para";
      buffer.push(line.trim());
    }
  }
  flush();
  return releases;
}

export function latestRelease(): Release | undefined {
  return readChangelog()[0];
}

/** Minimal inline Markdown: escape HTML, then render `code`. */
export function inlineMarkdown(text: string): string {
  const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return escaped.replace(/`([^`]+)`/g, '<code lang="en">$1</code>');
}
