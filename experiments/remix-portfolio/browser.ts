import { run, type NavigationEvent } from "remix/component";
import { initStarfield } from "../../src/lib/starfield.ts";

const canvas = document.querySelector<HTMLCanvasElement>("#stars");
if (canvas) initStarfield(canvas);

const entries = new Map<string, { link: string; scrollY: number }>();
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
	if (event.element?.id)
		entries.set(event.from.key, { link: event.element.id, scrollY: window.scrollY });
	document.documentElement.toggleAttribute("data-instant", keyboard || reducedMotion.matches);
	const signal = await event.finished;
	if (signal.aborted) return;
	const heading = document.querySelector<HTMLElement>("h1");
	const current = window.navigation?.currentEntry;
	const saved = current && event.navigationType === "traverse" && entries.get(current.key);
	if (saved) {
		window.scrollTo({ top: saved.scrollY, behavior: "instant" });
		document.getElementById(saved.link)?.focus({ preventScroll: true });
	} else {
		if (heading?.id === "item-title") {
			document.querySelector(".sky")?.scrollIntoView({ block: "start", behavior: "instant" });
		} else if (event.element?.closest(".orbit-controls")) {
			document.querySelector(".sky")?.scrollIntoView({ block: "nearest", behavior: "instant" });
		} else {
			window.scrollTo({ top: 0, behavior: "instant" });
		}
		heading?.focus({ preventScroll: true });
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
