import { describe, expect, it } from "vitest";
import { hypersphereSlice, rotate4, toySlice, type ToyKind } from "./geometry";

describe("Geometry Core", () => {
  it("slices a hypersphere using the independent radius formula", () => {
    expect(hypersphereSlice(5, 3)).toEqual({
      kind: "visible",
      radius: 4,
      ghostRadius: 5
    });
  });

  it("keeps a vanished hypersphere discoverable as ghost-only", () => {
    expect(hypersphereSlice(2, 3)).toEqual({
      kind: "ghost-only",
      radius: 0,
      ghostRadius: 2
    });
  });

  it("rotates through the XW plane while preserving the 4D length", () => {
    const rotated = rotate4({ x: 1, y: 2, z: 3, w: 4 }, "XW", Math.PI / 2);
    const length = Math.hypot(rotated.x, rotated.y, rotated.z, rotated.w);

    expect(rotated.x).toBeCloseTo(-4);
    expect(rotated.w).toBeCloseTo(1);
    expect(length).toBeCloseTo(Math.hypot(1, 2, 3, 4));
  });

  it.each([
    ["hypersphere", 0, 1],
    ["tesseract", 0.5, 0.81],
    ["simplex", 0.32, 0.69],
    ["duocylinder", 0, 0.94]
  ] satisfies Array<[ToyKind, number, number]>)("%s returns a predictable visible slice", (toyKind, w, expectedScale) => {
    expect(toySlice(toyKind, w).kind).toBe("visible");
    expect(toySlice(toyKind, w).scale).toBeCloseTo(expectedScale);
  });

  it.each(["hypersphere", "tesseract", "simplex", "duocylinder"] satisfies ToyKind[])(
    "%s becomes ghost-only outside its readable slice",
    (toyKind) => {
      expect(toySlice(toyKind, 1.5).kind).toBe("ghost-only");
    }
  );
});
