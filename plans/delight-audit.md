# stefanlegg.com — delight audit

Audit date: 2026-11-16. Source baseline: `48a899d`. Scope: live homepage, posts index, bookmarks index, published article; desktop 1440×1000 and homepage at 390×844; repository motion, content, navigation, and game code. This document records findings and proposed directions, not approved product requirements or implementation plans. Application source was unchanged during the initial audit; the approved implementation is recorded below.

## Review decisions

- **Finding 1 — approved and fixed locally.** Shared teardown removes game keydown, keyup, and Astro swap listeners, clears held keys, and restores previous focus. Immediate navigation cleanup also works during the exit animation. Verified three play/Escape cycles with stable listener counts and restored real keyboard scrolling, active-game keyboard navigation, and an Astro swap during outro. Existing 12 tests and production build pass. Not deployed.
- **Finding 2 — history checked; no complete ending found.** The original post in `17e83df` (2025-05-25) already ends mid-sentence. Its later change in `3ccf176` (2025-07-06) only removed the `isPublish` frontmatter flag. Full local history and available refs were searched; the remote advertises only `main`, matching the current baseline. Article unchanged; deferred at the user’s request. Revisit the ending later.
- **Finding 3 — approved and fixed locally.** Hero enters as one container over 240ms with zero delay, 6px rise, and shared `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`. Its reduced-motion variant is a 120ms opacity-only fade. Sections/footer, nav, reading-page headings/lists, and articles have no entrance animations. Disabled Astro's root view-transition fade to keep navigation steady. Removed the obsolete navigation override script and global `fade-up` keyframe. Production build passes; native T3 browser checks covered home → posts → bookmarks → posts → article → home and the 390px mobile home. A 5× slow-motion hero recording and sampled 0/60/120/240ms frames were inspected. Reduced-motion CSS rules were temporarily activated in the browser for verification, then restored; this was a CSS branch check, not OS-level emulation.
- **Finding 4 — approved and implemented (`54cd267`).** Stars react to preference changes without accumulating animation loops. Reduced-motion gameplay skips the decorative fly-in/glitch outro, flashes, explosions, and fireworks; essential ship/projectile movement remains. CSS resets entrance delays and decorative hover transforms. Tests cover stopping/resuming the starfield and static-sky resizing. Browser checks covered immediate reduced-motion entry/exit and changing the preference during the intro.
- **Finding 5 — approved and implemented (`2df51c3`).** Desktop-only hint listener is aborted on Astro navigation. Touch overrides follow base CSS; touch handlers for the keyboard-only discovery path were removed. Tests cover reveal/reset, navigation cleanup, and touch exclusion.
- **Finding 6 — deferred.** Keep the existing work hierarchy until the featured-project direction is revisited.
- **Finding 7 — approved and implemented (`d624c0f`).** Active work, post, and bookmark rows keep text still, use explicit transitions, and gate arrow motion to fine-pointer hover. Keyboard focus gets a static accent. Homepage writing-card feedback uses explicit border/background transitions. The currently unused `ProjectCard.astro` was not changed. Bookmark destinations and redirect routes remain unchanged.
- **Finding 8 — approved and implemented (`a778a60`).** Native modal dialog makes the background inert and hides inactive game UI from the accessibility tree. Focus starts on the game surface; Tab/Shift+Tab cycle between the surface and Exit game. Space/Enter activate the exit button rather than shooting when that button is focused. Escape/button exit restores previous focus. Text instructions and polite status announce entry, weapon upgrades, bomb readiness, and victory/final score. Browser checks verified actual Konami-code activation, modality, background-focus exclusion, focus cycling, Space activation, Escape, focus restoration, and released keyboard scrolling. Victory announcement was confirmed in source, not through a complete playthrough.
- **Finding 9 — approved and implemented (`b8a050d`).** Mobile name uses a 44–48px clamp. Nav links have at least 44px target height, `aria-current`, and a static underline. Browser checks at 320px and 390px showed no horizontal overflow.
- **Finding 10 — deferred.** Bookmark annotations and direct-link changes are unchanged.
- **Finding 11 — deferred.** Contact placement, copy, and UTC clock are unchanged.
- **Finding 12 — deferred.** No game/visibility pause or glitch-performance optimization was added. Pausing stars for reduced motion belongs to finding 4, not this deferred optimization.
- **Finding 13 — approved and implemented (`45461cf`).** Draft posts are filtered from homepage/posts listings, article static paths, and OG-image static paths. `npm run test:drafts` creates a temporary draft, builds the site, and asserts no draft page, listing, share image, or sitemap entry while published content remains. The fixture is removed even on failure.

