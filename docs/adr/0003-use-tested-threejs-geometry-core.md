# Use a tested Three.js geometry core

The implementation will use Vite, TypeScript, Three.js, Vitest, and Playwright. 4D behavior should come from a reusable geometry core for vectors, rotations, slicing, projection, and canonical toy definitions, while the rendered slices may be hand-tuned for readability.

**Considered Options**

- A lightweight static app would reduce setup, but it would make geometry invariants and browser interaction checks harder to preserve.
- Hand-authoring every toy would be fast for a tiny demo, but it would make 4D behavior inconsistent across toys.
- A math-first rendering with dense overlays would be precise, but it would make the toybox harder to read and less playful.

**Consequences**

The first build should use a clean lab style with playful color, solid visible slices plus ghost projections, a deterministic starter scene instead of persistence, and desktop-first controls. Completion requires both unit tests for dimensional invariants and Playwright checks for user flows, because either layer can pass while the other fails.
