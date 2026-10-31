import { DEFAULT_LANG, type Lang, LOCALES, SECTIONS, type SectionKey, type UiKey, ui } from "./ui";

export function isLang(value: unknown): value is Lang {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

export function langFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split("/");
  return isLang(first) ? first : DEFAULT_LANG;
}

export function useT(lang: Lang) {
  return (key: UiKey, vars?: Record<string, string | number>): string => {
    let text: string = ui[lang][key] ?? ui[DEFAULT_LANG][key];
    if (vars) {
      for (const [name, value] of Object.entries(vars))
        text = text.replace(`{${name}}`, String(value));
    }
    return text;
  };
}

/** Localized absolute path with the trailing slash the site always uses. */
export function href(lang: Lang, path = ""): string {
  const clean = path.replace(/^\/+/, "");
  const bare = clean === "" || clean.endsWith("/") || /[#?]|\.[a-z0-9]+$/i.test(clean);
  const withSlash = bare ? clean : `${clean}/`;
  return `/${lang}/${withSlash}`;
}

export function sectionHref(lang: Lang, key: SectionKey): string {
  const section = SECTIONS.find((s) => s.key === key);
  return href(lang, section?.path ?? "");
}

/** The same page in another locale: swap the leading locale segment. */
export function swapLang(pathname: string, target: Lang): string {
  const parts = pathname.split("/");
  if (isLang(parts[1])) parts[1] = target;
  else parts.splice(1, 0, target);
  return parts.join("/") || `/${target}/`;
}

export function sectionIndex(key: SectionKey): number {
  return SECTIONS.findIndex((s) => s.key === key) + 1;
}

const BURMESE_DIGITS = "၀၁၂၃၄၅၆၇၈၉";

export function localDigits(value: number | string, lang: Lang): string {
  const text = String(value);
  return lang === "my" ? text.replace(/\d/g, (d) => BURMESE_DIGITS[Number(d)] ?? d) : text;
}

export function formatDate(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === "my" ? "my-MM" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export const staticLangPaths = () => LOCALES.map((lang) => ({ params: { lang } }));
