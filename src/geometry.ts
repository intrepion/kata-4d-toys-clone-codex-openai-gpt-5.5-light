export type Vec4 = {
  x: number;
  y: number;
  z: number;
  w: number;
};

export type RotationPlane = "XY" | "XZ" | "YZ" | "XW" | "YW" | "ZW";

export type HypersphereSlice = {
  kind: "visible" | "ghost-only";
  radius: number;
  ghostRadius: number;
};

export type ToyKind = "hypersphere" | "tesseract" | "simplex" | "duocylinder";

export type ToySlice = {
  kind: "visible" | "ghost-only";
  scale: number;
  ghostScale: number;
};

export function rotate4(point: Vec4, plane: RotationPlane, radians: number): Vec4 {
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const next = { ...point };
  const [a, b] = plane.toLowerCase().split("") as [keyof Vec4, keyof Vec4];
  const av = point[a];
  const bv = point[b];
  next[a] = av * cos - bv * sin;
  next[b] = av * sin + bv * cos;
  return next;
}

export function hypersphereSlice(radius: number, w: number): HypersphereSlice {
  if (radius <= 0) {
    throw new Error("Hypersphere radius must be positive.");
  }

  const distance = Math.abs(w);
  if (distance > radius) {
    return { kind: "ghost-only", radius: 0, ghostRadius: radius };
  }

  return {
    kind: "visible",
    radius: Math.sqrt(radius * radius - distance * distance),
    ghostRadius: radius
  };
}

export function toySlice(toyKind: ToyKind, w: number): ToySlice {
  switch (toyKind) {
    case "hypersphere": {
      const slice = hypersphereSlice(1, w);
      return { kind: slice.kind, scale: slice.radius, ghostScale: slice.ghostRadius };
    }
    case "tesseract": {
      const distance = Math.abs(w);
      if (distance > 1) {
        return { kind: "ghost-only", scale: 0, ghostScale: 1 };
      }
      return { kind: "visible", scale: Math.max(0.18, 1 - distance * 0.38), ghostScale: 1 };
    }
    case "simplex": {
      const distance = Math.abs(w + 0.18);
      if (distance > 1) {
        return { kind: "ghost-only", scale: 0, ghostScale: 1 };
      }
      return { kind: "visible", scale: Math.max(0.14, 1 - distance * 0.62), ghostScale: 1 };
    }
    case "duocylinder": {
      const distance = Math.abs(w);
      if (distance > 1.15) {
        return { kind: "ghost-only", scale: 0, ghostScale: 1 };
      }
      return { kind: "visible", scale: 0.52 + Math.cos(distance * Math.PI * 0.5) * 0.42, ghostScale: 1 };
    }
  }
}

export function clampW(value: number, limit = 1.6): number {
  return Math.max(-limit, Math.min(limit, value));
}
