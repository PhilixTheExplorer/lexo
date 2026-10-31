import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const lang = z.enum(["en", "my"]);

/** Entry ids are "<lang>/<slug>"; the slug is shared across translations. */
const docs = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/docs" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lang,
    group: z.enum(["start", "guides", "reference", "help"]),
    order: z.number(),
    navTitle: z.string().optional(),
    updated: z.coerce.date(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lang,
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    /** Shared by translations of the same article so hreflang can pair them. */
    translationKey: z.string().optional(),
    minutes: z.number(),
    /** Breaks ties between posts published the same day; higher sorts first. */
    weight: z.number().default(0),
  }),
});

export const collections = { docs, blog };
