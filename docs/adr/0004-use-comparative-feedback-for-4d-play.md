# Use comparative feedback for 4D play

The starter scene will load one each of the tesseract, hypersphere, 5-cell simplex, and duocylinder so players can compare 4D behavior immediately. W slicing will support both a global W slice and a selected-toy W offset, selected toys will use an outline plus axis gizmo, labels will appear on selection or hover, prompts will appear once per action type, reset will support both selected reset and scene reset, and vanished visible slices will fall back to ghost-only projection.

**Considered Options**

- A guided pair would reduce visual load, but it would make comparison between toy families less immediate.
- Global-only W slicing would be simpler, but it would block close inspection of one toy while preserving the room context.
- Fully hiding vanished slices would be mathematically defensible, but in a toybox it would read too much like a rendering or selection bug.

**Consequences**

The player should always have enough feedback to understand what changed: what is selected, which axes matter, why a slice changed or disappeared, and how to recover from an experiment. These feedback rules are part of the core toy loop, not optional polish.
