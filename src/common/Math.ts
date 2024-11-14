
export function safeDiv(a: number, b: number) {
  if (b === 0) {
    return 0;
  }
  return a/b;
}

export function lerp(v0: number, v1: number, t: number) {
  return v0 + t * (v1 - v0);
}
