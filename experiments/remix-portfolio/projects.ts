import work from "../../src/data/work.ts";

const featured = ["Cart Transform", "LanSchool Air", "Catalogs"];
const shortNames: Record<string, string> = {
	"Unified Markets & Catalogs Experience": "Markets & catalogs",
	"Quantity Rules & Volume Pricing": "Volume pricing",
	"Polaris & Accessibility": "Polaris",
};
const positions = [
	{ body: "moon", x: 36, y: 24 },
	{ body: "asteroid", x: 22, y: 75 },
	{ body: "satellite", x: 76, y: 55 },
];

const orderedWork = [
	...featured.map((title) => {
		const item = work.find((item) => item.title === title);
		if (!item) throw new Error(`Missing featured project: ${title}`);
		return item;
	}),
	...work.filter((item) => !featured.includes(item.title)),
];
export const projects = orderedWork.map((item, index) => {
	const slug = item.title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/-$/, "");
	return {
		...item,
		slug,
		path: `/work/${slug}/`,
		label: shortNames[item.title] ?? item.title,
		...positions[index % positions.length],
	};
});
export type Project = (typeof projects)[number];

export function chartProjects(selected?: Project) {
	const index = selected ? projects.indexOf(selected) : 0;
	const start = index - (index % positions.length);
	return projects.slice(start, start + positions.length);
}
