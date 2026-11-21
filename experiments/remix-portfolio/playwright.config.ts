import { defineConfig, devices } from "@playwright/test";

const preview = process.env.PREVIEW_URL;
export default defineConfig({
	testMatch: "**/*.pw.ts",
	use: {
		baseURL: preview ?? "http://127.0.0.1:4412",
		launchOptions: { executablePath: process.env.CHROMIUM_PATH },
	},
	projects: [
		{ name: "desktop", use: { viewport: { width: 1280, height: 800 } } },
		{ name: "phone", use: { ...devices["Pixel 7"], viewport: { width: 360, height: 640 } } },
	],
	webServer: preview
		? undefined
		: {
				command: "npm run build && python3 -m http.server 4412 --bind 127.0.0.1 --directory dist",
				url: "http://127.0.0.1:4412/",
			},
});
