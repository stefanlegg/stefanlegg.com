import work from "../../src/data/work.ts";

// The point is a percentage of the chart, so the composition survives resizing.
const points = [
	{ title: "Cart Transform", x: 40, y: 21 },
	{ title: "LanSchool Air", x: 19, y: 74 },
	{ title: "Catalogs", x: 68, y: 60 },
];

export const projects = points.map(({ title, x, y }) => {
	const item = work.find((entry) => entry.title === title);
	if (!item) throw new Error(`Unknown portfolio entry: ${title}`);
	const slug = title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/-$/, "");
	return { ...item, slug, path: `/work/${slug}/`, x, y };
});

export type Project = (typeof projects)[number];
