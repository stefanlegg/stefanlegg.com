import { cp, mkdir, mkdtemp, rename, rm, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { build } from "esbuild";
import { renderToString } from "remix/component/server";
import { projects } from "./projects.ts";
import { documentView, notFound } from "./views.tsx";

process.chdir(import.meta.dirname);
const staging = await mkdtemp(".export-");
try {
  const bundle = await build({
    entryPoints: ["browser.ts", "style.css"],
    entryNames: "assets/[name]-[hash]",
    assetNames: "assets/[name]-[hash]",
    loader: { ".woff2": "file" },
    bundle: true, format: "esm", minify: true, metafile: true, outdir: staging,
  });
  function asset(entryPoint: string) {
    const output = Object.entries(bundle.metafile.outputs)
      .find(([, file]) => file.entryPoint === entryPoint);
    if (!output) throw new Error(`Missing output for ${entryPoint}`);
    return "/" + relative(staging, output[0]);
  }
  const assets = { script: asset("browser.ts"), css: asset("style.css") };
  for (const project of [undefined, ...projects]) {
    const file = join(staging, project?.path ?? "/", "index.html");
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, "<!doctype html>" + await renderToString(documentView(assets, project)));
  }
  await writeFile(join(staging, "404.html"), "<!doctype html>" + await renderToString(notFound(assets.css)));
  await cp("../../public/favicon.svg", join(staging, "favicon.svg"));
  await rm("dist", { recursive: true, force: true });
  await rename(staging, "dist");
} finally {
  await rm(staging, { recursive: true, force: true });
}
