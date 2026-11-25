# UI/UX Lab and portfolio demo redesign

UI Zoo is now UI/UX Lab, with the old URL retained as an identical entry point. Its existing cat, snake, hamster, frog and poster experiments remain at /ui-ux-experiments. The new shared glass navigation links Home, Templates, Scroll and Motion. Existing homepage and contact-scene work is preserved.

## Content
The complete imported reference snapshot covers styles: 89; typography: 74; colors: 194; landing: 34; charts: 25; ux-guidelines: 141; motion: 17; products: 194; icons: 105; app-interface: 32; react-performance: 44; google-fonts: 1934; stacks: 1278. Data is pinned to NextLevelBuilder/ui-ux-pro-max-skill commit 8db36338810d0942567b97ce439affd1619fcf31, with MIT attribution. Styles retain active, supplemental and archived status. Font pairings have editable live specimens and CSS export. Fonts load only after selection; Inter is retained as reference text but previewed/exported as DM Sans.

Motion Lab provides twelve original compositions across typography, brand, interface, transitions, social and data. Each has text, duration, colour and aspect-ratio controls, a manual timeline, playback, contrast feedback and standalone HTML download/copy. The gallery uses Jitter as an interaction reference only. No Jitter templates, brands or assets are reused. Exports are HTML animations, not video renders.

## Visual direction
Paper, dark ink and restrained colour fields; Space Grotesk, DM Sans and Cormorant Garamond; asymmetric introductory layouts; useful reference cards; native scroll; visible focus; reduced-motion support. The user's later glass-header request overrides the earlier restriction on gloss for the header alone. No purple gradients, gradient text, glowing blobs, emoji navigation, fake reviews, stat banners, decorative bouncing or Inter in the UI.

## Preserved work
Pepper Club retains the new basket and heat selector, Tiny Games retains all fourteen games/benchmarks, and Scroll Lab retains six manual studies with standalone code exports. Duplicate entry points remain synchronized. Work catalogue titles and links now point to UI/UX Lab.

## Verification
Previous-turn browser checks covered the original demo redesign, basket, game launches, interaction controls, poster PNG export, all six scroll exports and responsive widths. New source files have been syntax-checked with V8 and data counts validated before branch publication. The deterministic motion renderer was exercised at five progress values for every template. GitHub Actions runs the new Chromium suite in tests/design-labs.cjs and uploads responsive screenshots plus a JSON report. The PR must state its actual CI result; the existence of a workflow is not evidence that it passed.

Run locally:
```sh
npm install --no-save playwright@1.56.1
npx playwright install chromium
node tests/design-labs.cjs
```

The local execution host and browser-control tool were unavailable during this continuation. Earlier upstream skill guidance was reviewed; persistent skill installation remains unverified. No automated UI UX Pro Max design-system generator output is claimed.

## Kinetic lab redesign (Unicorn Studio reference)
The Scroll and Motion pages now share an editorial instrument identity: Space Grotesk display, Instrument Serif contrast and DM Sans controls; carbon and porcelain themes, a persistent liquid-metal capsule toggle, live scene labels, and a clear hero → bench/library → next-lab flow. The signature visuals are original Canvas 2D projected surfaces, not Unicorn assets, screenshots, shaders or embeds. Scroll's aperture changes geometry and responds to pointer/scroll position; Motion's knot is a six-second manual-scrub/play study. Each pauses offscreen, respects reduced motion, has explicit playback controls, caps device pixel ratio, and keeps the existing native-scroll, original exports and gallery functions. Uses the vendored Motion JS library for feedback and original animation mechanics; no React migration or new dependencies. UI/UX Pro Max, Awwwards and Scroll Craft guidance was read from upstream; the local skill search/preflight scripts were unavailable. The art direction is independently authored. Browser visual QA is pending the existing Chromium CI job.

## Content-specific template previews
25 individually authored SVG charts use illustrative sample data. 17 finite CSS motion specimens demonstrate the source recipes; 141 UX entries have individual before/after descriptions and reusable visual pattern families. App, React and stack guides show source Do/Don't comparisons. Font cards load actual fonts (Inter mapped to DM Sans); landing layouts follow source section order; styles use representative visual families and source swatches. Product directions show source recommendations. Existing palette and icon reference cards retained. Animation starts once on visibility, replays on hover/focus/button, stops offscreen, and respects reduced motion. Browser checks added; browser QA pending.

## Shared catalog theme
The UI/UX Lab and its UI Zoo alias now use the same persisted lab-color-mode preference and Liquid Metal toggle as Scroll/Motion. Catalog chrome, inputs, filters, dialog and font specimen surfaces adapt to both themes. Individual chart, palette and before/after specimen colors remain intentionally preserved on readable canvases. Browser checks for theme persistence and dialog colors added.

## Public product direction
Removed personal portfolio navigation from the labs and their aliases; kept source/license attribution. Added independent Tools navigation and a four-step interactive workflow demonstration. The Tools workspace includes nine local SVG generators (linear, mesh, metallic, noise, halftone, optical, shape, ASCII and dither), a preset-based three-screen prototype editor with HTML/JSON export, and a WCAG text contrast calculator. No AI backend, predictive heatmaps, Figma sync, URL cloning, MP4 rendering or account system is implemented; these remain separate product milestones. Reference: UX Pilot public feature descriptions and workflow; original UI and assets, no copied pages. Browser visual QA pending.

## Public navigation
Home and Templates remain direct links. Playground groups Scroll Lab, Motion Lab and Creative Studio (formerly Tools). Resources is a responsive two-column disclosure menu with all 17 capability entries from the supplied UX Pilot menu, using independent names for proprietary products. The resource directory labels available, limited and planned features and links to existing functionality. Menus support click/touch, keyboard, Escape, outside dismissal and reduced-motion; existing lab routes and aliases retained. AI model, agent, cloning, mockup and image-to-code features are not implemented. Browser checks added.

## Navigation repair
Removed synchronous dropdown dismissal during anchor activation and hover-triggered menu switching; links use ordinary native navigation. Browser tests now follow all three Playground links and wait for the theme transition to finish instead of asserting an intermediate color. Previous CI failures were a resource navigation timeout and an early CSS transition assertion; new browser run pending.

## Cinematic home
Original real-time projected particle field with cursor repulsion, native scroll-driven morph and perspective zoom, three layered cards, theme-specific colors and pause/reduced-motion controls. Prichard reference was reviewed from public text and user screenshot; animation timing and original source were not captured. The catalog remains available directly via #library. Browser checks added.

## Solid cinematic card finish
Cards fade only on entry, then remain opaque as the scroll sequence fans them into three nearly nonoverlapping specimens. Smaller type, independent depth, and mobile spacing keep the final content legible. Added final-state opacity and overlap regression checks.

## UXCraft branding
Renamed the public-facing platform, lab headers, metadata, portfolio entries, cover artwork and generated motion credits to UXCraft. Existing routes and aliases remain unchanged; /uxcraft is an additional homepage entry route. No domain availability or trademark clearance is implied.

## Navigation loading improvements
Consolidated duplicate external font CSS into one shared nonblocking stylesheet (with a no-JavaScript fallback), deferred the optional Motion runtime, moved Scroll's entrance to native WAAPI, and used extensionless Playground links to avoid cleanUrls redirects. Hover/focus supplies low-priority document prefetch hints only when data-saving/slow-network preferences allow. On-demand specimen fonts also load nonblocking. Added browser tests for stalled font CSS and navigation intent. No live timing measurements yet.
