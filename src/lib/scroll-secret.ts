export function initScrollSecret(element: HTMLElement): void {
	// This discovery path requires a keyboard and a mouse-like pointer.
	if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

	let overscrollCount = 0;
	const threshold = 6;
	const controller = new AbortController();

	window.addEventListener(
		"wheel",
		(e) => {
			if (e.deltaY > 0) {
				const scrollBottom = window.innerHeight + window.scrollY;
				const docHeight = document.documentElement.scrollHeight;
				if (scrollBottom >= docHeight - 10) {
					overscrollCount++;
					if (overscrollCount >= threshold) element.classList.add("visible");
				}
			} else if (e.deltaY < 0) {
				element.classList.remove("visible");
				overscrollCount = 0;
			}
		},
		{ passive: true, signal: controller.signal },
	);

	document.addEventListener("astro:before-swap", () => controller.abort(), {
		once: true,
		signal: controller.signal,
	});
}