### Commits

| Finding | Commit | Change |
| --- | --- | --- |
| 1 | `45e96f0` | Release game keyboard controls on exit |
| 3 | `cc85420` | Shorten entrances and keep navigation steady |
| 4 | `54cd267` | Honor reduced motion in sky and game effects |
| 5 | `2df51c3` | Restrict hint to desktop and clean up listeners |
| 7 | `d624c0f` | Keep reading text still during link feedback |
| 8 | `a778a60` | Add game modality, focus controls, and text status |
| 9 | `b8a050d` | Improve mobile heading and navigation |
| 13 | `45461cf` | Exclude drafts from published outputs |

Final verification: `npm test` passes 16 tests across five files. `npm run test:drafts` passes, including a production build. Browser checks used native T3 preview after its automation recovered; JS preference changes were exercised with a temporary matchMedia event source, not an OS setting change. Initial game-exit regression checks and the original audit used the fallback described below. A transient Vite development WebSocket reconnect error occurred during the build; no application exception was observed in the final browser checks. Changes are committed locally; nothing was pushed or deployed. Git identity was unset in this environment, so commits used the existing repository author's identity via per-command Git configuration without changing global Git settings.

## Recommendation

Keep the celestial editorial identity: Crimson Pro, JetBrains Mono, violet accents, ample space, persistent stars, and a surprising optional game. Make the primary experience quicker, more personal, and more curated. Put the largest expression of personality into one work story and one discoverable surprise.

The site already communicates experience and technical credibility. It communicates less about your particular judgment, interests, and way of building. The highest-value new content is something only you could have written or made.

## Skills selected

Installed globally from https://github.com/emilkowalski/skills/tree/main/skills into `/home/albatross/.codex-unraid-proxy/skills/`:

| Skill | Role here |
| --- | --- |
| improve-animations | Audit existing motion and prioritize subsequent plans |
| animate | Choose values and implementation for an approved motion change |
| animation-performance | Diagnose measured frame problems and choose cheaper properties |
| animation-vocabulary | Give us precise language for discussing motion |
| find-animation-opportunities | Filter candidate additions by purpose and frequency |
| review-animations | Review future changes against a consistent craft standard |
| remove-animations | Simplify motion that does not earn its place |
| emil-design-eng | Broader interface polish and interaction details |
| choreograph | Coordinate the homepage introduction without long waits |

The last two are additions to the seven requested skills. Recommended later: **prototype**, for comparing different versions of the featured-work treatment; **break-ui**, for a deliberate stress pass with long titles, narrow widths, and unusual content; **learn-taste**, after you have expressed concrete preferences worth preserving. These three were not installed. Expo, Swift, native mobile, and toast-specific skills have little immediate relevance. Apple-design is optional inspiration; it should not replace this site's existing identity.

The installed skills become automatically available next turn. The audit used improve-animations, find-animation-opportunities, animation-performance, and emil-design-eng guidance directly. Two read-only review agents covered motion and accessibility/performance under the audit skill's workflow.

## What already works

- Serif prose and restrained monospace labels create a coherent editorial character.
- A narrow, centered column keeps the portfolio legible and avoids dashboard-like density.
- Work descriptions name actual shipped capabilities. The list is substantially more credible than vague project cards.
- Persistent stars connect pages, and the game fits that world. Keep the relationship.
- Astro renders the main content statically; no client framework is needed for the proposed polish.
- Game code is lazy-loaded. The starfield respects reduced motion at initial load.
- Visible keyboard link outlines already exist. No horizontal document overflow appeared in the sampled desktop/mobile home views.

## Prioritized findings

Severity describes visitor impact; evidence distinguishes live verification from source inspection. Effort is relative, not a delivery estimate.

