# Ship a direct code-generated toybox

The app will open directly into the toybox, use code-generated geometry and materials for the first build, omit audio feedback, provide a styled WebGL fallback panel, include a hidden debug toggle, and expose shortcuts through tooltips plus a compact controls popover. Implementation work should follow pass-before-push delivery: do not commit and push a known-broken clone when build, unit, browser interaction, console, or git alignment checks fail.

**Considered Options**

- A title screen would add polish, but it delays the actual toy experience and risks becoming a landing page.
- Imported bitmap or texture assets could add richness, but they would make the first build less inspectable and less portable.
- Audio feedback could make the toybox feel more tactile, but it would add another debugging surface before the visual 4D loop is proven.
- Best-effort pushes preserve partial progress, but they make it too easy to ship a rendered scene that fails the promised interaction contract.

**Consequences**

The first implementation should stay focused on visual and interaction evidence. Debug data should be available when needed, failure should be explicit when WebGL is unavailable, and final delivery should stop on failed verification instead of normalizing a broken push.
