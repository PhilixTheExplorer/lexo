import { type CollectionEntry, getCollection } from "astro:content";
import type { Lang } from "~/i18n/ui";

export type Post = CollectionEntry<"blog">;

export function postSlug(post: Post): string {
  return post.id.split("/").slice(1).join("/");
}

export async function postsFor(lang: Lang): Promise<Post[]> {
  const posts = await getCollection("blog", (p) => p.data.lang === lang);
  return posts.sort(
    (a, b) =>
      b.data.published.getTime() - a.data.published.getTime() || b.data.weight - a.data.weight,
  );
}

/** Other-language versions of a post, paired by translationKey. */
export async function translationsOf(post: Post): Promise<Partial<Record<Lang, Post>>> {
  const key = post.data.translationKey;
  if (!key) return { [post.data.lang]: post };
  const all = await getCollection("blog", (p) => p.data.translationKey === key);
  return Object.fromEntries(all.map((p) => [p.data.lang, p]));
}
