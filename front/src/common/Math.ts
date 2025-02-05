
export function safeDiv(a: number, b: number) {
  if (b === 0) {
    return 0;
  }
  return a/b;
}

export function lerp(v0: number, v1: number, t: number) {
  return v0 + t * (v1 - v0);
}


export function* range(a: number, b: number|undefined = undefined) {
  let begin = 0;
  let end = a;
  if (b != null) {
    begin = a;
    end = b;
  }
  for(let x = begin; x < end; x++) {
    yield x;
  }
}
