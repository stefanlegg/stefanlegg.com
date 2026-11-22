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

test("browse the full work collection and operate the product examples", async ({ page }) => {
	await page.goto("/");
	await page.locator("#browse-projects").click();
	await expect(page.locator("h1")).toHaveText("Cart Transform");
	await page.getByText("Components", { exact: true }).click();
	await expect(page.getByText("1 × Field notebook", { exact: true })).toBeVisible();
	await expect(page.getByText("1 × Writing kit", { exact: true })).toBeHidden();
	await page.locator("#prev-project").click();
	await expect(page.locator("h1")).toHaveText(projects.at(-1)!.title);
	await page.goto("/work/catalogs/");
	await page.getByText("Wholesale", { exact: true }).click();
	await expect(page.getByText("Case of 12 notebooks", { exact: true })).toBeVisible();
});

test("read a post, filter bookmarks, and restore the list on Back", async ({ page }) => {
	await page.goto("/");
	const stars = await page.locator("canvas").elementHandle();
	await page.locator("#nav-posts").click();
	await page.locator(".post-link").first().click();
	await expect(page.locator("article .post h2").first()).toBeVisible();
	expect(await stars?.evaluate((el) => el === document.querySelector("canvas"))).toBe(true);
	const og = await page.locator('meta[property="og:image"]').getAttribute("content");
	const image = await page.request.get(new URL(og!).pathname);
	expect(image.status()).toBe(200);
	expect((await image.body()).subarray(1, 4).toString()).toBe("PNG");
	await page.locator("#nav-bookmarks").click();
	const filter = page.getByRole("searchbox");
	await filter.fill("no-such-saved-link");
	await expect(page.locator("#bookmark-count")).toHaveText("No matching bookmarks");
	await filter.fill("tiptap");
	await expect(page.locator(".saved-link:visible")).toHaveCount(1);
	await page.locator("#nav-home").click();
	await page.goBack();
	await expect(filter).toHaveValue("tiptap");
	await expect(page.locator(".saved-link:visible")).toHaveText(/Tiptap/);
	await page.locator("#visit-clock").click();
	await expect(page.locator("#visit-clock")).toHaveText(/T\+/);
});

test.describe("archives as static documents", () => {
	test.use({ javaScriptEnabled: false });
	test("article and bookmarks remain readable", async ({ page }) => {
		await page.goto("/posts/");
		await page.locator(".post-link").first().click();
		await expect(page.locator("article .post p").first()).toBeVisible();
		await page.locator("#nav-bookmarks").click();
		await expect(page.locator("#bookmark-tiptap")).toHaveAttribute("href", /^https:\/\/tiptap.dev/);
		await expect(page.getByRole("searchbox")).toHaveCount(0);
	});
});
