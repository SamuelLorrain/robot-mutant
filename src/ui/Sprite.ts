import { SpriteSheet } from "./SpriteSheet";
import { SpriteTimelineFrame } from "./SpriteTimelineFrame";

export class Sprite {
  readonly _spriteSheet: SpriteSheet;
  readonly _timeline: SpriteTimelineFrame[];

  private _ticks: DOMHighResTimeStamp;
  private _paused: boolean;
  private _spriteNb: number;
  private _timelineFrame: number;

  constructor(
    spriteSheet: SpriteSheet,
    timeline: SpriteTimelineFrame[]
  ) {
    this._spriteSheet = spriteSheet;
    this._spriteNb = timeline[0].spriteNb ?? 0;
    this._timeline = timeline;
    this._timelineFrame = 0;
    this._ticks = 0;
    this._paused = false;
  }

  public get spriteSheet() {
    return this._spriteSheet;
  }

  public get spriteNb() {
    return this._spriteNb;
  }

  public get ticks() {
    return this._ticks;
  }

  public set ticks(ticks: number) {
    this._ticks = ticks;
    this.updateSpriteAccordingToTimeline();
  }

  public restart() {
    this._ticks = 0;
  }

  public set paused(pauseStatus: boolean) {
    this._paused = pauseStatus;
  }

  public updateTimeline(dt: DOMHighResTimeStamp) {
    if (this._paused || this._timeline.length === 0) {
      return;
    }
    this._ticks += dt;
    this.updateSpriteAccordingToTimeline();
  }

  public updateSpriteAccordingToTimeline() {
    if (this._ticks >= this._timeline[this._timelineFrame].durationMs) {
      this._ticks = this._ticks % this._timeline[this._timelineFrame].durationMs;
      this._timelineFrame = (this._timelineFrame + 1) % this._timeline.length;
      this._spriteNb = this._timeline[this._timelineFrame].spriteNb;
    }
  }
}

