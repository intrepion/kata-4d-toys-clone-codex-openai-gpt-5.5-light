# 4D Toybox

This context defines the shared language for a browser-based homage to the video game 4D Toys. The project centers on playful spatial intuition: players learn 4D behavior by manipulating toys, slices, and projections rather than by reading a lecture.

## Language

**Recognizable Homage**:
A game that preserves the core fantasy and interaction shape of 4D Toys while using original naming, presentation, and implementation.
_Avoid_: Direct copy, exact remake, themed viewer

**Toy-First Clone**:
A clone whose primary success condition is playful object manipulation: grabbing, tossing, stacking, slicing, and experimenting with 4D objects.
_Avoid_: Math demo, visualization-only clone

**4D Toy**:
An object with a higher-dimensional form whose visible 3D slice changes as its W position or orientation changes.
_Avoid_: Mesh, model, prop

**Geometry Core**:
The shared dimensional math model for 4D vectors, rotations, slicing, projections, and canonical toy definitions.
_Avoid_: Per-toy math, rendering helpers

**Canonical Toy Definition**:
The mathematically honest 4D definition of a toy before any visual tuning is applied for readability.
_Avoid_: Approximate shape, art asset

**Readability-Tuned Rendering**:
Visual treatment that adjusts thickness, material, color, or ghost presentation while preserving the toy's canonical dimensional behavior.
_Avoid_: Fake geometry, decorative styling

**Visible Slice**:
The 3D cross-section of a 4D toy that the player can see and manipulate at the current W position.
_Avoid_: Rendered object, projection mesh

**Ghost Projection**:
A translucent visual hint of the broader 4D form around the visible slice, used to suggest that the toy extends beyond what is currently touchable.
_Avoid_: Wireframe decoration, aura

**W Slice**:
The player's current position through the fourth spatial axis, used to reveal different visible slices of 4D toys.
_Avoid_: Depth slider, timeline

**Global W Slice**:
The room-wide W position that changes the visible slice of every toy together.
_Avoid_: Master depth, world slider

**Selected-Toy W Offset**:
A per-toy W adjustment layered on top of the global W slice so one toy can be inspected without losing room-wide comparison.
_Avoid_: Private timeline, hidden offset

**4D-Ish Consistency**:
The design standard that W position and 4D orientation must affect visible size, disappearance, collision, and interaction in ways that feel spatially coherent, without requiring full 4D rigid-body simulation.
_Avoid_: Fake 4D, full simulation

**Hybrid Manipulation**:
The interaction model where direct mouse grabbing is the default, and explicit tools provide precise 4D rotation, W slicing, freezing, and resetting.
_Avoid_: Tool-only controls, drag-only controls

**Orbit-Camera Lab**:
A tabletop-style 3D scene where the player orbits, pans, and zooms around 4D toys instead of navigating a first-person room.
_Avoid_: First-person room, fixed-stage viewer

**Mouse-First Controls**:
The control style where grabbing, orbiting, zooming, and spawning are usable with the mouse as the primary input, with keyboard shortcuts treated as accelerators.
_Avoid_: Keyboard-required controls, palette-only controls

**Rotation Plane**:
A named two-axis plane through which a toy can rotate, including XY, XZ, YZ, XW, YW, and ZW.
_Avoid_: Spin mode, tumble axis

**Axis Gizmo**:
A selected-toy visual aid that shows the relevant axes and rotation context for dimensional manipulation.
_Avoid_: Decoration, compass

**Slice-Aware Collision**:
Collision behavior where a toy's physical presence and approximate size follow its visible slice, while exact mesh collision is not required.
_Avoid_: Exact 4D collision, static collision

**Interaction Evidence**:
Browser-verified proof that the toy loop works, including rendering, spawning, W slicing, 4D rotation, grabbing, moving, resetting, and a clean console.
_Avoid_: Build-only proof, screenshot-only proof

**Clean Lab**:
The visual style for the toybox: bright, readable, lightly playful, and focused on making shape changes easy to inspect.
_Avoid_: Dark spectacle, sterile diagram, busy playroom

**Starter Scene**:
The deterministic initial toybox state that appears on load and after reset, without relying on saved player state.
_Avoid_: Persisted scene, previous session

**Selected Reset**:
A recovery action that restores only the selected toy while leaving the rest of the starter scene or player arrangement intact.
_Avoid_: Undo, scene reset

**Scene Reset**:
A recovery action that restores the full deterministic starter scene.
_Avoid_: Reload, selected reset

**Ghost-Only Projection**:
The vanished-slice state where a toy has no touchable visible slice at the current W position, but its ghost projection remains visible so the disappearance reads as dimensional behavior rather than a bug.
_Avoid_: Hidden object, missing toy

**Auto-Return**:
A recovery behavior where a toy that leaves the useful play area is allowed to fall or drift briefly, then returns to the table automatically.
_Avoid_: Clamp, deletion

**Dimensional Invariant**:
A testable math rule that should remain true across 4D vector, rotation, slicing, or projection operations.
_Avoid_: Snapshot expectation, visual guess

**Geometry-Change Check**:
A browser verification step that confirms a control action changes visible geometry or UI state in the expected direction, rather than merely proving the canvas is nonblank.
_Avoid_: Nonblank check, screenshot smoke test

**Micro-Prompt**:
A short contextual hint that appears when the player performs a meaningful dimensional action, such as changing the W slice, spawning a toy, or rotating through a 4D plane.
_Avoid_: Tutorial, documentation overlay

**Action-Type Prompt**:
A micro-prompt that appears the first time each meaningful action category is used, rather than appearing constantly or only once globally.
_Avoid_: Repeating hint, one-time tutorial

**5-Cell Simplex**:
The UI name for the 4D simplex toy, chosen to be precise enough for mathematical readers and readable enough for new players.
_Avoid_: Simplex, 4-simplex

**Wire/Solid Tesseract**:
The tesseract presentation where solid visible cells are paired with ghosted edges so the toy reads as a higher-dimensional cube instead of a changing box.
_Avoid_: Plain cube, wireframe-only tesseract

**Radius-Changing Hypersphere**:
The hypersphere presentation where the visible slice is a true sphere whose radius changes with W position, supported by a subtle ghost shell.
_Avoid_: Glowing blob, fixed sphere

**Hybrid Duocylinder**:
The duocylinder presentation where the slice is math-derived and the ghost is stylized enough to make the unfamiliar form readable.
_Avoid_: Torus proxy, literal-only duocylinder
