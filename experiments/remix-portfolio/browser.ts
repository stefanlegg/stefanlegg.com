import { run, type NavigationEvent } from "remix/component";
import { initStarfield } from "../../src/lib/starfield.ts";

import { formatElapsed, formatUTC, getVisitStart } from "../../src/lib/visit-clock.ts";

const canvas = document.querySelector<HTMLCanvasElement>("#stars");
if (canvas) initStarfield(canvas);

const started = getVisitStart();
let elapsed = false;
function updateClock() {
	const clock = document.querySelector<HTMLButtonElement>("#visit-clock");
	if (!clock) return;
	clock.hidden = false;
	clock.textContent = elapsed ? formatElapsed(started) : formatUTC(new Date());
	clock.setAttribute("aria-pressed", String(elapsed));
	clock.title = elapsed ? "Show UTC time" : "Show time spent exploring";
}
document.addEventListener("click", (event) => {
	if (event.target instanceof Element && event.target.closest("#visit-clock")) {
		elapsed = !elapsed;
		updateClock();
	}
});
updateClock();
window.setInterval(updateClock, 1000);

function filterBookmarks() {
	const form = document.querySelector<HTMLFormElement>("#bookmark-filter");
	const query = document.querySelector<HTMLInputElement>("#bookmark-query");
	const count = document.querySelector<HTMLOutputElement>("#bookmark-count");
	if (!form || !query || !count) return;
	form.hidden = false;
	const needle = query.value.trim().toLocaleLowerCase();
	const rows = document.querySelectorAll<HTMLElement>("[data-bookmark]");
	let matches = 0;
	for (const row of rows) {
		row.hidden = !(row.textContent ?? "").toLocaleLowerCase().includes(needle);
		if (!row.hidden) matches++;
	}
	count.textContent = matches === 0 ? "No matching bookmarks" : matches + " of " + rows.length;
}
document.addEventListener("input", (event) => {
	if (event.target instanceof Element && event.target.id === "bookmark-query") filterBookmarks();
});
document.addEventListener("submit", (event) => {
	if (event.target instanceof Element && event.target.id === "bookmark-filter")
		event.preventDefault();
});
filterBookmarks();
const entries = new Map<string, { link: string; scrollY: number; query?: string }>();
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
let keyboard = false;
window.addEventListener(
	"keydown",
	() => {
		keyboard = true;
	},
	true,
);
window.addEventListener(
	"pointerdown",
	() => {
		keyboard = false;
	},
	true,
);

async function finishNavigation(event: NavigationEvent) {
	if (event.element?.id) {
		entries.set(event.from.key, {
			link: event.element.id,
			scrollY: window.scrollY,
			query: document.querySelector<HTMLInputElement>("#bookmark-query")?.value,
		});
	}
	document.documentElement.toggleAttribute("data-instant", keyboard || reducedMotion.matches);
	const signal = await event.finished;
	if (signal.aborted) return;
	const heading = document.querySelector<HTMLElement>("h1");
	const current = window.navigation?.currentEntry;
	const saved = current && event.navigationType === "traverse" && entries.get(current.key);
	const query = document.querySelector<HTMLInputElement>("#bookmark-query");
	if (query && saved) query.value = saved.query ?? "";
	filterBookmarks();
	updateClock();
	if (saved) {
		window.scrollTo({ top: saved.scrollY, behavior: "instant" });
		document.getElementById(saved.link)?.focus({ preventScroll: true });
	} else {
		if (heading?.closest(".project-copy") && matchMedia("(max-width:650px)").matches) {
			document
				.querySelector(".chart-panel")
				?.scrollIntoView({ block: "start", behavior: "instant" });
		} else {
			window.scrollTo({ top: 0, behavior: "instant" });
		}
		heading?.focus({ preventScroll: true });
	}
	if (!keyboard && !reducedMotion.matches) {
		document.querySelector(".copy")?.animate(
			[
				{ opacity: 0.78, transform: "translateY(3px)" },
				{ opacity: 1, transform: "translateY(0)" },
			],
			{ duration: 180, easing: "cubic-bezier(0.23,1,0.32,1)" },
		);
	}
}

window.addEventListener(
	"rmx:navigation",
	(event) => {
		void finishNavigation(event as NavigationEvent).catch(() => {
			// The runtime reports a failed frame load. Restore ordinary link behavior.
			location.assign((event as NavigationEvent).to);
		});
	},
	true,
);
run({ loadModule: async (url, name) => (await import(url))[name] });
