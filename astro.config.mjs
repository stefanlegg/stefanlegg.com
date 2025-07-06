import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import robotsTxt from "astro-robots-txt";
import { defineConfig } from "astro/config";
import { SITE_URL } from "./src/data/config";

// https://astro.build/config
export default defineConfig({
	integrations: [tailwind(), sitemap(), robotsTxt()],
	site: SITE_URL,
	markdown: {
		syntaxHighlight: "shiki",
		shikiConfig: {
			theme: "nord",
			wrap: false,
		},
	},
});
