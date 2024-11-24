import { Vec3D } from "@/common/Vec3D";
import { WorldMap } from "./WorldMap";
import { Tile } from "./Tile";
import { Vec2D } from "@/common/Vec2D";
import { CharacterException } from "./exceptions";
import { AnimatedTile } from "./AnimatedTile";
import { PublisherEvent } from "@/common/behavioral/PublisherEvent";
import { Publisher } from "@/common/behavioral/Publisher";
import { Observer } from "@/common/behavioral/Observer";

export type Direction = "front" | "back" | "left" | "right";
export type Action = "idle" | "begin-walk" | "walking" | "attack" | "take-damage";

type PathStep = {
  target: Vec3D
  targetDrawPos: Vec2D
};

const CHARACTER_SPEED = 40;

export class Character implements Observer, Publisher {
  private _pos: Vec3D;
  private _drawPos: Vec2D;
  private _direction: Direction;
  private _action: Action;
  private _tilesMap: Map<string, Tile>;
  private _currentTile: Tile;
  private _target?: Vec3D;
  private _targetDrawPos?: Vec2D;
  private _targetPath: PathStep[];
  private _velocity: Vec2D;
  private _observers: Observer[];

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
    this._targetPath = [];
    this._velocity = new Vec2D();
    this._observers = [];
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
    if (this._direction == direction) {
      return;
    }
    this._direction = direction;
    this._currentTile = this._retrieveCurrentTile();
  }

  public set action(action: Action) {
    if (this._action == action) {
      return;
    }
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

  public update(event: PublisherEvent) {
    if (event.eventType !== "TimerEvent") {
      return;
    }
    this._updateAnimation(event.data);
    this._moveCharacterToTarget(event.data);
  }

  public addObserver(observer: Observer) {
    this._observers.push(observer);
  }

  public notify() {
    for(const observer of this._observers) {
      observer.update({
        data: null,
        eventType: "EndMovementEvent"
      })
    }
  }

  private _updateAnimation(dt: DOMHighResTimeStamp) {
    if (this._currentTile instanceof AnimatedTile) {
      this._currentTile.updateTimeline(dt);
    }
  }

  private _moveCharacterToTarget(dt: DOMHighResTimeStamp) {
    if ((this._target == null ||
      this._targetDrawPos == null)
      && this._targetPath.length == 0
    ) {
      this.action = "idle";
      return;
    }

    if ((this._target == null ||
      this._targetDrawPos == null)
      && this._targetPath.length > 0) {
      this.action = "walking";
      const currentStep = this._targetPath.shift();
      if (currentStep == undefined) {
        return;
      }
      this._target = new Vec3D(currentStep.target);
      this._targetDrawPos = new Vec2D(currentStep.targetDrawPos);
      this._velocity = this._targetDrawPos
        .sub(this._drawPos)
        .normalize()
        .mul(CHARACTER_SPEED)
        .mul(1/dt);
      this._changeCharacterDirection();
    }

    this._moveTowardsNextTarget(dt);
  }

  private _moveTowardsNextTarget(dt: DOMHighResTimeStamp) {
    if (this._target == null || this._targetDrawPos == null) {
      return;
    }

    this._drawPos = this._drawPos.add(this._velocity);

    if (this._drawPos.almostEq(this._targetDrawPos, 1)) {
      this._pos = this._target;
      this._drawPos = this._targetDrawPos;
      this._target = undefined;
      this._targetDrawPos = undefined;
      if (this._targetPath.length === 0) {
        this.notify();
      }
    }
  }

  private _changeCharacterDirection() {
    if (this._target == null) {
      return;
    }
    if (this._target.x > this._pos.x) {
      this.direction = "left";
    } else if (this._target.x < this._pos.x) {
      this.direction = "right";
    } else if (this._target.y > this._pos.y) {
      this.direction = "front";
    } else if (this._target.y < this._pos.y) {
      this.direction = "back";
    }
  }

  public startMove(path: Vec2D[], map: WorldMap) {
    const consolidatedPath: PathStep[] = [];
    path.forEach(p => {
      const currentTile = map.tileTopTower(p);
      consolidatedPath.push({
        target: currentTile.position,
        targetDrawPos: currentTile.drawPos
      });
    });
    this._targetPath = consolidatedPath;
  }

  public get targetPath() {
    return this._targetPath;
  }
}
