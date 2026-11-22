import { globSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { micromark } from "micromark";
import { parse } from "yaml";

type Entry = { slug: string; title: string; description: string; date: Date; path: string };
export type Post = Entry & { html: string };
export type Bookmark = Entry & { url: string; domain: string };

function entries<T>(
	section: "posts" | "bookmarks",
	make: (entry: Entry, data: Record<string, unknown>, body: string) => T,
) {
	const root = fileURLToPath(new URL(`../../src/content/${section}/`, import.meta.url));
	return globSync("**/[^_]*.md", { cwd: root })
		.flatMap((file) => {
			const source = readFileSync(join(root, file), "utf8");
			const header = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(source);
			if (!header) throw new Error(`Missing frontmatter in ${file}`);
			const data = parse(header[1]);
			if (section === "posts" && data.isDraft !== undefined && typeof data.isDraft !== "boolean")
				throw new Error(`Invalid draft flag in ${file}`);
			if (section === "posts" && data.isDraft === true) return [];
			const slug = data.slug ?? file.slice(0, -3);
			const date = new Date(data.publishedAt);
			if (
				typeof data.title !== "string" ||
				typeof data.description !== "string" ||
				!Number.isFinite(date.getTime()) ||
				typeof slug !== "string" ||
				!/^[\p{L}\p{N}_-]+(?:\/[\p{L}\p{N}_-]+)*$/u.test(slug)
			) {
				throw new Error(`Invalid content entry in ${file}`);
			}
			const entry = {
				slug,
				date,
				title: data.title,
				description: data.description,
				path: `/${section}/${slug}/`,
			};
			return [{ date, file, value: make(entry, data, source.slice(header[0].length)) }];
		})
		.sort((a, b) => b.date.getTime() - a.date.getTime() || a.file.localeCompare(b.file))
		.map((row) => row.value);
}

export const posts = entries<Post>("posts", (entry, _data, body) => ({
	...entry,
	html: micromark(body),
}));
export const bookmarks = entries<Bookmark>("bookmarks", (entry, data) => {
	const url = new URL(String(data.url));
	if (!["https:", "http:"].includes(url.protocol))
		throw new Error(`Invalid bookmark destination: ${entry.slug}`);
	return { ...entry, url: url.href, domain: url.hostname.replace(/^www\./, "") };
});
