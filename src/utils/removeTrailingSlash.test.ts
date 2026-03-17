import { describe, expect, it } from "vitest";
import removeTrailingSlash from "./removeTrailingSlash";

describe("removeTrailingSlash", () => {
	it("removes trailing slash from path", () => {
		expect(removeTrailingSlash("/posts/")).toBe("/posts");
	});

	it("preserves root path", () => {
		expect(removeTrailingSlash("/")).toBe("/");
	});

	it("returns path unchanged when no trailing slash", () => {
		expect(removeTrailingSlash("/posts")).toBe("/posts");
	});

	it("handles empty string", () => {
		expect(removeTrailingSlash("")).toBe("");
	});

	it("removes trailing slash from nested path", () => {
		expect(removeTrailingSlash("/posts/my-post/")).toBe("/posts/my-post");
	});
});
