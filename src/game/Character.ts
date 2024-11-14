import { Vec3D } from "@/common/Vec3D";
import { WorldMap } from "./WorldMap";
import { Tile } from "./Tile";
import { Vec2D } from "@/common/Vec2D";
import { CharacterException } from "./exceptions";
import { AnimatedTile } from "./AnimatedTile";
import { lerp } from "@/common/Math";

export type Direction = "front" | "back" | "left" | "right";
export type Action = "idle" | "begin-walk" | "walking" | "attack" | "take-damage";

export class Character {
  private _pos: Vec3D;
  private _drawPos: Vec2D;
  private _direction: Direction;
  private _action: Action;
  private _tilesMap: Map<string, Tile>;
  private _currentTile: Tile;
  private _target?: Vec3D;
  private _targetDrawPos?: Vec2D;

  constructor(tiles: Map<string, Tile>) {
    this._pos = new Vec3D();
    this._direction = "front";
    this._action = "idle";
    this._drawPos = new Vec2D();
    this._tilesMap = tiles;
    const tile = this._retrieveCurrentTile();
    this._currentTile = tile;
    this._target = undefined;
    this._targetDrawPos = undefined;
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

  public get target(): Vec3D|undefined {
    return this._target;
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

  public set target(target: Vec3D) {
    this._target = target;
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
    this._updateAnimation(dt);
    this._moveCharacterToTarget(dt);
  }

  private _updateAnimation(dt: DOMHighResTimeStamp) {
    if (this._currentTile instanceof AnimatedTile) {
      this._currentTile.updateTimeline(dt);
    }
  }

  private _moveCharacterToTarget(dt: DOMHighResTimeStamp) {
    if (this._target == null || this._targetDrawPos == null) {
      return;
    }
    if (this._drawPos.almostEq(this._targetDrawPos, 1)) {
      this._pos = this._target;
      this._drawPos = this._targetDrawPos;
      this._target = undefined;
      this._targetDrawPos = undefined;
      return;
    }
    const newX = lerp(this._drawPos.x, this._targetDrawPos.x, 0.1);
    const newY = lerp(this._drawPos.y, this._targetDrawPos.y, 0.1);
    this._drawPos = new Vec2D(newX, newY);
  }

  public move(pos: Vec3D, map: WorldMap) {
    this._target = map.tile(pos).position;
    this._targetDrawPos = map.tile(pos).drawPos;
  }
}
