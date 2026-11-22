import { readFile, cp, mkdir, mkdtemp, rename, rm, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { build } from "esbuild";
import { renderToString } from "remix/component/server";
import { projects } from "./projects.ts";
import { posts, bookmarks } from "./content.ts";
import { postImage } from "../../src/lib/post-image.ts";
import { documentView, notFound, type Page } from "./views.tsx";

process.chdir(import.meta.dirname);
const staging = await mkdtemp(".export-");
try {
	const bundle = await build({
		entryPoints: ["browser.ts", "style.css"],
		entryNames: "assets/[name]-[hash]",
		assetNames: "assets/[name]-[hash]",
		loader: { ".woff2": "file", ".webp": "file" },
		bundle: true,
		format: "esm",
		minify: true,
		metafile: true,
		outdir: staging,
	});
	function asset(entryPoint: string) {
		const output = Object.entries(bundle.metafile.outputs).find(
			([, file]) => file.entryPoint === entryPoint,
		);
		if (!output) throw new Error(`Missing output for ${entryPoint}`);
		return "/" + relative(staging, output[0]);
	}
	const assets = { script: asset("browser.ts"), css: asset("style.css") };
	async function write(path: string, body: string | Uint8Array) {
		const file = join(staging, path);
		await mkdir(dirname(file), { recursive: true });
		await writeFile(file, body, { flag: "wx" });
	}
	const [jetbrainsMono, crimsonPro] = await Promise.all([
		readFile(
			new URL(
				import.meta.resolve(
					"@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff",
				),
			),
		),
		readFile(
			new URL(
				import.meta.resolve("@fontsource/crimson-pro/files/crimson-pro-latin-400-normal.woff"),
			),
		),
	]);
	const routes: [string, Page][] = [
		["/", { kind: "home" }],
		["/posts/", { kind: "posts" }],
		["/bookmarks/", { kind: "bookmarks" }],
		...projects.map((project): [string, Page] => [project.path, { kind: "project", project }]),
		...posts.map((post): [string, Page] => [post.path, { kind: "article", post }]),
	];
	for (const [path, page] of routes) {
		await write(
			join(path, "index.html"),
			"<!doctype html>" + (await renderToString(documentView(assets, page))),
		);
		if (page.kind === "article")
			await write(
				`og/${page.post.slug}.png`,
				await postImage(page.post.title, page.post.description, { jetbrainsMono, crimsonPro }),
			);
	}
	// Pages handles existing bookmark permalinks before serving static files.
	await write(
		"_redirects",
		bookmarks
			.map(
				(b) => `${b.path.slice(0, -1)} ${b.url} 302
${b.path} ${b.url} 302`,
			)
			.join("\n") + "\n",
	);
	await cp("../../public/og-image.png", join(staging, "og-image.png"));
	await writeFile(
		join(staging, "404.html"),
		"<!doctype html>" + (await renderToString(notFound(assets.css))),
	);
	await cp("../../public/favicon.svg", join(staging, "favicon.svg"));
	await rm("dist", { recursive: true, force: true });
	await rename(staging, "dist");
} finally {
	await rm(staging, { recursive: true, force: true });
}
