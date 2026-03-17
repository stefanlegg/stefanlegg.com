export function initScrollSecret(element: HTMLElement): void {
	let overscrollCount = 0;
	const threshold = 6;

	window.addEventListener(
		"wheel",
		(e) => {
			if (e.deltaY > 0) {
				const scrollBottom = window.innerHeight + window.scrollY;
				const docHeight = document.documentElement.scrollHeight;

				if (scrollBottom >= docHeight - 10) {
					overscrollCount++;
					if (overscrollCount >= threshold) {
						element.classList.add("visible");
					}
				}
			} else if (e.deltaY < 0) {
				element.classList.remove("visible");
				overscrollCount = 0;
			}
		},
		{ passive: true },
	);

	let lastTouchY = 0;
	window.addEventListener(
		"touchstart",
		(e) => {
			lastTouchY = e.touches[0].clientY;
		},
		{ passive: true },
	);

	window.addEventListener(
		"touchmove",
		(e) => {
			const touchY = e.touches[0].clientY;
			if (lastTouchY > touchY) {
				const scrollBottom = window.innerHeight + window.scrollY;
				const docHeight = document.documentElement.scrollHeight;

				if (scrollBottom >= docHeight - 10) {
					overscrollCount++;
					if (overscrollCount >= threshold) {
						element.classList.add("visible");
					}
				}
			} else if (touchY > lastTouchY) {
				element.classList.remove("visible");
				overscrollCount = 0;
			}
			lastTouchY = touchY;
		},
		{ passive: true },
	);
}
