import { Vec3D } from "@/common/Vec3D";
import { Sprite } from "@/ui/Sprite";

export class Tile {
  private _pos: Vec3D;
  private _sprite: Sprite;

  constructor(pos: Vec3D, sprite: Sprite) {
    this._pos = pos;
    this._sprite = sprite;
  }

  public get pos() {
    return this._pos;
  }

  public get sprite() {
    return this._sprite;
  }
}
