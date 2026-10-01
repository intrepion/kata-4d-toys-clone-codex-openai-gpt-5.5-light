# Use an orbit-camera lab with interaction evidence

The first playable build will use an orbit-camera lab with mouse-first controls, all six rotation planes, and a mandatory toy set of tesseract, hypersphere, 5-cell simplex, and duocylinder. Collision should be slice-aware but approximate, and completion must be backed by browser checks that prove the player can render, spawn, W-slice, rotate, grab, move, and reset toys without console errors.

**Considered Options**

- A first-person room could feel more immersive, but it would spend interaction budget on navigation instead of dimensional manipulation.
- A fixed-stage viewer would simplify testing, but it would weaken the tactile toybox feel.
- Exact mesh or 4D rigid-body collision would be more mathematically satisfying, but it is too likely to dominate the first version before the core toy loop is proven.

**Consequences**

The implementation should treat build success as insufficient. A passing delivery needs browser interaction evidence, and the UI should expose precise terms like W Slice and XW rotation while using micro-prompts to keep those terms approachable.
