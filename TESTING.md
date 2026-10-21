# Stage 5 verification — 2026-10-14

Verified through local HTTP in the available Chromium browser.

| Suite | Result |
| --- | --- |
| tests/index.html: engine, turns, audio, images and presentation | 42 passed |
| tests/activities.html: gestures, state, cancellation and assets | 29 passed |
| tests/polish.html: scroll restoration, replay reset and preload | 4 passed |
| tests/responsive.html: all eight spreads at each size | 5 passed |

Responsive iframe dimensions: 320×740, 390×844, 768×1024, 1024×768 and 1280×800. Checks cover overflow, two facing pages, reading height, title clearance and activity placement. Phone and landscape layouts were visually inspected. Phone illustrations crop more closely to retain two facing pages.

Node checks: JavaScript syntax, tests/activity-state.test.cjs, tests/release.test.cjs and exact narrative comparison against the supplied manuscript. Audio lifecycle checks also run with a controlled AudioContext stub.

Review findings fixed with regressions: replay retaining passage scroll; throttle continuing after focus loss; horizontal steering changing vertical position; vertical walking changing horizontal position.

## Reproduce

Start Start-Preview.ps1 and open each browser test page. Keep the relevant page active until interaction tests finish. tests/responsive-preview.html offers selectable visual layouts.

## Boundaries

Iframe viewport checks are not physical device tests. iPad/Safari, Android touch hardware, speaker/headphone listening and device performance remain unverified. Direct-file opening is structurally supported but browser-tool policy prevented verification. Relative hosting paths were checked locally; no remote deployment was created.

Sound is synthesized. Characters use layered complete painted poses. Independently rigged eyes, ears, tails and limbs and recorded Foley remain outside this polish pass; see ACTIVITIES.md.

## Scene integration refinement

32 activity checks and all five responsive sweeps pass after the refinement. New checks cover moving landing shadows, selected paint on pawprints and interruption of scripted animation. The manuscript and state model also pass.
The 42 engine checks passed on an isolated rerun. An earlier concurrent run hit two timing-sensitive hold/boundary failures while responsive animations were running; the isolated rerun passed both.


## 2026-10-20 — Painted object integration

Verified 35/35 activity checks, 42 engine/integration/audio/presentation checks, 4/4 reading-polish checks and all five responsive sizes (320, 390, 768, 1024 and 1280 pixels wide). The responsive sweep now also checks that painted interaction targets remain visible inside their scene. One concurrent sweep timed out during navigation; the isolated rerun passed all five sizes.

Static release references, activity state, JavaScript syntax and all 15 original narrative passages pass. Visually reviewed all eight spreads, including floor contact for construction and painting props. tests/scenes.html provides a manual spread selector for future artwork alignment review. Physical touch devices and Safari remain unverified.
