import { expect, it } from "vitest";
import formatDate from "./formatDate";

it("formats a date in en-US locale", () => {
	expect(formatDate(new Date("2024-01-15T00:00:00"))).toBe("1/15/2024");
});
