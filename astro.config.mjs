import sitemap from "@astrojs/sitemap";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import robotsTxt from "astro-robots-txt";
import { defineConfig, fontProviders } from "astro/config";
import { SITE_URL } from "./src/data/config";

// https://astro.build/config
export default defineConfig({
	integrations: [sitemap(), robotsTxt()],
	compressHTML: true,
	fonts: [
		{
			name: "Crimson Pro",
			cssVariable: "--font-body",
			provider: fontProviders.google(),
			weights: ["200 700"],
			styles: ["normal"],
			subsets: ["latin"],
			fallbacks: ["Georgia", "serif"],
		},
		{
			name: "Crimson Pro",
			cssVariable: "--font-body",
			provider: fontProviders.google(),
			weights: ["300 400"],
			styles: ["italic"],
			subsets: ["latin"],
			fallbacks: ["Georgia", "serif"],
		},
		{
			name: "JetBrains Mono",
			cssVariable: "--font-mono",
			provider: fontProviders.google(),
			weights: ["300 700"],
			styles: ["normal"],
			subsets: ["latin"],
			fallbacks: ["monospace"],
		},
	],
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
