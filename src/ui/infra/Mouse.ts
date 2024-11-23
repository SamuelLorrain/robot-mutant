import { Observer } from "@/common/behavioral/Observer";
import { PublisherEvent } from "@/common/behavioral/PublisherEvent";
import { safeDiv } from "@/common/Math";
import { Vec2D } from "@/common/Vec2D";

const scaleFactor: number[] = [
  0,
  4,
  3,
  2.67,
  2.5,
  2.4
];

export default class Mouse implements Observer {
  private _mouseVec: Vec2D;
  private static _instance: Mouse;
  private _scale: number;
  private _canvasSize: Vec2D;

  private constructor() {
    this._mouseVec = new Vec2D();
    this._scale = 1;
    this._canvasSize = new Vec2D();

    window.addEventListener(
     'mousemove',
      (e: MouseEvent) => {
        this._mouseVec.set(
          ((e.clientX * window.devicePixelRatio) / this._scale) + safeDiv(this._canvasSize.x, scaleFactor[this._scale-1]),
          ((e.clientY * window.devicePixelRatio) / this._scale) + safeDiv(this._canvasSize.y, scaleFactor[this._scale-1])
        );
      }
    );
  }

  public static getInstance(): Mouse {
    if (!Mouse._instance) {
      Mouse._instance = new Mouse();
    }
    return Mouse._instance;
  }

  public get vec() {
    return this._mouseVec;
  }

  public set scale(scale: number) {
    this._scale = scale;
  }

  public set canvasSize(v: Vec2D) {
    this._canvasSize.set(v);
  }

  public update(event: PublisherEvent) {
    if (event.eventType === "ScaleEvent") {
      this._scale = event.data;
    } else if (event.eventType === "ResizeEvent") {
      this._canvasSize = new Vec2D(
        event.data.width,
        event.data.height,
      )
    }
  }
}