| # | Severity | Category / location | Before | After / recommendation | Why / evidence | Effort |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | High | Game cleanup — `src/components/konami-game.ts:224`, `:971`, `:984` | Escape hides the game but leaves document keyboard listeners attached. | Use one idempotent teardown for normal exit and navigation; remove keydown/up, clear held keys, restore focus. | **Live reproduced:** enter Konami code, Escape, dispatch cancelable ArrowDown; `defaultPrevented` remains true after canvas is inactive. Keyboard page scrolling is intercepted. Repeated sessions add closures. | Small–medium |
| 2 | High | Published writing — `src/content/posts/01-stop-overthinking-your-projects.md:37` | The only published essay ends “the stuff that ends up mattering is often the stuff”. | Recover or write the intended ending with your input; review the full article before republishing. | **Live verified** at `/posts/stop-overthinking-your-projects/`. An unfinished piece undermines the care expressed by the visual design. Do not invent the author's conclusion during an audit. | Content decision |
| 3 | Medium | Page entrances — `src/pages/index.astro:110`, `:140`; `src/pages/posts/index.astro:32`, `:46`; `src/pages/bookmarks/index.astro:32`, `:46`; `src/pages/posts/[slug].astro:52` | Hero waits 400ms, then animates for 1s. List content waits 500ms, then animates for 800ms. Article waits 300ms, then animates for 800ms. | Give the first visit a short introduction; make reading destinations immediately readable, with at most a short content transition. Avoid replaying a long entrance after each route change. | Source-confirmed timing; homepage atmosphere is justified, but long reading-page waits have less value. Long marketing entrances are not inherently bugs. | Small |
| 4 | Medium | Reduced motion — `src/styles/tailwind.css:48`; `src/lib/starfield.ts:46`; `src/components/konami-game.ts:93`, `:262` | CSS duration collapses to 0.01ms but delays remain; transforms still jump; canvas game ornament ignores the preference; stars only read it once. | Clear entrance delays, remove decorative translation, keep brief opacity/color feedback, observe preference changes, and simplify ornamental game intro/outro separately from essential gameplay. | **Live verified:** reduced-motion hero delay remains 0.4s and footer delay 1s. Canvas limitations confirmed from code. | Medium |
| 5 | Medium | Secret hint / lifecycle — `src/layouts/Layout.astro:92`, `:108`; `src/lib/scroll-secret.ts:5`, `:27`, `:35` | The later base `display:flex` overrides touch suppression. Each Astro visit also registers three anonymous window listeners without cleanup. | Place touch overrides after the base style; attach listeners with an explicit teardown on swap; do not offer keyboard instructions to touch-only visitors. | Source-confirmed cascade and listener retention; computed display is flex. Retention risk increases with client navigation, not initial visits. | Small |
| 6 | Medium | Work hierarchy — `src/pages/index.astro:35`; `src/data/work.ts` | Eight work entries, seven at Shopify, receive almost identical visual weight before writing/contact. | Feature one or two work stories; keep the remaining shipping history accessible in a compact archive. Bring a small contact affordance earlier. | Visual review: the 390px homepage is roughly 4,800px long. Repeated tech stacks and equal weighting make scanning harder. This is a design judgment, not a rendering bug. | Medium |
| 7 | Medium | List interaction — `src/pages/posts/index.astro:51`, `:57`; `src/pages/bookmarks/index.astro:51`, `:57`; `src/pages/index.astro:187`; `src/components/PostCard.astro:25` | Whole list rows move 12px; work rows move 6px; transitions use `all`; hover translation is ungated. | Keep reading text fixed; move the small external arrow by 2px where applicable; use explicit transition properties and fine-pointer hover gating. Give keyboard focus an equivalent static accent. | Source-confirmed. Transform itself is cheap; the issue is unnecessary readable-content movement and an unbounded transition set. No dropped frames measured. | Small |
| 8 | Medium | Game accessibility — `src/components/KonamiGame.astro:11`; `src/components/konami-game.ts:173`, `:835`, `:966` | Canvas/HUD have no semantic game container or focus management; background nav remains focusable; victory is canvas-only. | Add an accessible game surface, concise controls and exit action, focus containment/restoration, inert background, and textual game status. Keep inactive HUD/scanning text out of the accessibility tree. | Source-confirmed. Optional play deserves a coherent entry and exit. This does not imply full screen-reader equivalence for a visual arcade game. | Medium |
| 9 | Low | Mobile hierarchy / navigation — `src/pages/index.astro:242`; `src/components/Header.astro:9`, `:32` | Mobile name drops to 36px while body is 24px; nav links have about 25px height and active state is color-only. | Explore a 44–48px mobile name if it fits; retain comfortable prose; expand nav hit areas toward 44px and add `aria-current="page"` plus a visible active marker. | **Live measured** 36px hero and ~25px nav heights at 390px. Larger targets are a usability improvement; no WCAG minimum-target failure is asserted from height alone. | Small |
| 10 | Medium | Bookmark usefulness — `src/pages/bookmarks/index.astro:18`; `src/pages/bookmarks/[slug].astro:23` | Generic descriptions and repeated dates dominate; each row first goes through an internal redirect. | Lead with your reason for saving each tool, show destination domains and an outbound cue, and link directly unless stable redirect URLs serve a deliberate purpose. Keep existing redirect routes for old links. | Live list inspected; redirect behavior confirmed in source. A small useful personal shelf is more memorable than a generic directory. | Medium / editorial |
| 11 | Low | Contact / footer — `src/components/SocialLinks.astro:10`; `src/data/presentation.ts:19`; `src/pages/index.astro:80` | Contact is only X/GitHub, far down the homepage. A UTC clock adds atmosphere without explaining its relevance. | Add one inviting contact path near the introduction using an address or channel you choose. If desired, label the clock with your actual timezone or give the footer a short personal signoff. | Visual/source review. Do not infer an email, location, availability, or timezone from this development environment. | Small / content decision |
| 12 | Low / risk | Canvas cost — `src/lib/starfield.ts:345`, `:395`; `src/components/konami-game.ts:326`, `:349` | Full viewport redraw continues beneath the game; glitch frames allocate/read back full-size canvas buffers. | Add explicit pause/resume for game and visibility; profile before changing rendering architecture; reuse temporary buffers where beneficial. | Source risk only. Browsers commonly suspend rAF in background tabs already. No frame-rate, CPU, battery, or Core Web Vitals regression has been measured. | Medium |
| 13 | Low | Draft publishing — `src/content/config.ts:10`; `src/pages/index.astro:10`; `src/pages/posts/index.astro:6`; `src/pages/posts/[slug].astro:7` | `isDraft` exists in the schema but collection consumers and static path generation do not filter it. | Exclude drafts consistently from page generation, lists, and derived artifacts. | Latent correctness issue, not evidence of a currently leaked draft. Useful before adding more writing. | Small |

