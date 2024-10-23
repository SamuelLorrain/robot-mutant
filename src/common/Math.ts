
export function safeDiv(a: number, b: number) {
  if (b === 0) {
    return 0;
  }
  return a/b;
}
