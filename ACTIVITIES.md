# Stage 4 activities

All activities are optional. Turn the margins or use Back/Next at any time. Objects handle their own touch/mouse gestures; Tab focuses an object and its accessible name describes its keyboard alternative. State lasts for the current browser session and survives page turns and Read again; reloading starts fresh.

| Page | Play | Keyboard |
| --- | --- | --- |
| 1 | Twinkling stars | No action required |
| 2 | Slide along the painted telescope to focus on Mars | Right/Left |
| 3 | Draw on the sketchbook; erase to try again | Enter draws a rocket |
| 4 | Find the painted flashlight, duck and helmet sketch | Enter on each object |
| 5 | Find the toolbox, fan and toaster in the attic | Enter on each supply |
| 6 | Tap the painted hanging lamp and shelf fan | Enter |
| 7 | Fit panel, nose cone, engine to their positions | Enter fits focused part |
| 8 | Select a paint can and draw on the rocket | Enter paints a stripe; Erase clears strokes |
| 9 | Circle the loose screw beside Biscuit’s nose | Right tightens, Left loosens |
| 10 | Pull the pictured lever in Johnny’s hand; watch the gauge countdown | Enter |
| 11 | Hold the pictured rocket to climb; release to stop | Hold Space or Enter |
| 12 | Drag Biscuit; release for gentle momentum | Arrow keys |
| 13 | Move the pictured stick in Johnny’s hands | Arrow keys |
| 14 | Drag the rocket toward the center; release to descend | Left/Right adjust; Enter centers and descends |
| 15 | Tap the ground; boots and paws leave persistent tracks | Arrow keys |
| 16 | Tap the pictured backpack, then search its flashlight, notebook and duck | Enter on backpack, then Enter on each item |

Drawings and painted strokes are stored separately. The latest paint color carries into the landing rocket and painted accent bands on later exterior scenes. Up to 200 strokes per drawing and 240 footprint marks are retained to keep memory bounded.

## Implementation and verification

Activities use a shared gesture adapter with pointer capture and cancellation. Page turns, window blur, and document hiding stop scheduled activity work. Turning faces are inert. Animations honor reduced-motion preferences. Sound uses the existing mute setting and remains optional when the browser has no usable audio device.

`tests/activities.html` exercises all activities, state across revisits, pointer movement, wrong assembly drops, cancellation, rapid throttle restart, navigation separation, and asset decoding. `node tests/activity-state.test.cjs` checks the state model. `tests/index.html` remains the book engine regression suite.

## Remaining presentation limits

The activity mechanics are implemented; the animation is a layered 2D illustration treatment inside the 3D book, not skeletal character animation. Johnny and Biscuit use complete painted poses: individual eyes, ears, scarf and tail are not rigged, so the specified eye-following, blinks, automatic bolt-tightening gestures and independent limb motion are not yet present. Walking uses pose translation, rocking and a small dog bounce. The Page 13 scenery moves as a whole painting rather than independent window scenery. The backpack ending uses a subtle image pullback, not a new camera composition or head-tilt pose.

Sounds are textured synthesized cues, including a bark-like sound and stomach rumble. Recorded Foley, physical tablet testing and broader browser testing remain outstanding. Five viewport sizes were checked in the available Chromium browser. These limitations do not prevent any story activity or reading progression.
