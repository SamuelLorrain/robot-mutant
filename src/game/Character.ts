import { Vec3D } from "@/common/Vec3D";
import { WorldMap } from "./WorldMap";
import { Tile } from "./Tile";
import { Vec2D } from "@/common/Vec2D";
import { SpriteSheet } from "./SpriteSheet";
import { CharacterException } from "./exceptions";
import { AnimatedTile } from "./AnimatedTile";

export type Direction = "front" | "back" | "left" | "right";
export type Action = "idle" | "begin-walk" | "walking" | "attack" | "take-damage";

export class CharacterBuilder {
  private _spriteSheet?: SpriteSheet;

  constructor() {
    this._spriteSheet = undefined;
  }

  public setSpriteSheet(spriteSheet: SpriteSheet) {
    this._spriteSheet = spriteSheet;
    return this;
  }

  /*
   * JS is kinda weird with Maps,
   * so it's made using object and strings keys.
   * may change this later.
   */
  public constructTilesObject() {
    const tilesMap = new Map<string, Tile>();
    tilesMap.set("front idle", new AnimatedTile(
      new Vec3D(),
      new Vec2D(),
      this._spriteSheet as SpriteSheet,
      [
        {durationMs: 500, spriteNb: 0},
        {durationMs: 500, spriteNb: 1},
      ]
    ));

    return tilesMap;
  }


  public build(): Character {
    if (!this.canBuild()) {
      throw new CharacterException("Unable to build character");
    }
    return new Character(
      this.constructTilesObject()
    )
  }

  public canBuild(): boolean {
    if (this._spriteSheet == null) {
      return false;
    }
    return true;
  }

}

export class Character {
  private _pos: Vec3D;
  private _drawPos: Vec2D;
  private _direction: Direction;
  private _action: Action;
  private _tilesMap: Map<string, Tile>;
  private _currentTile: Tile;

  constructor(tiles: Map<string, Tile>) {
    this._pos = new Vec3D();
    this._direction = "front";
    this._action = "idle";
    this._drawPos = new Vec2D();
    this._tilesMap = tiles;
    const tile = this._retrieveCurrentTile();
    this._currentTile = tile;
  }

  public set pos(pos: Vec3D) {
    this._pos = new Vec3D(pos);
  }

  public get pos() {
    return this._pos;
  }

  public get drawPos() {
    return this._drawPos;
  }

  public set drawPos(drawPos: Vec2D) {
    this._drawPos = new Vec2D(drawPos);
  }

  public get tile() {
    return this._currentTile;
  }

  public set direction(direction: Direction) {
    this._direction = direction;
    this._currentTile = this._retrieveCurrentTile();
  }

  public set action(action: Action) {
    this._action = action;
    this._currentTile = this._retrieveCurrentTile();
  }

  private _retrieveCurrentTile() {
    const tile = this._tilesMap.get(`${this._direction} ${this._action}`);
    if (tile == null) {
      throw new CharacterException("direction/action couple doesn't exists");
    }
    if (tile instanceof AnimatedTile) {
      tile.ticks = 0;
      tile.paused = false;
    }
    return tile;
  }

  public updateTimeline(dt: DOMHighResTimeStamp) {
    if (this._currentTile instanceof AnimatedTile) {
      this._currentTile.updateTimeline(dt);
    }
  }

  public move(pos: Vec3D, map: WorldMap) {
    // TODO
  }
}
