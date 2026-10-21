# Changelog

## 2026-10-21 — Cozy library homepage

- Added a pale blue and beige library homepage with a featured book cover, description and Open the book link.
- Moved the existing reader to reader.html and added a return-to-library link.
- Added a canvas heat-field fireplace with rising, cooling heat, turbulent drift, glowing logs and embers. Includes pause, reduced-motion and hidden-tab handling.
- Verified homepage layout at 320, 390, 768 and 1280 pixels, pause interaction, book selection and return navigation. Added heat-field and route checks; static asset checks pass.


## 2026-10-20 — Interactions inside the paintings

- Audited all sixteen pages. Replaced duplicate desk, attic, garage, screw, cockpit and backpack props with direct targets on the illustrations.
- Anchored targets to the artwork's scale and crop, with per-page focus adjustments for narrow screens.
- Moved notebook drawing onto Johnny's notebook; kept clear tools in the instruction margin.
- Grounded workshop parts and paint cans, and made the landing rocket itself draggable.
- Added regression checks for direct controls and visible targets across five screen sizes.


## 2026-10-14 — Clearer instructions and contextual controls

- Replaced the floating launch lever with direct press-and-hold interaction on the pictured rocket.
- Mounted steering and landing controls in labeled panels; preserved keyboard alternatives.
- Shortened activity prompts and simplified their type treatment and the book-wide help text.
- All 32 activity regressions pass.


## 2026-10-14 — Connected scene refinement

- Matched foreground saturation, warmth and contact shadows to garage, cockpit and Mars scenes; softened hover feedback and hints during dragging.
- Added eased pickup, settling, assembly response and backpack reveals, respecting reduced motion.
- Connected landing shadows to rocket movement and altitude; painted pawprints follow the selected color immediately.
- Cancelled scripted character/reveal animations when interaction is interrupted.
- Added three regressions; all 32 activity checks pass. Existing manuscript and state checks pass.


## 2026-10-14 — Stage 5 polish and verification

- Added textured activity audio, first-gesture resume handling and cancellation of pending sounds.
- Preserved reading positions across turns; Read again resets passages. Preloaded cleaned activity backgrounds.
- Smoothed floating and throttle motion, stopped background animation and bounded drawing DOM to 200 strokes.
- Improved compact and landscape layouts, touch targets and captions; fixed phone cover overflow.
- Fixed throttle continuing after focus loss and unwanted diagonal keyboard steering/walking.
- Passed 75 functional browser checks and five responsive sweeps across all eight spreads, plus manuscript, state, release-path and syntax checks. See TESTING.md for limits.

## 2026-10-14 — Phase 3 story content and reading presentation

- Verified all fifteen narrative passages against the original supplied manuscript; preserved every word and dialogue beat.
- Removed passage-delimiting outer quotation marks from display, refined paragraph spacing and heading balance, and styled sound effects, the ship name, and the final ending.
- Added named keyboard-accessible reading regions and an overflow cue that updates on scrolling and resizing. Long passages remain scrollable without turning the page.
- All 40 browser checks pass, including four story-presentation checks. Checked heading/text clearance across all sixteen pages and verified JavaScript syntax.
- Narrative activities remain Phase 4; physical tablet testing remains part of Phase 5.

## 2026-10-14 — Recessed binding and dimensional paper

- Tilted facing pages around the spine so outer edges lift above the binding; added graduated crease lighting and layered paper edges.
- Added a lifted, gently pitched turn trajectory and directional fold shading while preserving opaque front/back surfaces.
- Kept illustration and text stacking explicit to avoid disappearing cover art under perspective.
- Curvature is suggested with lighting; pages use CSS 3D transforms rather than a deformable paper mesh.

## 2026-10-14 — Full-page interior paintings and restored preview

- Recomposed all fifteen interior scenes as portrait paintings, extending environments into quiet painted areas for live headings and manuscript text.
- Removed interior illustration bands and separators; retained two facing pages, opaque turning surfaces, accessible image descriptions, and independently scrolling long passages.
- Added a local preview helper and PowerShell launcher. Restarted the preview as an independent hidden process after the previous server stopped.
- Verified navigation through all eight spreads, image decoding, and the 36 browser checks. JavaScript syntax checks pass.

## 2026-10-14 — Continuous illustrated cover

- Recomposed the cover as a portrait painting with open sky for the live title and dark foreground for the subtitle.
- Extended artwork across the entire cover, removing the illustration band, dividers, and inset border on that page. Interior layouts are unchanged.
- Checked the cover at the annotated 572×572 viewport and desktop size.

## 2026-10-14 — Artwork integrated into the page

- Extended illustration sections from spine to page edge, with double-rule gold separators, paper-toned shading, and the existing paper texture.
- Enlarged desktop pages to preserve full scene compositions and retained compact facing-page layouts.
- All 36 browser regression checks pass after the styling change.

## 2026-10-14 — Phase 2 illustrated edition

- Added sixteen original generated scene illustrations with consistent Johnny, Biscuit, and homemade rocket styling. Corrected early-scene rocket continuity and the pre-launch cockpit view.
- Added local JPEG assets, descriptive alternative text, nearby-page preloading, and responsive artwork areas that preserve complete scenes.
- Preserved the original manuscript, persistent facing pages, and opaque illustrated turning surfaces. Moved engine test objects behind the `?engine-test` option.
- All 36 browser checks and JavaScript syntax checks pass. Visually checked desktop, 768px tablet, and 390px narrow layouts, including a turning reverse face. Physical-device testing remains outstanding.
- Artwork is static; interactive activities, separate character animation layers, and recorded sound remain future work.

## 2026-10-14 — Opaque page faces during turns

