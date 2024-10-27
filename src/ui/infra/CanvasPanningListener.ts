import { Vec2D } from "@/common/Vec2D";

export default class CanvasPanningListener {
  readonly _canvas: HTMLCanvasElement;
  private _dragging: boolean;
  private _drag: Vec2D;
  private _dragstart: Vec2D;
  private _currentDragging: Vec2D;
  private _scale: number;

  constructor(canvas: HTMLCanvasElement, initialOffset?: Vec2D) {
    this._canvas = canvas;
    this._dragging = false;
    if (initialOffset == null) {
      this._drag = new Vec2D();
    } else {
      this._drag = new Vec2D(initialOffset);
    }
    this._dragstart = new Vec2D();
    this._currentDragging = new Vec2D();
    this._scale = 1;

    this._canvas.addEventListener('mousedown', (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      this._dragging = true;
      this._currentDragging = new Vec2D(this._drag);
      this._dragstart.set(
        (e.clientX * window.devicePixelRatio) / this._scale,
        (e.clientY * window.devicePixelRatio) / this._scale
      )
    });

    canvas.addEventListener('mouseup', (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      this._dragging = false;
    });

    canvas.addEventListener('mousemove', (e: MouseEvent) => {
      if (!this._dragging) {
        return;
      }
      const currentPosition = new Vec2D(
        (e.clientX * window.devicePixelRatio) / this._scale,
        (e.clientY * window.devicePixelRatio) / this._scale
      )
      if (this._dragstart.almostEq(currentPosition, 2)) {
        return;
      }

      this._drag.set(new Vec2D(
        (e.clientX * window.devicePixelRatio / this._scale) - this._dragstart.x + this._currentDragging.x,
        (e.clientY * window.devicePixelRatio / this._scale) - this._dragstart.y + this._currentDragging.y
      ));
    });
  }

  public get drag(): Vec2D {
    return this._drag;
  };

  public set scale(scale: number) {
    this._scale = scale;
  }
}
