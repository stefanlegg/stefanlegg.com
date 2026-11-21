# A continuous portfolio in Remix 3

On the home page, Cart Transform and LanSchool Air appear as labeled points in the existing starfield. Select one and the camera settles on it as the project description comes into focus. The address bar now holds a shareable project URL. Press Back and you land at the same place in the overview, with focus on the project you selected. Opening the project URL directly starts with the description ready to read.

Explore this on `explore/remix-portfolio`. The first deliverable is a Cloudflare branch preview of that round trip. Use the current Astro site as the baseline for load cost, navigation feel, and publishing effort.

## 1. Prove static delivery with plain pages

- Create a small Remix 3 app under `experiments/remix-portfolio/`. Give it its own package and build command. Use the Node version supported by the pinned Remix release for the prototype build. The root Astro project currently pins Node 22.
- Start with three routes: `/`, `/work/cart-transform/`, and `/work/lanschool-air/`. Use the descriptions, technologies, and outbound links from `src/data/work.ts`, the source the home page actually uses.
- Put a shared document around a replaceable project region. Use real links. Export complete HTML for every public URL and any separate response used by the Remix Frame. Give each static response a distinct path if full documents and fragments need different markup.
- Write HTML, browser modules, styles, and other assets into the experiment’s `dist/`. Use the Remix docs site’s prerender script as a reference. Serve only that directory in a fresh browser session, then deploy it to a Cloudflare Pages preview. Verify a direct visit and refresh on both project URLs, navigation with JavaScript off, and a real 404 for an unknown URL.

[Remix docs prerender script](https://github.com/remix-run/remix/blob/main/docs/site/scripts/prerender.ts) · [Remix Frames](https://docs.remix.run/streaming-ui-with-frames/) · [Cloudflare Pages static hosting](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/)

## 2. Build one complete interaction

- Start with the existing 2D canvas, typography, and colors. Give the two project points stable positions and accessible HTML links. Use the same destinations in the text list so touch and keyboard users can reach every project.
- Keep one canvas and animation loop mounted in the document. Let the URL identify the project and the scene controller own the camera position. Move the camera and reveal the project text together. A direct visit renders the destination immediately. Reduced motion uses the same composition with an immediate change of view.
- Restore overview position and focus on Back. Try Forward, a fast second selection, and Back during the transition. The final URL, focused element, and visible project should agree after each action. Keep text selectable and preserve normal touch scrolling.

## 3. Decide from the deployed experience

- On a phone and a desktop, open a project, return, and open the other. Record a short round trip. Look for a canvas reset, a blank frame, a stalled gesture, or text that waits on animation to become readable. Check keyboard navigation and reduced motion independently.
- Compare initial JavaScript transferred and a mobile performance trace with the current Astro home page under the same conditions. Inspect the preview’s network requests during first interaction for missing lazy-loaded modules or fragments.
- Add a third project from the existing work data and redeploy. Record which files had to change. This is the authoring test for both the interaction and the static export.
- Continue with Remix if the round trip feels continuous, the project URLs work directly from static hosting, and adding a project is mostly a content edit. If the scene succeeds but Remix navigation or export takes substantial bespoke code, bring the scene controller and project links back to Astro and compare.

The next migration decision would cover a published Markdown post, draft exclusion, and its social image. The first preview can answer the interaction and hosting questions with the three routes above.
