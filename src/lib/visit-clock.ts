const VISIT_START_KEY = "stefanlegg:visit-start";
let visitStart: number | undefined;

/** The tab's visit continues through navigation and refreshes. */
export function getVisitStart(now = Date.now()): number {
	if (visitStart !== undefined) return visitStart;
	try {
		const saved = Number(window.sessionStorage.getItem(VISIT_START_KEY));
		if (Number.isFinite(saved) && saved > 0 && saved <= now) {
			visitStart = saved;
			return saved;
		}
	} catch {
		// Fall back to this document's visit when storage is unavailable.
	}
	visitStart = now;
	try {
		window.sessionStorage.setItem(VISIT_START_KEY, String(now));
	} catch {
		// The module-level value still survives client-side navigation.
	}
	return now;
}

const pad = (value: number) => String(value).padStart(2, "0");

export function formatUTC(date: Date): string {
	return `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())} UTC`;
}

export function formatElapsed(startedAt: number, now = Date.now()): string {
	const seconds = Math.max(0, Math.floor((now - startedAt) / 1000));
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor(seconds / 60) % 60;
	const time = `${hours > 0 ? `${pad(hours)}:` : ""}${pad(minutes)}:${pad(seconds % 60)}`;
	return `T+${time} exploring`;
}
