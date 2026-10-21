# Artwork and Sound Requirements

Phase 2 uses sixteen portrait JPEG illustrations in assets/illustrations: cover-full-page.jpg and page-02-full.jpg through page-16-full.jpg. Earlier landscape versions are retained as reference assets. Johnny and Biscuit share a consistent warm, painted visual style. See ILLUSTRATION-PROMPTS.md and FULL-PAGE-PROMPTS.md for the built-in image generation prompts.

These are complete static scenes. The table below describes future interactive layers, which still need separate transparent artwork and states. Preserve Johnny's messy brown hair, blue shirt, and red sneakers and Biscuit's golden retriever appearance across those assets.

| Page | Scene and required interactive layers |
| --- | --- |
| 1 | Nighttime backyard cover, homemade rocket, Johnny, Biscuit, scarf and stars |
| 2 | Bedroom window, telescope and stand, sky and magnified Mars |
| 3 | Bedroom, sketchbook drawing surface, pencil, Johnny and sleeping Biscuit |
| 4 | Desk, movable papers and objects, shopping list and circling pencil |
| 5 | Attic, opening boxes and drawers, cloth, three supplies and wagon |
| 6 | Garage, pull cord, separate light/shadow states and fan |
| 7 | Garage rocket, main panel, nose cone, engine housing, tools and bolts |
| 8 | Rocket paint surface, brushes, open paint cans, Biscuit and pawprints |
| 9 | Rocket detail, loose screw, screwdriver and Biscuit's face |
| 10 | Cockpit, curved ignition lever, gauges, countdown display, helmeted Biscuit |
| 11 | Launch layers: neighborhood, clouds, smoke, engine flame and throttle |
| 12 | Cockpit and Earth through window, floating Biscuit with ears and paws |
| 13 | Cockpit control stick, star field, distant comet, rocks and approaching Mars |
| 14 | Mars terrain, lander, landing legs, contact shadow and dust |
| 15 | Mars, rocket ladder, walking Johnny, bounding Biscuit and persistent prints |
| 16 | Mars, backpack and zipper, flashlight, notebook, duck, Johnny and Biscuit |

Required local sound recordings: soft page turns, pencil, drawer, metal settling, brush strokes, bark, ignition, flight/wind, footsteps, zipper, stomach rumble. Use short, normalized, quiet assets and audit licensing before inclusion. Paper audio must be auditioned on speakers and headphones during polish; repeated playback should remain unobtrusive.

## Stage 4 interactive assets

`assets/activities/objects.png` is a transparent painted 4×4 atlas: telescope, fan, toolbox, toaster, rocket panel, nose cone, engine housing, paint can, screwdriver, lever, floating Biscuit, rocket, Johnny, backpack, flashlight, duck. SVG viewports select cells without separate downloads. `walkers.png` contains the two astronaut poses used on Mars. Original raster alpha is preserved.

Seven edited background plates remove objects that become movable: pages 2, 7, 8, 12, 14, 15 and 16. The original full-page images remain unchanged in assets/illustrations. New plates are JPEG copies for delivery. All art was generated using the built-in image-generation tool; see ACTIVITY-ART-PROMPTS.md. Physical paper, pencil strokes, fan blades, instruments and atmosphere are native DOM/SVG/CSS.

Remaining art and sound polish is explicitly listed in ACTIVITIES.md; no external downloads or AI calls occur while reading.
