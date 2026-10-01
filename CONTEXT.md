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

**Visible Slice**:
The 3D cross-section of a 4D toy that the player can see and manipulate at the current W position.
_Avoid_: Rendered object, projection mesh

**W Slice**:
The player's current position through the fourth spatial axis, used to reveal different visible slices of 4D toys.
_Avoid_: Depth slider, timeline

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

**Slice-Aware Collision**:
Collision behavior where a toy's physical presence and approximate size follow its visible slice, while exact mesh collision is not required.
_Avoid_: Exact 4D collision, static collision

**Interaction Evidence**:
Browser-verified proof that the toy loop works, including rendering, spawning, W slicing, 4D rotation, grabbing, moving, resetting, and a clean console.
_Avoid_: Build-only proof, screenshot-only proof

**Micro-Prompt**:
A short contextual hint that appears when the player performs a meaningful dimensional action, such as changing the W slice, spawning a toy, or rotating through a 4D plane.
_Avoid_: Tutorial, documentation overlay
