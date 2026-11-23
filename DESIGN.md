# Design / Intelligence

## Concept
One maker, two ways of thinking. An editorial portfolio opens into a spatial archive where the visitor pulls a piece of work out of the collection to inspect it.

The user supplied the palette, typography, two portfolio modes, sound gate, and continuous descending well. Authored decisions: Design / Intelligence labels with plain-language subtitles; quiet editorial landing; one amber switch accent; native scrolling; a complete project index alongside the scene.

## Art direction
Near black #050404; bone #f2ede4; Prussian blue #003153 for the well floor; warm amber #edac56 for the single bright control. Bodoni Moda display, Jost body. Rectangular controls, ruled editorial rows, asymmetric work spreads. No marketing badges, gradients in text, pill containers, fabricated reviews, statistical banners, generic icon cards, or bouncing motion.

## Journey and feeling
1. Arrival: curiosity through oversized restrained type and a cropped architectural ring.
2. Choice: agency through a persistent Design / Intelligence switch.
3. Evidence: clarity through genuine existing work and specific descriptions.
4. Descent: discovery through narrowing rings of curved screens.
5. Inspection: attention as a selected curved screen detaches, straightens and moves toward the visitor.
6. Floor: a small observer in Prussian-blue light and a slit-revealed feature screen.
7. Return: resolution as the camera rises and the archive becomes a ring of lights.

## Motion contract
Native scroll is never intercepted. Scroll progress determines the camera, ring angles and media position; velocity adds a bounded transient rotation and lens streak. Frame-independent damping. 180ms controls, 460ms transitions, 800ms screen extraction. No spring overshoot. Reduced motion uses the readable project list and no camera flight. Touch retains native vertical scrolling. Keyboard users can select every project from the index.

## Content provenance
Design material: brolydas/brolydas-portfolio at 14004133b4f4d3dd944f34e865cf1c4469bcc5bf. AI material: brolydas/TharunRongalaPortfolio at 2ddaeb560a419876c7e22874dd28001266a4439f. Existing metrics are deliberately not promoted as verified results. Existing project pages remain intact.

## Reference translation
Daiki Fujita: persistent choice between two worlds, not a copy of his composition or game. AlignCanvas: curved image arrangements. Bloop: staged changes in viewpoint. Grainient: restrained grain only, not gradients. ReactDrops and Libraries.dev: state-driven feedback; no glossy orbs. Unicorn Studio: shader/canvas layering implemented directly in Three.js.

The supplied 49.77s Instagram montage presents eleven miniature toggle worlds, including organic ink, pixel sunset, liquid metal, dot matrix, side-scrolling boulder, tide, neon tube, mechanical reactor, folding paper, eclipse and sleeping character. The usable principle is a legible physical state change with its own miniature visual behavior. For this site, the amber rectangular carriage passes through a dark recessed rail, while fine interface marks reorganize into a simple node-and-edge drawing. Both words remain readable; the selected state has a solid contrasting field. Keep the tactile timing and sound, but avoid the montage's pills, gloss, blobs, glow, bounce and novelty-game imagery.

The 10s project reference fans overlapping project covers under a large shifting outline/filled wordmark; a red vertical slab is the compositional anchor. Translate this to one striking featured spread with actual project imagery on separated layers and distinct case-study captions. Do not make every project card the same fan or reproduce the clip's name/graphic.

The 19.43s main scroll reference moves through one vehicle story: a hero with three cars, condensed intro image, material close-up, identity detail, large statement, split interior, lighting detail, abrupt black/red typographic interruption, frontal close-up, full group image and final hero. Its strength is the continuity of one subject through changes in framing. Our project preview should similarly move from overview to process to evidence to outcome, without invented metrics. The viewport can remain steady while images and text change scale, crop and alignment.

The 12.03s sculpture reference keeps a nearly fixed dark frame and fine alignment rules as the sculpture rotates and slides between asymmetric text compositions. Adapt its steady camera and controlled parallax to the about/discipline transition, with typography and project content always readable.

The 10s motorcycle reference goes from line drawing to photographic object, then changes lighting and location while three pieces of information appear on different sides of the motorcycle. Adapt that visual-to-evidence reveal for project detail transitions; use verified problem, role and method in place of the reference's numeric stats.

The supplied project-well image has concentric, offset rings of curved screens around a small central figure. The camera looks down into the opening, so each layer remains distinct; one violet pool of light supplies scale and focus. Our adaptation uses five staggered rings with fewer screens and real project content, a concentrated Prussian-blue floor and a small observer. The camera begins directly above the rim and continues looking down as it travels through the rings; the screen geometry leans toward that overhead view. The one bright amber moment remains in the portfolio switch. The image alone does not specify motion timing, playback, or interactions, so those behaviors follow the user's written brief and are tested as part of the implementation.

These reference videos are edited screen recordings. Their sampled frames show the sequence and visual relationships, but they cannot prove that every transition is controlled by scroll on the original sites. The implementation should map those stages to measured scroll progress, with normal scrolling, reduced-motion and keyboard alternatives. Screen imagery comes from existing project assets; genuine scroll-recording files can be assigned via the optional video field in js/projects.js. Still imagery is scrubbed vertically until recordings are supplied.

## Technical boundaries
Static HTML/CSS/modules; pinned Three.js CDN imports. Audio begins only after explicit consent and can be muted at all times. Earshot one-shots supplement Web Audio synthesis. WebGL failure leaves the complete DOM project index available. Scene resources and animation loops are disposed on teardown. Device performance requires real hardware verification; no award or performance guarantee is claimed.
