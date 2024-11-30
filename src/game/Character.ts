import { Vec3D } from "@/common/Vec3D";
import { Sprite } from "@/ui/Sprite";
import { Tile } from "./Tile";
import { CharacterException } from "./exceptions";

export type Direction = "front" | "back" | "left" | "right";
export type Action = "idle" | "begin-walk" | "walking" | "attack" | "take-damage";

export class Character {
  private _pos: Vec3D;
  private _spriteMap: Map<string, Sprite>;
  private _direction: Direction;
  private _action: Action;

  constructor(
    pos: Vec3D,
    spriteMap: Map<string, Sprite>
  ) {
    this._pos = new Vec3D(pos);
    this._spriteMap = spriteMap;
    this._direction = "front";
    this._action = "idle";
  }
  public get pos() {
    return this._pos;
  }

  public get tile() {
    const sprite = this._spriteMap.get(
      JSON.stringify([this._direction, this._action])
    )
    if (sprite == null) {
      throw new CharacterException("Unknown sprite");
    }
    return new Tile(
      new Vec3D(this._pos),
      sprite
    )
  }
}
