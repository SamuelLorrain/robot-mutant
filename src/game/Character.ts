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

  constructor(
    pos: Vec3D,
    spriteMap: Map<string, Sprite>,
    gameEventQueue: Queue<GameEvent>
  ) {
    this._pos = new Vec3D(pos);
    this._spriteMap = spriteMap;
    this._direction = "front";
    this._action = "idle";
    this._target = undefined;
    this._gameEventQueue = gameEventQueue;
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

  public startMoving(target: Tile) {
    this._action = "walking";
    this._target = target.pos;
  }

  public update(dt: DOMHighResTimeStamp) {
    if (this._action === "walking") {
      this._doWalk(dt);
    }
  }

  private _doWalk(dt: DOMHighResTimeStamp) {
    if (this._target == null) {
      throw new CharacterException("Unable to walk with an empty target");
    }
    if (this._target.eq(this._pos)) {
      this._action = "idle";
      this._target = undefined;
      this._gameEventQueue.enqueue({
        kind: "FinishActionEvent"
      } satisfies FinishActionEvent)
      return;
    }
    this.pos.set(this._target);
  }
}