## Delight directions beyond fixes

These are exploratory recommendations, not confirmed preferences or a request to implement them all.

### 1. A featured work story you can understand in ten seconds

Give one project more space and specificity: the problem, your contribution, and what changed for the people using it. Cart Transform is a possible candidate because bundles and checkout behavior can be illustrated simply; choose based on the work you most want to discuss.

Use a small before/after or explorable example based only on public information. A tap can expand the explanation; an external documentation link remains a separate action. Avoid inventing metrics, screenshots, ownership claims, or confidential details. A static diagram would already improve understanding; interaction should earn the additional work.

Expected payoff: visitors remember an example of your judgment, not only your employer and stack. Cost: actual storytelling and possibly custom visual work.

### 2. A small personal “Currently” note

Two or three true details: something you are building, learning, or enjoying. For example, a specific experiment or a link with one sentence about why it interested you. Use an honest updated date and avoid a heartbeat/pulsing “live” status unless it means something.

Place this near About or between featured work and writing. It gives visitors another reason to return without requiring a high-volume blog. The content must come from you; do not fabricate hobbies or activities. Cost: occasional maintenance.

### 3. Bookmarks as a shelf with your annotations

Keep the restrained rows. Replace generic blurbs with a useful observation: what you used it for, what surprised you, or when you would reach for it. Show the domain. Fourteen items do not need a command palette, animated filtering system, or elaborate category interface yet.

