import { AUTHOR, LICENSE_NAME, LINKS, PYTHON_REQUIRES, VERSION } from "~/data/site";
import type { Lang } from "~/i18n/ui";
import { useT } from "~/i18n/utils";

type Json = Record<string, unknown>;

const author = { "@type": "Person", name: AUTHOR, url: LINKS.author };

export function softwareApplication(lang: Lang, url: string, description: string): Json {
  const t = useT(lang);
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "LEXO",
    alternateName: "LEXO: Local EXtraction and OCR",
    description,
    url,
    inLanguage: lang,
    applicationCategory: "UtilitiesApplication",
    applicationSubCategory: "OCR",
    operatingSystem: "Windows, macOS, Linux",
    softwareVersion: VERSION,
    softwareRequirements: t("meta.requirements", { py: PYTHON_REQUIRES }),
    downloadUrl: LINKS.pypi,
    installUrl: LINKS.pypi,
    releaseNotes: LINKS.changelog,
    license: "https://www.gnu.org/licenses/agpl-3.0.html",
    isAccessibleForFree: true,
    codeRepository: LINKS.repo,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author,
    keywords:
      "Burmese OCR, Myanmar OCR, Myanmar PDF to text, Myanmar Unicode, scanned PDF OCR, Google Docs OCR",
    featureList: [
      t("meta.features.ocr"),
      t("meta.features.extract"),
      t("meta.features.batch"),
      t("meta.features.tools"),
      t("meta.features.proofread"),
      t("meta.features.export"),
      t("meta.features.interfaces"),
    ],
    copyrightHolder: author,
    copyrightNotice: LICENSE_NAME,
  };
}

export function website(lang: Lang, url: string): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "LEXO",
    url,
    inLanguage: lang,
    publisher: author,
  };
}

export function breadcrumbList(items: { name: string; url: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function article(opts: {
  lang: Lang;
  url: string;
  title: string;
  description: string;
  image: string;
  published: Date;
  modified?: Date | undefined;
  type?: "Article" | "TechArticle";
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": opts.type ?? "Article",
    headline: opts.title,
    description: opts.description,
    inLanguage: opts.lang,
    mainEntityOfPage: opts.url,
    url: opts.url,
    image: [opts.image],
    datePublished: opts.published.toISOString(),
    dateModified: (opts.modified ?? opts.published).toISOString(),
    author,
    publisher: author,
  };
}

export function faqPage(lang: Lang, items: { q: string; a: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: lang,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function videoObject(opts: {
  name: string;
  description: string;
  contentUrl: string;
  thumbnailUrl: string;
  duration: string;
  uploadDate: string;
  lang: Lang;
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: opts.name,
    description: opts.description,
    contentUrl: opts.contentUrl,
    thumbnailUrl: [opts.thumbnailUrl],
    duration: opts.duration,
    uploadDate: opts.uploadDate,
    inLanguage: opts.lang,
  };
}
