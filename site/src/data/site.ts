import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// The Python package is the source of truth for the version; the site never hard-codes it.
// Resolved from the cwd because prerendered chunks run from a different directory.
export const REPO_ROOT = resolve(process.cwd(), "..");
const initPy = readFileSync(resolve(REPO_ROOT, "src/lexo/__init__.py"), "utf-8");
const versionMatch = initPy.match(/__version__\s*=\s*"([^"]+)"/);
if (!versionMatch?.[1]) throw new Error("Could not read __version__ from src/lexo/__init__.py");

export const VERSION = versionMatch[1];

export const LINKS = {
  repo: "https://github.com/PhilixTheExplorer/lexo",
  releases: "https://github.com/PhilixTheExplorer/lexo/releases",
  issues: "https://github.com/PhilixTheExplorer/lexo/issues",
  changelog: "https://github.com/PhilixTheExplorer/lexo/blob/main/CHANGELOG.md",
  license: "https://github.com/PhilixTheExplorer/lexo/blob/main/LICENSE",
  contributing: "https://github.com/PhilixTheExplorer/lexo/blob/main/CONTRIBUTING.md",
  architecture: "https://github.com/PhilixTheExplorer/lexo/blob/main/docs/ARCHITECTURE.md",
  readmeMy: "https://github.com/PhilixTheExplorer/lexo/blob/main/README.my.md",
  pypi: "https://pypi.org/project/lexo/",
  uv: "https://docs.astral.sh/uv/",
  pipx: "https://pipx.pypa.io/",
  python: "https://www.python.org/downloads/",
  gcloud: "https://console.cloud.google.com/",
  author: "https://github.com/PhilixTheExplorer",
} as const;

export const INSTALL = {
  uv: "uv tool install lexo",
  pipx: "pipx install lexo",
  pip: "python -m pip install lexo",
} as const;

export type InstallMethod = keyof typeof INSTALL;

export const AUTHOR = "PhilixTheExplorer";
export const LICENSE_NAME = "AGPL-3.0-or-later";
export const PYTHON_REQUIRES = "3.11";

export const VIDEOS = [
  {
    id: "setup",
    youtubeId: "63zjwU0nvYQ",
    duration: "PT1M34S",
    seconds: 94,
    uploaded: "2026-06-22",
  },
  {
    id: "scanned",
    youtubeId: "sZEkBJs_2rU",
    duration: "PT37S",
    seconds: 37,
    uploaded: "2026-06-22",
  },
  {
    id: "legacy",
    youtubeId: "JRJYKZwi5VE",
    duration: "PT45S",
    seconds: 45,
    uploaded: "2026-06-22",
  },
] as const;

export type VideoId = (typeof VIDEOS)[number]["id"];

export const PROMO = {
  youtubeId: "E01l9d_7Ewk",
  duration: "PT47S",
  seconds: 47,
  uploaded: "2026-10-24",
} as const;
