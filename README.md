# Johnny Builds to Mars

An illustrated, interactive storybook with a cozy library homepage and reader-created mission badges. Open **index.html** for the cozy library homepage, then select the book. **reader.html** opens the storybook directly. No installation, build step, server, account, or API key is required.

## Controls

If the localhost preview becomes unreachable, run `Start-Preview.ps1` in PowerShell from this folder (requires Node.js already installed). It starts a hidden local helper. The book itself still works by opening index.html directly; only the localhost address depends on a running helper.

- Two facing pages remain on screen: 1–2, 3–4, through 15–16. Click the left or right page margin to move one spread backward or forward. The other physical page stays visible as the sheet turns around the center spine.
- Hold a margin for 450 ms to begin repeated turns; release to stop. An active turn finishes naturally.
- Use Back/Next or the left/right arrow keys. Arrow keys are reserved for the focused control when reading or interacting.
- Scroll inside the story text to read long pages. Text scrolling does not turn pages. Passages remember their reading positions across turns; Read again resets them.
- “More story below” appears when a passage continues below the reading area and disappears at its end. Story regions have descriptive accessible names and support keyboard scrolling.
- Engine test objects are available only with the `?engine-test` URL option.
- Toggle Sound on/off to mute. Read again appears on the final page.

## Tests

Open **tests/index.html** through a static HTTP(S) host and allow the integration suite to finish. It includes deterministic controller checks and real DOM/animation/pointer checks. The app-level iframe test needs a shared HTTP origin; browsers may block it when the test runner is opened as a local file. Keep the test page open during the run; changing focus intentionally cancels holds. Production reading does not require a server.

## GitHub Pages

Copy the contents of this folder into the root of the repository to publish. In repository Settings → Pages, select deployment from the branch and root folder containing index.html. All production asset paths are relative, so repository subpaths work. There is no build output to generate.

Live site: https://tales-for-tablets-library.oneapple396.chatgpt.site/ — GitHub Pages is optional and has not been enabled by this upload.

## Scope

The original manuscript and sixteen full-page portrait illustrations are included, with descriptive alternative text and nearby-image preloading. Story text sits over pale painted foregrounds; long passages scroll within the page. Activities include drawing, assembly, paint, hidden supplies, flight controls, zero-gravity Biscuit, footsteps, and backpack discovery. See ACTIVITIES.md for controls, state behavior and remaining animation polish. Audio uses browser-generated paper rustle and textured synthesized activity cues, not recordings. It requires browser permission through a user gesture, and audio failure does not prevent reading.

The turning leaf uses CSS perspective, front/back surfaces, eased rotation, edge highlights, and shading. The curvature is an optical gradient effect rather than deforming paper geometry. Ordinary device performance and physical tablet touch input still require device testing.

Direct-file opening is supported by the file structure (ordinary scripts, relative paths, no fetch calls), but automated direct-file verification was blocked by the browser tool's URL policy. Verification used the local HTTP preview instead.

See ACTIVITIES.md for the activity guide, ASSETS.md for asset provenance and remaining animation/sound work, ILLUSTRATION-PROMPTS.md for the generation prompts, CHANGELOG.md for changes, and TESTING.md for verification results.




## Latest reader features

- Draw and name a mission badge that returns on the rocket and Mars flag, saved on the current device.
- Large sketchbook with a clear drawing prompt and full-rocket painting clipped to the rocket silhouette.
- Cover stars glow immediately; Mars approaches through the window while the cockpit stays fixed.
- Painted badge treatment, grounded flag, and larger desktop reading spreads.

## Local preview

With Node.js installed, run `node preview-server.cjs`, then open http://127.0.0.1:4173/. No package installation is needed.

Quick checks: `node tests/activity-state.test.cjs`, `node tests/badge.test.cjs`, and `node tests/release.test.cjs`. Browser checks are in `tests/`.
