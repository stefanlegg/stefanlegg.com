import { getViteConfig } from "astro/config";
import type { TestUserConfig } from "vitest/config";

const config: Parameters<typeof getViteConfig>[0] & { test: TestUserConfig } = {
	test: {
		include: ["src/**/*.test.ts"],
	},
};

export default getViteConfig(config);