Expected payoff: a stronger sense of taste and utility. Cost: write and maintain the annotations; verify older recommendations before presenting them as current.

### 4. A readable, satisfying end to an essay

Finish the existing piece. Then provide a quiet closing line, “Back to writing,” and an optional share/copy link with clear confirmation. Add readable dates such as “May 23, 2025” and an accurate reading-time estimate if useful. On longer future pieces, consider a small table of contents only when length justifies it.

Expected payoff: reading feels hosted rather than abandoned. Cost: low UI effort, meaningful editorial effort. Do not add a dramatic scroll-progress effect to a short article.

### 5. An optional quiet mode for the sky

The stars are a signature worth keeping. Offer a small explicit “Pause sky” control with a clear accessible name and remembered preference. Reading pages can have a quieter default while retaining continuity. Honor OS reduced motion automatically and react if it changes.

Expected payoff: visitors can enjoy the atmosphere on their terms. Cost: a small lifecycle/state addition, including preference changes and navigation.

### 6. A more inviting ending

End the homepage with an actual invitation, not just two account handles. The wording can be personal and low pressure. A genuine local time can support “here is a person” if you want to share it. A copy-email affordance is useful only once you choose an address to publish; otherwise use your preferred existing channel.

Expected payoff: warmth and a clear next step. Cost: small, requires your contact preference.

## Four motion opportunities worth considering