- Fixed mirrored outgoing text showing through the reverse of a turning page. A brightness filter on the 3D leaf forced its children into a flattened surface.
- Kept leaf animation transform-only and moved animated shading onto separate overlays on each opaque face. Preserved hidden backfaces and correctly oriented reverse-page content.
- Added a paused-animation regression check and a visual inspection page at tests/turn-surfaces.html for forward/front, forward/reverse, and backward/reverse states.
- Visually verified both reverse-face directions after reproducing the original mirrored text. Browser suite: 32 checks.

## 2026-10-14 — Persistent two-page spreads

- Display two facing pages at every resting state, including the opening and final spreads; retain the two-page layout on narrow screens.
- Turn a half-width leaf around the center spine while keeping the opposite page attached and visible underneath. Both leaf faces now contain the appropriate story page instead of a blank back.
- Advance through eight ordered spreads (1–2 through 15–16); update the position indicator, end boundary, and restart control accordingly.
- Preserve cancellation recovery, hold navigation, sound, glow, and interaction isolation.
- Added five spread regression tests, including opposite-page retention in both directions and an endpaper for an odd page count. The browser suite passes all 31 checks.

## 2026-10-14 — Phase 1 engine prototype

### Added

- Static HTML/CSS/vanilla JavaScript book with sixteen manuscript pages and no runtime dependencies.
- Bound cover, paper texture, page edges, front/back turning surfaces, eased 3D animation, lighting, and warm fading reveal halo.
- One-page clicks, delayed continuous holding, animation locking, safe boundaries, pointer capture, gesture movement cancellation, and blur/visibility cancellation.
- Story text scrolling and isolated test object input; keyboard controls, mute control, reduced-motion animation, and final-page restart.
- Provisional filtered-noise paper audio with user-gesture activation and active-source muting.
- Browser test runner, implementation documentation, and illustration/audio asset checklist.

### Fixed during verification

- Wrapped browser timer functions to prevent Illegal invocation errors during holds.
- Restored interactive controls when a canceled turn returns to its original page.
- Waited for audio resume so the first turn can produce its rustle; handled rejected resume without affecting navigation.
- Rendered manuscript bold emphasis without leaking Markdown markers.
- Kept restart within the controller's animation lock and cancellation rules.

### Verification

- 26 checks passed in the browser: 10 controller, 13 DOM/animation/input integration, 3 audio lifecycle checks. Audio lifecycle tests use a controlled audio-context substitute; they do not establish acoustic quality.
- Manual browser pointer holding advanced multiple pages, stopped on release, and reached page 16 without overflow.
- Inspected desktop, 768 × 1024, and 390 × 844 viewport layouts. The final manuscript remains scrollable within its reading region.
- JavaScript syntax checks passed. Main preview reported no runtime errors in the final inspected session.
- Independent source review identified cancellation recovery; its regression test failed before the fix and passed afterward.

### Remaining validation and later phases

- Browser automation permits HTTP(S) only, so direct-file opening was not executed by the test tool. Local HTTP preview was tested.
- No GitHub Pages deployment was made; static path structure is prepared for it.
- Physical tablet/touch testing, cross-browser Safari/Firefox testing, measured frame rates, and subjective sound audition remain unverified.
- Finished story illustrations, deforming page curvature, and narrative activities are not included in this engine prototype. See ASSETS.md and the consolidated specification.

## Stage 4 — story activities

Added optional activities across all story pages with touch/mouse capture, keyboard alternatives, per-session drawings/paint/discoveries/footprints, shared mute, cancellation on page turns and backgrounding, and reduced-motion styling. Added transparent painted object/astronaut atlases and seven cleaned background plates. Original art and manuscript remain intact.

Verification: 24/24 activity browser checks, 40/40 existing book checks, Node state assertions, syntax checks for all production scripts, and exact comparison of all 15 narrative passages against the source manuscript. Browser walkthrough reached the ending without completing activities; drawing, search, and floating controls were exercised in the reader. Static review findings about vertical movement, stationary taps, assembly targets, and pending animation timers were reproduced and fixed.

See ACTIVITIES.md for remaining character animation, sound-recording and device-testing limitations. No remote deployment performed.



## 2026-10-21 — Compact library and rising flames

- Reworked heat transport with fractional sampling, localized fuel along the logs, cooling and small curling eddies instead of broad horizontal bands.
- Added a woven blanket basket, mantel mug and subtle wall panel details in the light blue and beige palette.
- Sized the homepage to the viewport with compact responsive book selection, retaining readable overflow at extreme zoom or very short screens.
- Added vertical fit and book/footer clearance checks alongside pause and horizontal-fit checks.

## 2026-10-21 — Wood-fire flow and detailed fireplace

- Replaced fixed narrow fuel strips with overlapping, varying fuel regions; added buoyant flow, neighboring heat mixing and cooling pockets for merging flames and detached tips.
- Made the fireplace taller, with a layered mantel, stone joints, recessed brick firebox and textured logs.
- Removed promotional headings, taglines and footer copy, retaining book information and navigation.
- Passed viewport fit, content clearance and pause checks at five sizes, plus heat-field, syntax and static asset checks.

## 2026-10-21 — Your creation becomes part of the story

- Added a mission badge editor on the sketchbook spread: freehand drawing, color choices, a keyboard star stamp, optional name, undo, clear, save and removal.
- Reused the saved drawing on the constructed rocket, painting page, launch, landing, a plantable Mars flag and the final backpack scene.
- Saved badges locally on the same browser; story progression remains optional and unobstructed.
- Added an interactive cover star with visible feedback. All sixteen pages now have child-triggered actions.
- Verified badge recurrence and persistence, the complete manuscript, 35 existing activity checks and 42 engine checks.
