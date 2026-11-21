import { run, type NavigationEvent } from "remix/component";
import { initStarfield } from "../../src/lib/starfield.ts";

const canvas = document.querySelector<HTMLCanvasElement>("#stars");
if (canvas) initStarfield(canvas);

const overviewEntries = new Map<string, { link: string; scrollY: number }>();
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
	const origin = event.from.url && new URL(event.from.url);
	if (origin && origin.pathname === "/" && event.element?.id) {
		overviewEntries.set(event.from.key, { link: event.element.id, scrollY: window.scrollY });
	}
	document.documentElement.toggleAttribute("data-instant", keyboard || reducedMotion.matches);
	const signal = await event.finished;
	if (signal.aborted) return;
	const heading = document.querySelector<HTMLElement>("h1");
	const current = window.navigation?.currentEntry;
	const saved = current && location.pathname === "/" && overviewEntries.get(current.key);
	if (saved) {
		window.scrollTo({ top: saved.scrollY, behavior: "instant" });
		document.getElementById(saved.link)?.focus({ preventScroll: true });
	} else {
		window.scrollTo({ top: 0, behavior: "instant" });
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
