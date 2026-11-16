import { afterEach, expect, it, vi } from "vitest";
import { initScrollSecret } from "./scroll-secret";

function setup(mouse: boolean) {
  const windowTarget = Object.assign(new EventTarget(), {
    innerHeight: 600, scrollY: 400,
    matchMedia: () => ({ matches: mouse }),
  });
  const documentTarget = Object.assign(new EventTarget(), {
    documentElement: { scrollHeight: 1000 },
  });
  vi.stubGlobal("window", windowTarget);
  vi.stubGlobal("document", documentTarget);
  const classes = new Set<string>();
  const element = { classList: classes } as unknown as HTMLElement;
  // DOMTokenList uses remove rather than Set's delete.
  Object.assign(classes, { remove: classes.delete.bind(classes) });
  function wheel(deltaY = 100) {
    windowTarget.dispatchEvent(Object.assign(new Event("wheel"), { deltaY }));
  }
  return { wheel, classes, element, documentTarget };
}

afterEach(() => vi.unstubAllGlobals());

it("reveals only after repeated bottom scrolling, resets upward, and stops listening on navigation", () => {
  const { wheel, classes, element, documentTarget } = setup(true);
  initScrollSecret(element);
  for (let i = 0; i < 5; i++) wheel();
  expect(classes.has("visible")).toBe(false);
  wheel();
  expect(classes.has("visible")).toBe(true);
  wheel(-100);
  expect(classes.has("visible")).toBe(false);
  documentTarget.dispatchEvent(new Event("astro:before-swap"));
  for (let i = 0; i < 8; i++) wheel();
  expect(classes.has("visible")).toBe(false);
});

it("does not offer the keyboard discovery hint to touch-only visitors", () => {
  const { wheel, classes, element } = setup(false);
  initScrollSecret(element);
  for (let i = 0; i < 8; i++) wheel();
  expect(classes.has("visible")).toBe(false);
});
