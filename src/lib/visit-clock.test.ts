import { afterEach, expect, it, vi } from "vitest";
import { formatElapsed, formatUTC } from "./visit-clock";

afterEach(() => { vi.unstubAllGlobals(); vi.resetModules(); });

it("formats UTC independently of the visitor's timezone", () => {
	expect(formatUTC(new Date("2026-11-18T04:05:09Z"))).toBe("04:05:09 UTC");
});

it("formats exploring time, including hour rollover and backwards clock changes", () => {
	expect(formatElapsed(0, 272_999)).toBe("T+04:32 exploring");
	expect(formatElapsed(0, 3_872_000)).toBe("T+01:04:32 exploring");
	expect(formatElapsed(1000, 500)).toBe("T+00:00 exploring");
});

it("preserves the beginning of a visit across module reloads", async () => {
	const values = new Map<string, string>();
	vi.stubGlobal("window", { sessionStorage: {
		getItem: (key: string) => values.get(key) ?? null,
		setItem: (key: string, value: string) => values.set(key, value),
	} });
	const firstPage = await import("./visit-clock");
	expect(firstPage.getVisitStart(100_000)).toBe(100_000);
	vi.resetModules();
	const nextPage = await import("./visit-clock");
	expect(nextPage.getVisitStart(160_000)).toBe(100_000);
});

it("keeps an in-memory start when browser storage is blocked", async () => {
	vi.stubGlobal("window", { get sessionStorage() { throw new Error("Blocked"); } });
	const { getVisitStart } = await import("./visit-clock");
	expect(getVisitStart(100_000)).toBe(100_000);
	expect(getVisitStart(160_000)).toBe(100_000);
});

it.each(["broken", "-1", "100001"])("resets invalid or future visit times: %s", async (saved) => {
	vi.stubGlobal("window", { sessionStorage: { getItem: () => saved, setItem: vi.fn() } });
	const { getVisitStart } = await import("./visit-clock");
	expect(getVisitStart(100_000)).toBe(100_000);
});
