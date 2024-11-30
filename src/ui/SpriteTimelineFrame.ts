
export type SpriteTimelineFrame = {
  durationMs: number,
  spriteNb: number,
}

export function createSingleFrameTimeline(spriteNb: number) {
  return {
    durationMs: -1,
    spriteNb: spriteNb
  }
}
