import { Vec3D } from "@/common/Vec3D";
import { Sprite } from "@/ui/Sprite";
import { Tile } from "./Tile";
import { CharacterException } from "./exceptions";
import { FinishActionEvent, GameEvent } from "./events/GameEvent";
import { Queue } from "@/common/Queue";

export type Direction = "front" | "back" | "left" | "right";
export type Action = "idle" | "begin-walk" | "walking" | "attack" | "take-damage";

const CHARACTER_SPEED: number = .1;

export class Character {
  private _pos: Vec3D;
  private _spriteMap: Map<string, Sprite>;
  private _direction: Direction;
  private _action: Action;
  private _target?: Vec3D;
  private _gameEventQueue: Queue<GameEvent>
  private _path: Vec3D[];
  private _movePerTurn: number;
  private _currentMoveAvailable: number;

  constructor(
    pos: Vec3D,
    spriteMap: Map<string, Sprite>,
    gameEventQueue: Queue<GameEvent>,
    movePerTurn: number
  ) {
    this._pos = new Vec3D(pos);
    this._spriteMap = spriteMap;
    this._direction = "front";
    this._action = "idle";
    this._target = undefined;
    this._path = [];
    this._gameEventQueue = gameEventQueue;
    this._movePerTurn = movePerTurn;
    this._currentMoveAvailable = movePerTurn;
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

  public get movePerTurn() {
    return this._movePerTurn;
  }

  public get currentMoveAvailable() {
    return this._currentMoveAvailable;
  }

  public set currentMoveAvailable(movesAvailable: number) {
    if (movesAvailable < 0) {
      this._currentMoveAvailable = 0;
      return;
    }
    this._currentMoveAvailable = movesAvailable;
  }

  public startMoving(path: Vec3D[]) {
    this._action = "walking";
    this._path = path;
    this._target = path.shift();
  }

  public update(dt: DOMHighResTimeStamp) {
    if (this._action === "walking") {
      this._doWalk(dt);
    }
  }

  private _doWalk(_: DOMHighResTimeStamp) {
    if (this._target == null) {
      throw new CharacterException("Unable to walk with an empty target");
    }
    if (this._target.almostEq(this._pos, 0.01)) {
      this._pos.set(this._target);
      if (this._path.length == 0) {
        this._finishWalk();
        return;
      }
      this._target = this._path.shift();
      if (this._target == null) {
        return;
      }
    }
    const diff = this._target.sub(this.pos);
    if (diff.x > 0) {
      this._direction = "right";
      this._pos.x += CHARACTER_SPEED;
    } else if (diff.x < 0) {
      this._direction = "left";
      this._pos.x -= CHARACTER_SPEED;
    } else if (diff.y > 0) {
      this._direction = "front";
      this._pos.y += CHARACTER_SPEED;
    } else if (diff.y < 0) {
      this._direction = "back";
      this._pos.y -= CHARACTER_SPEED;
    } else {
      throw new CharacterException("Invalid movement");
    }
    this._pos.z += diff.z;
  }

  private _finishWalk() {
    this._action = "idle";
    this._target = undefined;
    this._gameEventQueue.enqueue({
      kind: "FinishActionEvent"
    } satisfies FinishActionEvent)
  }
}
