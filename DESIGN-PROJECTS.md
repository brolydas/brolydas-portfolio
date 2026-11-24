# Design project standards

These rules apply to the five standalone portfolio demos, not the Design / Intelligence home page.

- Use clear product-specific copy, readable type, a restrained palette, purposeful hierarchy and one memorable visual moment per site. Use no Inter, purple gradients, gradient text, decorative glow, glossy blobs, nav emoji, headline pills, hype copy, fake proof, stat banners, tiny uppercase eyebrows, arbitrary uniform grids or decorative icon boxes. Do not center entire pages or use pill-shaped UI controls. No bounce in surrounding interface motion.
- Pepper Club: editorial food packaging; warm paper, dark ink, one vermilion product stage. Use existing illustrated bottle assets honestly; no fabricated photographs or claims. Keep shop, heat selector and fermentation story.
- Tiny Games: arcade catalogue with a single acid-yellow feature tile, a readable mood catalogue and benchmark index. Preserve game rules, controls and scores.
- UI Zoo: natural-history field guide; alternating exhibit rows, honest interactive specimens, and a poster workshop. Keep animal feedback meaningful, not decorative.
- Scroll Lab (both entry points): technical motion notebook; chart-led hero, plain-language index and two-column experiment pages. Preserve code extraction and demo interactions. Keep the two files synchronized.
- Prefer native elements, visible focus, readable contrast, 44px action targets, no horizontal overflow, reduced-motion fallbacks, animation of opacity/transform rather than layout, and stable keyboard navigation.
- Verify all routes at 390, 768, 1024 and 1440px, keyboard-only use, reduced motion, interaction state and console errors. Browser validation is a separate required step; source checks are not a substitute.

## Upstream guidance used
- https://github.com/nextlevelbuilder/ui-ux-pro-max-skill — priority: accessibility, interaction, performance, layout, typography, motion.
- https://github.com/Leonxlnx/taste-skill — one visual thesis, plain copy, one signature moment, consistent edges.
- https://github.com/SandroHub013/awwwards-skill — concept first, art direction and signature motion.
- https://github.com/MengTo/Skills — no-ai-design-slop, preserve product-specific character.
- https://github.com/nateherkai/scroll-craft — motion as narrative, varied pacing, mobile composition.
- https://github.com/motiondivision/ai-kit — actual Motion agent skill, vanilla JS and CSS motion guidance; https://github.com/motiondivision/motion is the animation library.

## Installing locally in Codex
Review the upstream scripts and their licenses before running them. From a local checkout with Node and Python available:
```sh
npx skills add https://github.com/Leonxlnx/taste-skill --skill design-taste-frontend
npx ui-ux-pro-max-cli init --ai codex
npx skills add https://github.com/SandroHub013/awwwards-skill
npx motion-ai
```
These are local agent installation commands, not application runtime dependencies. Existing anime.js demos are retained rather than requiring a framework migration. Consult each upstream repository for exact current install options. This document records design rules; it does not claim the local skills have been installed or their automated validators run.
