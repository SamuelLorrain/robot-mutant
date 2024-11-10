/**
 * A Timer implementation
 * that rely on `performance.now()` to get
 * the time.
 */
export class AutonomousTimer {
  private _startTicks: number;
  private _pausedTicks: number;
  private _isPaused: boolean;
  private _isStarted: boolean;

  constructor() {
    this._startTicks = 0;
    this._pausedTicks = 0;
    this._isPaused = false;
    this._isStarted = false;
  }

  public start(startTime: DOMHighResTimeStamp|null = null) {
    this._isStarted = true;
    this._isPaused = false;
    if (startTime == null) {
      this._startTicks = performance.now();
    } else {
      this._startTicks = startTime;
    }
    this._pausedTicks = 0;
  }

  public stop() {
    this._isStarted = false;
    this._isPaused = false;
    this._startTicks = 0;
    this._pausedTicks = 0;
  }

  public pause() {
    if (this._isStarted && !this._isPaused) {
      this._isPaused = true;
      this._pausedTicks = performance.now() - this._startTicks;
      this._startTicks = 0;
    }
  }

  public unpause() {
    if (this._isStarted && this._isPaused) {
      this._isPaused = false;
      this._startTicks = performance.now() - this._pausedTicks;
      this._pausedTicks = 0;
    }
  }

  public getTicks() {
    let currentTime = -1;
    if (this._isStarted) {
      if (this._isPaused) {
        currentTime = this._pausedTicks;
      } else {
        currentTime = performance.now() - this._pausedTicks;
      }
    }
    return currentTime;
  }

  public get isPaused(): boolean {
    return this._isStarted && this._isPaused;
  }

  public get isStarted(): boolean {
    return this._isStarted;
  }
}

/**
 * A Timer implementation
 * that rely on an external source of truth
 */
export class ManualTimer {
  private _startTicks: number;
  private _pausedTicks: number;
  private _isPaused: boolean;
  private _isStarted: boolean;

  constructor() {
    this._startTicks = 0;
    this._pausedTicks = 0;
    this._isPaused = false;
    this._isStarted = false;
  }

  public start(startTime: DOMHighResTimeStamp) {
    this._isStarted = true;
    this._isPaused = false;
    this._startTicks = startTime;
    this._pausedTicks = 0;
  }

  public stop() {
    this._isStarted = false;
    this._isPaused = false;
    this._startTicks = 0;
    this._pausedTicks = 0;
  }

  public pause(timestampOnPause: DOMHighResTimeStamp) {
    if (this._isStarted && !this._isPaused) {
      this._isPaused = true;
      this._pausedTicks = timestampOnPause - this._startTicks;
      this._startTicks = 0;
    }
  }

   public unpause(timestampUnpause: DOMHighResTimeStamp) {
    if (this._isStarted && this._isPaused) {
      this._isPaused = false;
      this._startTicks = timestampUnpause - this._pausedTicks;
      this._pausedTicks = 0;
    }
  }

  public getTicks(timestamp: DOMHighResTimeStamp) {
    let currentTime = -1;
    if (this._isStarted) {
      if (this._isPaused) {
        currentTime = this._pausedTicks;
      } else {
        currentTime = timestamp - this._pausedTicks;
      }
    }
    return currentTime;
  }

  public get isPaused(): boolean {
    return this._isStarted && this._isPaused;
  }

  public get isStarted(): boolean {
    return this._isStarted;
  }
}
