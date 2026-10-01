# Preserve canonical toys with readable slices

Mandatory toys will use canonical mathematical definitions first, with readability-tuned rendering for material thickness, color, and ghost projection. The tesseract will use a wire/solid presentation, the hypersphere will use true radius-changing sphere slices with a subtle ghost shell, the 5-cell simplex will be named that way in the UI, and the duocylinder will use math-derived slices with a stylized ghost.

**Considered Options**

- Pure artistic proxies would be easier to read, but they would weaken the player's trust that W slicing and rotation reveal real 4D behavior.
- Literal-only rendering would be more mathematically austere, but some toys, especially the duocylinder, would become visually confusing.
- Nonblank canvas checks would be fast to write, but they would not prove that controls affect geometry or that the toy loop exists.

**Consequences**

The app should treat visual readability as presentation over canonical behavior, not as a substitute for it. Toys that leave the table should auto-return after a delay, and browser verification should check UI/control states plus visible geometry changes rather than settling for a rendered canvas.
