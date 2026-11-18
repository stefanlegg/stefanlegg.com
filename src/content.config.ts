import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const postsCollection = defineCollection({
	loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/posts" }),
	schema: z.object({
		title: z.string(),
		publishedAt: z.coerce.date(),
		modifiedAt: z.coerce.date().optional(),
		description: z.string(),
		isDraft: z.boolean().default(false),
	}),
});

const bookmarksCollection = defineCollection({
	loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/bookmarks" }),
	schema: z.object({
		title: z.string(),
		publishedAt: z.coerce.date(),
		description: z.string(),
		url: z.url(),
	}),
});

export const collections = {
	posts: postsCollection,
	bookmarks: bookmarksCollection,
};
