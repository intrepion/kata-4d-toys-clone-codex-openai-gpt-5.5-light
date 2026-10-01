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

export function clampW(value: number, limit = 1.6): number {
  return Math.max(-limit, Math.min(limit, value));
}
