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
        {durationMs: 400, spriteNb: 0},
        {durationMs: 400, spriteNb: 1},
      ]
    ));
    tilesMap.set("front begin-walk", new AnimatedTile(
      new Vec3D(),
      new Vec2D(),
      this._spriteSheet as SpriteSheet,
      [
        {durationMs: 200, spriteNb: 8},
        {durationMs: 200, spriteNb: 9},
        {durationMs: 200, spriteNb: 10},
        {durationMs: 300, spriteNb: 11},
      ]
    ));
    tilesMap.set("front walking", new AnimatedTile(
      new Vec3D(),
      new Vec2D(),
      this._spriteSheet as SpriteSheet,
      [
        {durationMs: 200, spriteNb: 16},
        {durationMs: 200, spriteNb: 17},
      ]
    ));
    tilesMap.set("front attack", new AnimatedTile(
      new Vec3D(),
      new Vec2D(),
      this._spriteSheet as SpriteSheet,
      [
        {durationMs: 200, spriteNb: 24},
        {durationMs: 1000, spriteNb: 25},
      ]
    ));
    tilesMap.set("back idle", new AnimatedTile(
      new Vec3D(),
      new Vec2D(),
      this._spriteSheet as SpriteSheet,
      [
        {durationMs: 400, spriteNb: 4},
        {durationMs: 400, spriteNb: 5},
      ]
    ));
    tilesMap.set("back begin-walk", new AnimatedTile(
      new Vec3D(),
      new Vec2D(),
      this._spriteSheet as SpriteSheet,
      [
        {durationMs: 200, spriteNb: 12},
        {durationMs: 200, spriteNb: 13},
        {durationMs: 200, spriteNb: 14},
        {durationMs: 300, spriteNb: 15},
      ]
    ));
    tilesMap.set("back walking", new AnimatedTile(
      new Vec3D(),
      new Vec2D(),
      this._spriteSheet as SpriteSheet,
      [
        {durationMs: 200, spriteNb: 20},
        {durationMs: 200, spriteNb: 21},
      ]
    ));
    tilesMap.set("back attack", new AnimatedTile(
      new Vec3D(),
      new Vec2D(),
      this._spriteSheet as SpriteSheet,
      [
        {durationMs: 200, spriteNb: 28},
        {durationMs: 1000, spriteNb: 29},
      ]
    ));
    tilesMap.set("left idle", new AnimatedTile(
      new Vec3D(),
      new Vec2D(),
      this._spriteSheet as SpriteSheet,
      [
        {durationMs: 400, spriteNb: 32},
        {durationMs: 400, spriteNb: 33},
      ]
    ));
    tilesMap.set("left begin-walk", new AnimatedTile(
      new Vec3D(),
      new Vec2D(),
      this._spriteSheet as SpriteSheet,
      [
        {durationMs: 200, spriteNb: 40},
        {durationMs: 200, spriteNb: 41},
        {durationMs: 200, spriteNb: 42},
        {durationMs: 300, spriteNb: 43},
      ]
    ));
    tilesMap.set("left walking", new AnimatedTile(
      new Vec3D(),
      new Vec2D(),
      this._spriteSheet as SpriteSheet,
      [
        {durationMs: 200, spriteNb: 48},
        {durationMs: 200, spriteNb: 49},
      ]
    ));
    tilesMap.set("left attack", new AnimatedTile(
      new Vec3D(),
      new Vec2D(),
      this._spriteSheet as SpriteSheet,
      [
        {durationMs: 200, spriteNb: 56},
        {durationMs: 1000, spriteNb: 57},
      ]
    ));
    tilesMap.set("right idle", new AnimatedTile(
      new Vec3D(),
      new Vec2D(),
      this._spriteSheet as SpriteSheet,
      [
        {durationMs: 400, spriteNb: 36},
        {durationMs: 400, spriteNb: 37},
      ]
    ));
    tilesMap.set("right begin-walk", new AnimatedTile(
      new Vec3D(),
      new Vec2D(),
      this._spriteSheet as SpriteSheet,
      [
        {durationMs: 200, spriteNb: 44},
        {durationMs: 200, spriteNb: 45},
        {durationMs: 200, spriteNb: 46},
        {durationMs: 300, spriteNb: 47},
      ]
    ));
    tilesMap.set("right walking", new AnimatedTile(
      new Vec3D(),
      new Vec2D(),
      this._spriteSheet as SpriteSheet,
      [
        {durationMs: 200, spriteNb: 52},
        {durationMs: 200, spriteNb: 53},
      ]
    ));
    tilesMap.set("right attack", new AnimatedTile(
      new Vec3D(),
      new Vec2D(),
      this._spriteSheet as SpriteSheet,
      [
        {durationMs: 200, spriteNb: 60},
        {durationMs: 1000, spriteNb: 61},
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
