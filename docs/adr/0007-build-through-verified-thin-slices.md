# Build through verified thin slices

Implementation will start with an end-to-end thin slice: one hypersphere, one W control, one rotation, and one Playwright geometry-change check. The first milestone after docs should contain one working toy rather than scaffold-only work or the full toy set, and later toys should pass an expansion gate before the next toy is added.

**Considered Options**

- Math-first implementation would protect invariants early, but it could postpone discovering whether the toy loop actually feels usable.
- Scene/UI-first implementation would create visible progress, but it could hide missing 4D behavior behind polish.
- Full toy-set implementation in one push would maximize apparent progress, but it would make regressions and weak verification much harder to isolate.

**Consequences**

The build should use milestone commits and a scope freeze during implementation. New feature ideas should be deferred unless they unblock the agreed toy loop, and the design phase is considered complete after this sequencing decision; remaining questions are implementation discoveries unless new product constraints appear.
