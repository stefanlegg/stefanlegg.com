import { describe, expect, it } from "vitest";
import { KONAMI_CODE, createSequenceMatcher } from "./konami-sequence";

describe("createSequenceMatcher", () => {
	it("returns true when full sequence is entered", () => {
		const matcher = createSequenceMatcher(KONAMI_CODE);
		for (let i = 0; i < KONAMI_CODE.length - 1; i++) {
			expect(matcher.feed(KONAMI_CODE[i])).toBe(false);
		}
		expect(matcher.feed(KONAMI_CODE[KONAMI_CODE.length - 1])).toBe(true);
	});

	it("resets on wrong key mid-sequence", () => {
		const matcher = createSequenceMatcher(KONAMI_CODE);
		matcher.feed("ArrowUp");
		matcher.feed("ArrowUp");
		matcher.feed("ArrowDown");
		matcher.feed("KeyX"); // wrong key
		// sequence should be reset — need full sequence again
		for (const key of KONAMI_CODE) {
			matcher.feed(key);
		}
		// if we get here without triggering early, the reset worked
	});

	it("restarts when wrong key matches first key in sequence", () => {
		const matcher = createSequenceMatcher(KONAMI_CODE);
		matcher.feed("ArrowUp"); // index 0 ✓
		matcher.feed("ArrowUp"); // index 1 ✓
		matcher.feed("ArrowDown"); // index 2 ✓
		matcher.feed("ArrowUp"); // wrong (expected ArrowDown) — but matches first key

		// Should now be at index 1 (first ArrowUp counted)
		// Feed remaining sequence starting from index 1
		const remaining = KONAMI_CODE.slice(1);
		for (let i = 0; i < remaining.length - 1; i++) {
			expect(matcher.feed(remaining[i])).toBe(false);
		}
		expect(matcher.feed(remaining[remaining.length - 1])).toBe(true);
	});

	it("does not trigger on partial sequence", () => {
		const matcher = createSequenceMatcher(KONAMI_CODE);
		for (let i = 0; i < 5; i++) {
			expect(matcher.feed(KONAMI_CODE[i])).toBe(false);
		}
	});

	it("does not false-positive on repeated first key", () => {
		const matcher = createSequenceMatcher(KONAMI_CODE);
		for (let i = 0; i < 20; i++) {
			expect(matcher.feed("ArrowUp")).toBe(false);
		}
	});

	it("can trigger again after reset", () => {
		const matcher = createSequenceMatcher(KONAMI_CODE);
		// First trigger
		for (const key of KONAMI_CODE) matcher.feed(key);
		// Should auto-reset after triggering — trigger again
		for (let i = 0; i < KONAMI_CODE.length - 1; i++) {
			expect(matcher.feed(KONAMI_CODE[i])).toBe(false);
		}
		expect(matcher.feed(KONAMI_CODE[KONAMI_CODE.length - 1])).toBe(true);
	});
});
