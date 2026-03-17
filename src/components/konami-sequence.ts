export function createSequenceMatcher(sequence: string[]) {
	let index = 0;

	return {
		feed(key: string): boolean {
			if (key === sequence[index]) {
				index++;
				if (index === sequence.length) {
					index = 0;
					return true;
				}
			} else {
				index = 0;
				if (key === sequence[0]) index = 1;
			}
			return false;
		},
		reset() {
			index = 0;
		},
	};
}

export const KONAMI_CODE = [
	"ArrowUp",
	"ArrowUp",
	"ArrowDown",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"ArrowLeft",
	"ArrowRight",
	"KeyB",
	"KeyA",
];
