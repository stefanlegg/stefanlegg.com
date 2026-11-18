import sitemap from "@astrojs/sitemap";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import robotsTxt from "astro-robots-txt";
import { defineConfig } from "astro/config";
import { SITE_URL } from "./src/data/config";

// https://astro.build/config
export default defineConfig({
	integrations: [sitemap(), robotsTxt()],
	compressHTML: true,
	vite: {
		css: {
			postcss: {
				plugins: [tailwindcss(), autoprefixer()],
			},
		},
	},
	site: SITE_URL,
	markdown: {
		syntaxHighlight: "shiki",
		shikiConfig: {
			theme: "nord",
			wrap: false,
		},
	},
});
