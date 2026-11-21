import { globSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { micromark } from "micromark";
import { parse } from "yaml";
import work from "../../src/data/work.ts";

export type Item = {
	slug: string;
	title: string;
	description: string;
	meta: string;
	link?: string;
	article?: string;
};

export type Planet = {
	id: "work" | "bookmarks" | "posts";
	name: string;
	unit: string;
	summary: string;
	x: number;
	y: number;
	items: Item[];
};

export const moonsPerOrbit = 4;
export const orbitPath = (planet: Planet, orbit = 0) =>
	orbit ? `/${planet.id}/orbit/${orbit + 1}/` : `/${planet.id}/`;
export const itemPath = (planet: Planet, item: Item) => `/${planet.id}/${item.slug}/`;

function collection(id: "bookmarks" | "posts"): Item[] {
	const root = fileURLToPath(new URL(`../../src/content/${id}/`, import.meta.url));
	return globSync("**/[^_]*.md", { cwd: root })
		.flatMap((file) => {
			const source = readFileSync(join(root, file), "utf8");
			const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(source);
			if (!match) throw new Error(`Missing frontmatter: ${file}`);
			const data = parse(match[1]);
			if (data.isDraft) return [];
			const date = new Date(data.publishedAt);
			const item: Item = {
				slug: data.slug ?? file.slice(0, -3),
				title: data.title,
				description: data.description,
				meta:
					id === "posts"
						? new Intl.DateTimeFormat("en", { dateStyle: "long", timeZone: "UTC" }).format(date)
						: new URL(data.url).hostname,
				...(id === "posts"
					? { article: micromark(source.slice(match[0].length)) }
					: { link: data.url }),
			};
			return [{ item, date: date.getTime() }];
		})
		.sort((a, b) => b.date - a.date || a.item.title.localeCompare(b.item.title))
		.map(({ item }) => item);
}

export const planets: Planet[] = [
	{
		id: "work",
		name: "Work",
		unit: "project",
		summary: "Commerce at Shopify and classroom software at LanSchool.",
		x: 26,
		y: 70,
		items: work.map((item) => ({
			slug: item.title
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/-$/, ""),
			title: item.title,
			description: item.description,
			link: item.link,
			meta: [item.company, ...item.techs].join(" · "),
		})),
	},
	{
		id: "posts",
		name: "Writing",
		unit: "post",
		summary: "Notes on building software and finding the next thing to make.",
		x: 60,
		y: 33,
		items: collection("posts"),
	},
	{
		id: "bookmarks",
		name: "Bookmarks",
		unit: "bookmark",
		summary: "Tools, references, and corners of the web worth keeping.",
		x: 84,
		y: 24,
		items: collection("bookmarks"),
	},
];
export type Scene = { planet?: Planet; orbit: number; item?: Item };

export function* pages(): Generator<[string, Scene]> {
	yield ["/", { orbit: 0 }];
	for (const planet of planets) {
		const orbits = Math.max(1, Math.ceil(planet.items.length / moonsPerOrbit));
		for (let orbit = 0; orbit < orbits; orbit++)
			yield [orbitPath(planet, orbit), { planet, orbit }];
		for (const [i, item] of planet.items.entries())
			yield [itemPath(planet, item), { planet, item, orbit: Math.floor(i / moonsPerOrbit) }];
	}
}
