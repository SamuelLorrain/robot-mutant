import { Vec2D } from "@/common/Vec2D";
import { Vec3D } from "@/common/Vec3D";
import { SpriteSheet } from "./SpriteSheet";

export interface Tile {
  get position(): Vec3D;
  get drawPos(): Vec2D;
  get spriteSheet(): SpriteSheet;
  get spriteNb(): number;
  get blocked(): boolean;
}

export class StaticTile implements Tile {
  private _pos: Vec3D;
  private _drawPos: Vec2D;
  private _spriteSheet: SpriteSheet;
  private _spriteNb: number;

  constructor(
    pos: Vec3D,
    drawPos: Vec2D,
    spriteSheet: SpriteSheet,
    spriteNb: number,
  ) {
    this._pos = pos;
    this._drawPos = drawPos;
    this._spriteSheet = spriteSheet;
    this._spriteNb = spriteNb;
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
    return this._spriteNb;
  }

  public get blocked(): boolean {
    return this._spriteSheet.getSprite(this._spriteNb).blocked;
  }
}
