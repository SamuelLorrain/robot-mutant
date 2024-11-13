import { Vec2D } from "@/common/Vec2D";
import { Vec3D } from "@/common/Vec3D";

export class Character {
  private _pos: Vec3D;
  private _drawPos: Vec2D;

  constructor() {
    this._pos = new Vec3D();
    this._drawPos = new Vec2D();
  }

  public set pos(pos: Vec3D) {
    this._pos = new Vec3D(pos);
  }

  public set drawPos(pos: Vec2D) {
    this._drawPos = new Vec2D(pos);
  }

  public get drawPos() {
    return this._drawPos;
  }

  public get pos() {
    return this._pos;
  }
}
