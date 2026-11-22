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

## Branch result

The [Cloudflare Pages preview](https://explore-remix-portfolio.stefanlegg-com.pages.dev/) serves the overview and three project documents. The experiment uses Remix 3.3's implicit top frame and ordinary links. Each exported document contains the full page. During enhanced navigation Remix reconciles that document and preserves the existing canvas. Browsers without the required Navigation API use ordinary page loads.

Adding Catalogs took one entry in `experiments/remix-portfolio/projects.ts`, referencing the existing work description and a chart position. The page, index link, star, and export followed from that entry. A subsequent 360px viewport check caught an outer label extending beyond the chart during zoom. Right-side labels now face inward on narrow screens.

On the deployed preview, Chromium passed direct visits, reloads, JavaScript-disabled links, real 404 responses, Back/Forward, focus and scroll restoration, touch input, rapid replacement, and reduced motion. Desktop and phone round trips were recorded in the experiment's local `artifacts/` directory. Phone tests used emulation.

Three cold loads per site in emulated Pixel 7 Chromium on Cloudflare Pages measured **45.6 KiB** of compressed external JavaScript for Remix and **10.0 KiB** for the Astro baseline. Median largest contentful paint was **300 ms** for the prototype and **496 ms** for Astro in this run. The pages have different content and artwork. These runs used a 4× CPU slowdown, 100 ms latency, and 1.6 Mbps download. The baseline deployment has the same repository tree as the starting commit. [Astro comparison deployment](https://03fbc048.stefanlegg-com.pages.dev/)

The static export and one-entry authoring workflow are simple enough to continue. The next decision is whether the feel on a physical phone justifies the extra client JavaScript. The published article is a good next route if it does.

### Reproduce the experiment

From `experiments/remix-portfolio/`, use Node 24.3 or later and Python 3 for the local static file server.

```sh
npm ci
npm run check
npm run build
npm run preview
```

Open `http://localhost:4410`. For the browser regression suite, run `npx playwright install chromium` once, then `npm test`. The tests build and serve their own copy on port 4412. Set `PREVIEW_URL` to run them against a deployed preview, or `CHROMIUM_PATH` to use a locally installed Chromium executable.

Cloudflare's Git integration calls the root build on push. For this branch the build script installs the experiment's locked dependencies, builds its static files, and copies them into the root output directory. The lunar artwork is a shaded projection of the NASA Scientific Visualization Studio's LRO color map. [Moon Kit source imagery and credits](https://svs.gsfc.nasa.gov/4720/)

## Expanded orbital portfolio

The single-planet design is the active preview. The homepage shows three featured stars. The work history and the controls below the map reach all eight project pages. Cart Transform and Catalogs include small, illustrative storefront examples. Posts and Bookmarks now have local static archives, with the newest published article also listed under Writing on the homepage. Bookmark filtering and the footer clock enhance the static pages in the browser.

Install the repository dependencies as well as the experiment dependencies to build the shared post-image renderer. The Remix export uses fonts from its lockfile for article share images. Cloudflare Pages reads the exported `_redirects` for bookmark permalinks.