Shared proposed curve: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`. These are recipes to evaluate after selection, not instructions to animate every candidate.

| Opportunity / location | Today | Purpose | Frequency | Suggested motion / guardrails |
| --- | --- | --- | --- | --- |
| First-visit introduction — `src/pages/index.astro:22` | Independent delayed blocks | Prevent a jarring arrival while giving the name priority | Rare first visit | Name/role as one container: opacity 0→1 and translateY(6px)→0 over 240ms, no initial wait; following intro block starts at 50ms, next at 90ms. Keep lower content readable rather than making it wait offscreen. Reduced motion: 120ms opacity only, zero delay. |
| Link feedback — `src/pages/index.astro:45` | Whole work entry translates | Feedback | Repeated browsing | Keep text still; external arrow translate(0,0)→translate(2px,-2px), 160ms with the shared ease-out; accent color over 160ms ease. Gate hover to `(hover:hover) and (pointer:fine)`. Focus uses static accent/outline; reduced motion omits translation. |
| Optional featured-story expansion — proposed within the work section | No expanded story yet | State indication / spatial consistency | Occasional | Native button with `aria-expanded`; measured-height reveal over 200ms shared ease-out plus 160ms opacity, reverse from current state on interruption. Reduced motion: immediate layout change, optional 120ms opacity. A static story remains the lower-cost alternative. |
| Contact confirmation — proposed in `src/components/SocialLinks.astro` | No copy action | Feedback | Occasional | Only if a copy contact action is selected: stable-width label “Copy email”→“Copied”, 120ms opacity transition, polite live status, failure feedback. No toast travel or confetti; reduced motion can keep the short fade. |

## Deliberately rejected additions

- **Magnetic/custom cursor:** fails function; competes with readable content, adds input tracking, and excludes touch.
- **More frequent meteors, explosions, or bouncing work cards:** fails purpose/frequency; existing atmosphere and the opt-in game already supply spectacle.
- **Per-row scroll reveals across the entire work list:** fails function; makes the long page a sequence of waits and often animates content the visitor is already reading.
- **Animated text splitting/typewriter hero:** fails readability; delays understanding of your name and role and adds disproportionate complexity.
- **Animated UTC seconds or active-navigation travel on every action:** weak value for repeated use. Keep clock digits stable with tabular numerals and make current location clear without waiting.

## Three possible design directions

| Direction | What changes | What it preserves | Tradeoff |
| --- | --- | --- | --- |
| Quiet observatory — recommended first | Faster entrances, composed link feedback, stronger mobile name, quiet mode, personal signoff | Current layout, starfield, serif/mono contrast | Most economical; more of the improvement is felt than seen |
| Builder's notebook | Featured work narrative, small “Currently” note, annotated bookmarks | Editorial typography and calm navigation | Larger content investment; better communicates how you think |
| Playful observatory | More intentional discovery trail into the existing game, accessible game entry/exit, optional touch exploration | Celestial world and surprise | Largest interaction and device-testing burden; easiest to overdo |

My recommendation is Quiet observatory as the base, with one Builder's notebook feature. Preserve the existing game, repair its exit and accessibility, then decide whether it needs any broader discovery path. A working mobile version would need real touch controls; do not merely expose the desktop game on a phone.

## Order of work

1. Repair game exit and finish/recover the article ending. These affect basic trust.
2. Tighten entrance timing, reduced motion, hover gating, and listener cleanup. Add nav semantics and comfortable targets.
3. Curate the homepage around one featured story; bring contact earlier and add a small genuine personal note.
4. Refine bookmark annotations and article endings.
5. Evaluate the sky control and any further game exploration after using the quieter version.

Do not start by adding a motion library or replacing the theme. CSS and the existing Astro architecture support these changes.

## Validation and limits

T3 preview opened the live site, but snapshot timed out twice: `Preview automation snapshot timed out after 15000ms.` Evaluate also timed out. Visual inspection therefore used the existing Playwright installation with system Chromium as the documented fallback. Screenshots were captured at 1440×1000 and 390×844 and inspected directly.

Live checks confirmed homepage/posts/bookmarks rendering, the exact article ending, game activation and Escape exit behavior, retained default prevention after exit, retained CSS delays under reduced motion, mobile nav dimensions, and absence of horizontal home document overflow at the sampled sizes. Homepage hero remains visible after its CSS animation with JavaScript disabled; its clock remains empty. No page errors were reported in the initial sampled routes. One initially guessed article URL resolved to the homepage; the audit used the actual linked article URL to verify its contents.

During the initial audit, no production changes, builds, formatters, package installs in the project, or commits were made. Subsequent authorized implementation and checks are recorded above. This was not a complete external-link crawl, WCAG conformance audit, Safari test, real touch-device test, or a measured performance study. OS preference changes and cleanup concerns beyond the reproduced game issue were reviewed in source, not claimed as comprehensive runtime regressions. No CPU/frame-rate or Core Web Vitals numbers are invented.

The eight motion categories were covered: purpose/frequency, easing/duration, physicality/origin, interruptibility, performance, accessibility, cohesion/tokens, and missed opportunities. CSS hover transitions already retarget correctly. One-shot entrance keyframes are suitable for their role. No inappropriate popup origins or scale-from-zero transitions were found. Starfield singleton plus persisted canvas is intentional; it does not create another starfield loop per Astro navigation. Keep documented game transitions' DOM/canvas handoff intent when simplifying ornamental motion.


## Finding 3 implementation timeline

| Element | Role | Starts | Duration | Motion | Relationship |
| --- | --- | --- | --- | --- | --- |
| Hero (name, role, employer together) | Lead | 0ms | 240ms | Opacity 0→1, translateY 6px→0, `var(--ease-out)` | Parent carries its content; one entrance |
| Hero under reduced motion | Lead | 0ms | 120ms | Opacity only | All hero content together |
| Navigation, sections, footer, reading pages | Static | Immediate | None | None | Remain available alongside the hero |

The hero is a rare/occasional arrival with a delight purpose. Navigation stays static because it is a repeated action; reading content stays still because the visitor is there to read; sections/footer no longer perform offscreen entrances. Feel check: slow-motion review covered the first 240ms of the hero, especially the early readable state (opacity ~0.78 at 60ms, ~0.97 at 120ms) against already-visible navigation and About. Fast navigation replaces the old DOM instead of stacking entrance sequences. Typography and layout were not changed.


## Finding 3 refinement: visible route transitions

After local review, the user found navigation too abrupt. Restore a 220ms opacity crossfade on main content while the navigation and sky stay steady. Disable the view-transition group's default geometry animation to avoid morphing between page heights. The homepage hero retains its direct-load entrance; during client navigation the crossfade carries it without a second entrance. Reduced-motion navigation remains usable.

Validation: production build passed. Chromium checks confirmed 220ms incoming/outgoing fades across Home, Posts, and Bookmarks, stationary navigation, no repeated hero entrance, no default group geometry animation, and working reduced-motion navigation without page errors.
