import { defineCollection, z } from "astro:content";

const postsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    publishedAt: z.date(),
    description: z.string(),
    isPublish: z.boolean(),
    isDraft: z.boolean().default(false),
  }),
});

const bookmarksCollection = defineCollection({
  type: "content", // or "data" if they are not .md/.mdx files with frontmatter
  schema: z.object({
    title: z.string(),
    publishedAt: z.date(),
    description: z.string(),
    // Add other fields if your bookmarks have them, e.g., url: z.string().url()
  }),
});

export const collections = {
  posts: postsCollection,
  bookmarks: bookmarksCollection,
};
