import { expect, test } from "@playwright/test";
import { itemPath, orbitPath, pages, planets } from "./system.ts";

test("travel from the system to a planet to a moon and back", async ({ page }) => {
	await page.goto("/");
	const canvas = await page.locator("canvas").elementHandle();
	await page.locator("#planet-work").click();
	await expect(page.locator("h1")).toHaveText("Work");
	await page.locator("#moon-cart-transform").focus();
	await page.keyboard.press("Enter");
	await expect(page.locator("h1")).toHaveText("Cart Transform");
	await expect(page.locator(".moon-link[aria-current]")).toHaveText("Cart Transform");
	expect(await canvas?.evaluate((el) => el === document.querySelector("canvas"))).toBe(true);
	await page.goBack();
	await expect(page.locator("#moon-cart-transform")).toBeFocused();
	await page.goBack();
	await expect(page.locator("#planet-work")).toBeFocused();
	await page.goForward();
	await expect(page.locator("h1")).toHaveText("Work");
});

test("moon sets are reachable and labels fit the map", async ({ page }) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	for (const planet of planets) {
		await page.goto(orbitPath(planet));
		const seen: string[] = [];
		for (;;) {
			const moons = page.locator(".moon-link");
			seen.push(...(await moons.allTextContents()));
			expect(
				await moons.evaluateAll((nodes) =>
					nodes.every((el) => {
						const r = el.getBoundingClientRect();
						return r.left >= 0 && r.right <= innerWidth;
					}),
				),
			).toBe(true);
			await expect(page.locator(".camera")).toHaveCSS("transition-duration", "0s");
			if (!(await page.locator("#next-orbit").count())) break;
			const before = page.url();
			await page.locator("#next-orbit").click();
			await expect(page).not.toHaveURL(before);
			await expect(moons.first()).toHaveText(planet.items[seen.length].title);
		}
		expect(seen).toEqual(planet.items.map((i) => i.title));
	}
});

test("rapid section changes settle on the last planet", async ({ page }) => {
	await page.goto("/");
	await page.route("**/work/", async (route) => {
		await new Promise((resolve) => setTimeout(resolve, 200));
		await route.continue().catch(() => {});
	});
	await page.locator("#nav-work").click({ noWaitAfter: true });
	await page.locator("#nav-bookmarks").click();
	await expect(page.locator("h1")).toHaveText("Bookmarks");
	await expect(page.locator(".sky")).toHaveAttribute("data-focused", "bookmarks");
});

test.describe("static export", () => {
	test.use({ javaScriptEnabled: false });
	test("every scene works from a direct URL and links to the content", async ({
		page,
		request,
	}) => {
		for (const [path] of pages()) expect((await request.get(path)).status(), path).toBe(200);
		for (const planet of planets) {
			const last = planet.items.at(-1)!;
			await page.goto(orbitPath(planet));
			await page.locator("#index-" + last.slug).click();
			await expect(page).toHaveURL(new URL(itemPath(planet, last), page.url()).href);
			await page.reload();
			await expect(page.locator("h1")).toHaveText(last.title);
			if (last.link) await expect(page.locator(".source")).toHaveAttribute("href", last.link);
			if (last.article) await expect(page.locator("article p").first()).toBeVisible();
		}
		expect((await request.get("/nonexistent-moon/")).status()).toBe(404);
	});
});
