import { AutonomousTimer } from "@/common/Timer";
import { TICKS_PER_FRAME } from "@/globals";
import { Renderer } from "./Renderer";
import { Updater } from "./Updater";
import { Selector } from "./Selector";
import { WorldMap } from "./WorldMap";
import { GameState } from "./GameState";
import { GameEvent } from "./events/GameEvent";
import { Queue } from "@/common/Queue";

export class Game {
  readonly _renderer: Renderer;
  readonly _updater: Updater;
  readonly _mainClock: AutonomousTimer;
  readonly _selector: Selector;
  private _lastTime : number;
  private _countedFrames : number;
  private _accumulatedDt : number;
  private _gameEventQueue: Queue<GameEvent>;

  constructor(
    updater: Updater,
    renderer: Renderer,
    selector: Selector,
    gameEventQueue: Queue<GameEvent>
  ) {
    this._updater = updater;
    this._renderer = renderer;
    this._selector = selector;
    this.gameLoop = this.gameLoop.bind(this);

    this._mainClock = new AutonomousTimer();
    this._lastTime = 0;
    this._countedFrames = 0;
    this._accumulatedDt = 0;
    this._gameEventQueue = gameEventQueue;
  }

  public init() {
    this._mainClock.start();
  }

  public gameLoop(gameState: GameState, worldMap: WorldMap) {
    const now = this._mainClock.getTicks();
    const millisecondsDt = now - this._lastTime;
    this._lastTime = now;
    this._accumulatedDt += millisecondsDt;

    this._selector.updateHoverTile();
    this._selector.handleClickEvents(gameState, worldMap);
    this._handleEvents(gameState, worldMap);
    this._updater.updateTimeline(this._accumulatedDt)

    if (this._accumulatedDt >= TICKS_PER_FRAME) {
      this._renderer.cleanUp();
      this._renderer.render();
      this._accumulatedDt = 0;
    }

    this._countedFrames += 1;
    requestAnimationFrame(() => this.gameLoop(gameState, worldMap));
  }

  private _handleEvents(gameState: GameState, worldMap: WorldMap) {
    while(!this._gameEventQueue.empty()) {
      const event: GameEvent = this._gameEventQueue.dequeue();
      gameState.handleEvent(
        event,
        worldMap
      )
    }
  }
}
