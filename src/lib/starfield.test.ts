import { afterEach, expect, it, vi } from "vitest";

function setup(reduced: boolean) {
  const motion = new EventTarget() as EventTarget & { matches: boolean };
  motion.matches = reduced;
  const resize = new EventTarget();
  const context = {
    clearRect: vi.fn(), beginPath: vi.fn(), arc: vi.fn(), fill: vi.fn(), fillStyle: "",
  };
  const canvas = { width: 0, height: 0, getContext: () => context };
  const frames = new Map<number, FrameRequestCallback>();
  let nextId = 0;
  vi.stubGlobal("window", {
    innerWidth: 1000, innerHeight: 600,
    matchMedia: () => motion,
    addEventListener: resize.addEventListener.bind(resize),
  });
  vi.stubGlobal("document", new EventTarget());
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    frames.set(++nextId, callback);
    return nextId;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id));
  return { motion, resize, context, canvas, frames };
}

afterEach(() => { vi.unstubAllGlobals(); vi.resetModules(); });

it("stops and resumes exactly one starfield loop when the motion preference changes", async () => {
  const { motion, context, canvas, frames } = setup(false);
  const { initStarfield } = await import("./starfield");
  initStarfield(canvas as unknown as HTMLCanvasElement);
  expect(frames.size).toBe(1);
  motion.matches = true;
  motion.dispatchEvent(new Event("change"));
  expect(frames.size).toBe(0);
  expect(context.fill).toHaveBeenCalled();
  motion.matches = false;
  motion.dispatchEvent(new Event("change"));
  motion.dispatchEvent(new Event("change"));
  expect(frames.size).toBe(1);
});

it("renders and resizes a static sky on initial reduced motion, then supports enabling animation", async () => {
  const { motion, resize, context, canvas, frames } = setup(true);
  const { initStarfield } = await import("./starfield");
  initStarfield(canvas as unknown as HTMLCanvasElement);
  expect(frames.size).toBe(0);
  const draws = context.clearRect.mock.calls.length;
  resize.dispatchEvent(new Event("resize"));
  expect(context.clearRect.mock.calls.length).toBe(draws + 1);
  motion.matches = false;
  motion.dispatchEvent(new Event("change"));
  expect(frames.size).toBe(1);
});
