import { Vec2D } from "@/common/Vec2D";

export default class Mouse {
  private _mouseVec: Vec2D;
  private static _instance: Mouse;

  private constructor() {
    this._mouseVec = new Vec2D();

    window.addEventListener(
     'mousemove',
      (e: MouseEvent) => {
        this._mouseVec.set(
          e.clientX * window.devicePixelRatio,
          e.clientY * window.devicePixelRatio
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

  public get x() {
    return this._mouseVec.x;
  }

  public get y() {
    return this._mouseVec.y;
  }
}
