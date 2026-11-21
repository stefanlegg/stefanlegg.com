import { expect, test } from "@playwright/test";
import { projects } from "./projects.ts";

test("history preserves the canvas and restores the overview link and scroll", async ({ page }) => {
	await page.goto("/");
	const canvas = await page.locator("canvas").elementHandle();
	const link = page.locator("#index-catalogs");
	await link.focus();
	const savedScroll = await page.evaluate(() => scrollY);
	await page.keyboard.press("Enter");
	await expect(page.getByRole("heading", { name: "Catalogs", exact: true })).toBeFocused();
	expect(await canvas?.evaluate((el) => el === document.querySelector("canvas"))).toBe(true);
	await page.goBack();
	await expect(link).toBeFocused();
	expect(await page.evaluate(() => scrollY)).toBe(savedScroll);
	await page.goForward();
	await expect(page.locator("h1")).toHaveText("Catalogs");
});

test("rapid selection settles on the last project", async ({ page }) => {
	await page.goto("/");
	await page.route("**/work/cart-transform/", async (route) => {
		await new Promise((resolve) => setTimeout(resolve, 200));
		await route.continue().catch(() => {});
	});
	await page.locator("#star-cart-transform").click({ noWaitAfter: true });
	await page.locator("#star-lanschool-air").click({ noWaitAfter: true });
	await expect(page.getByRole("heading", { name: "LanSchool Air", exact: true })).toBeFocused();
	await expect(page).toHaveURL(/\/work\/lanschool-air\/$/);
	await expect(page.locator("#star-lanschool-air")).toHaveAttribute("aria-current", "page");
});

test("each project works directly with reduced motion", async ({ page }) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	for (const project of projects) {
		await page.goto(project.path);
		await expect(page.locator("h1")).toHaveText(project.title);
		await expect(page.locator(".chart-plane")).toHaveCSS("transition-duration", "0s");
		const inView = await page.locator(".marker").evaluateAll((elements) =>
			elements.every((el) => {
				const rect = el.getBoundingClientRect();
				return rect.left >= 0 && rect.right <= innerWidth;
			}),
		);
		expect(inView).toBe(true);
	}
});

test.describe("static HTML", () => {
	test.use({ javaScriptEnabled: false });
	test("links, refresh, and unknown URLs", async ({ page }) => {
		for (const project of projects) {
			await page.goto("/");
			await page.locator("#index-" + project.slug).click();
			expect((await page.reload())?.status()).toBe(200);
			await expect(page.locator("h1")).toHaveText(project.title);
			await expect(page.locator(".source")).toHaveAttribute("href", project.link);
		}
		expect((await page.goto("/missing-project/"))?.status()).toBe(404);
	});
});
