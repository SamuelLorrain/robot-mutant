import { AutonomousTimer } from "@/common/Timer";
import { TICKS_PER_FRAME } from "@/globals";
import { Renderer } from "./Renderer";
import { Updater } from "./Updater";
import { Selector } from "./Selector";

export class Game {
  readonly _renderer: Renderer;
  readonly _updater: Updater;
  readonly _mainClock: AutonomousTimer;
  readonly _selector: Selector;
  private _lastTime : number;
  private _countedFrames : number;
  private _accumulatedDt : number;

  constructor(
    updater: Updater,
    renderer: Renderer,
    selector: Selector
  ) {
    this._updater = updater;
    this._renderer = renderer;
    this._selector = selector;
    this.gameLoop = this.gameLoop.bind(this);

    this._mainClock = new AutonomousTimer();
    this._lastTime = 0;
    this._countedFrames = 0;
    this._accumulatedDt = 0;
  }

  public init() {
    this._mainClock.start();
  }

  public gameLoop() {
    const now = this._mainClock.getTicks();
    const millisecondsDt = now - this._lastTime;
    this._lastTime = now;
    this._accumulatedDt += millisecondsDt;

    this._updater.update(this._accumulatedDt)
    this._selector.updateHoverTile();

    if (this._accumulatedDt >= TICKS_PER_FRAME) {
      this._renderer.cleanUp();
      this._renderer.render();
      this._accumulatedDt = 0;
    }

    this._countedFrames += 1;
    requestAnimationFrame(this.gameLoop);
  }
}
