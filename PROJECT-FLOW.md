# Reference motion correction
Local reference files were inspected as timestamped frames, including full-resolution crops. The earlier generic sticky project articles did not reproduce the clips.

The card-flow reference has a small hero image becoming full-viewport media, followed by overlapping content sheets. The hero now has a native sticky stage and a GSAP transform derived from its actual media bounds. It scales to cover the viewport and moves above the headline as scrolling progresses. No text fades or scroll interception are used. Mobile and reduced motion use ordinary document flow.

The work reference is a horizontal rail, not a curved 3D tape shelf. Homepage Selected Work and all three project archive aliases now share a filtered, draggable horizontal project rail with native touch scrolling, keyboard/range/Previous/Next navigation and working project-detail dialogs. Original project names, images, descriptions, demo links and repository links remain centralized.

Hover uses a temporary moving block breakup on the existing image, clears when the pointer leaves, and remains off for reduced motion. It does not replace photography with a permanent dither treatment.

The bouncing-tab reference moves entire layered service sheets. About capability rows now form large overlapping sheets; pointer position rocks a sheet by at most 2.4 degrees and leaving uses a damped GSAP spring. This is the user's explicitly requested exception to the earlier no-bounce rule. Functional text and links remain visible. Mode colours remain black/white/lime and white/black/cobalt; no reference media, proprietary fonts, logos, testimonial or client names are imported.

Tests cover viewport expansion geometry, rail filtering/navigation/drag, detail links/aliases, transient hover pixels, spring return, mode changes, reduced motion and existing portfolio/lab regressions.
