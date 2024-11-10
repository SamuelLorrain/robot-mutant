import { Vec2D } from "@/common/Vec2D";
import { Vec3D } from "@/common/Vec3D";
import { Tile } from "./Tile";
import { SpriteSheet } from "./SpriteSheet";

export type AnimationTileTimelineFrame = {
  durationMs: number,
  spriteNb: number
}

export class AnimatedTile implements Tile {
  private _pos: Vec3D;
  private _drawPos: Vec2D;
  private _spriteSheet: SpriteSheet;
  private _currentSpriteNb: number;
  private _timeline: AnimationTileTimelineFrame[];
  private _ticks: DOMHighResTimeStamp;

  constructor(
    pos: Vec3D,
    drawPos: Vec2D,
    spriteSheet: SpriteSheet,
    timeline: AnimationTileTimelineFrame[]
  ) {
    this._pos = pos;
    this._drawPos = drawPos;
    this._spriteSheet = spriteSheet;
    this._timeline = timeline;
    this._currentSpriteNb = 0;
    this._ticks = 0;
  }

  public updateTimeline(dt: DOMHighResTimeStamp) {
    this._ticks += dt;
    if (this._ticks >= this._timeline[this._currentSpriteNb].durationMs) {
      this._ticks = this._ticks % this._timeline[this._currentSpriteNb].durationMs;
      this._currentSpriteNb = (this._currentSpriteNb + 1) % this._timeline.length;
    }
  }

  public get position() {
    return this._pos;
  }

  public get drawPos() {
    return this._drawPos;
  }

  public get spriteSheet() {
    return this._spriteSheet;
  }

  public get spriteNb() {
    return this._timeline[this._currentSpriteNb].spriteNb;
  }

  public get ticks() {
    return this._ticks;
  }
}
