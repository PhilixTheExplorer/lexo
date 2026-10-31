import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import type { Lang } from "~/i18n/ui";
import { href, staticLangPaths } from "~/i18n/utils";
import { postSlug, postsFor } from "~/lib/blog";

export const getStaticPaths = staticLangPaths;

export const GET: APIRoute = async ({ params, site }) => {
  const lang = params.lang as Lang;
  const posts = await postsFor(lang);
  return rss({
    title: lang === "my" ? "LEXO ဆောင်းပါးများ" : "LEXO articles",
    description:
      lang === "my"
        ? "မြန်မာ OCR နှင့် စာရွက်စာတမ်း ဒစ်ဂျစ်တယ်ပြောင်းခြင်းဆိုင်ရာ လမ်းညွှန်များ။"
        : "Guides on Burmese OCR and document digitization.",
    site: site ?? "https://lexo.philix.dev",
    customData: `<language>${lang}</language>`,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.published,
      link: href(lang, `blog/${postSlug(post)}/`),
      categories: post.data.tags,
    })),
  });
};
