import { Hash } from "./Hash";

export class Vec2D {
  public x: number;
  public y: number;

  constructor();
  constructor(x: number, y: number);
  constructor(x: number | Vec2D, y?: never);
  constructor(x: number | Vec2D = 0, y: number = 0) {
    if (x instanceof Vec2D) {
      this.x = x.x;
      this.y = x.y;
    } else {
      this.x = x;
      this.y = y;
    }
  }

  public set(x: number, y: number): void;
  public set(v: Vec2D, y?: never): void;
  public set(x: number | Vec2D, y: number = 0) {
    if (x instanceof Vec2D) {
      this.x = x.x;
      this.y = x.y;
    } else {
      this.x = x;
      this.y = y;
    }
  }

  public add(v: Vec2D) {
    return new Vec2D(
      this.x + v.x,
      this.y + v.y,
    )
  }

  public sub(v: Vec2D) {
    return new Vec2D(
      this.x - v.x,
      this.y - v.y,
    )
  }

  public mul(n: number) {
    return new Vec2D(
      this.x * n,
      this.y * n,
    )
  }

  public eq(v: Vec2D): boolean {
    return this.x === v.x && this.y === v.y;
  }

  public almostEq(v: Vec2D, delta: number): boolean {
    return Math.abs(this.x - v.x) <= delta && Math.abs(this.y - v.y) <= delta;
  }

  public hash(): Hash {
    return JSON.stringify([this.x, this.y]);
  }

  public static unhash(hash: Hash): Vec2D {
    const jsonRepr = JSON.parse(hash);
    return new Vec2D(jsonRepr[0], jsonRepr[1]);
  }

  public map(f: (x: number) => number): Vec2D {
    return new Vec2D(
      f(this.x),
      f(this.y)
    );
  }

  public length(): number {
    return Math.sqrt(this.x*this.x + this.y*this.y);
  }

  public normalize(): Vec2D {
    const length = this.length();
    return new Vec2D(
      this.x / length,
      this.y / length
    );
  }

  public distance(b: Vec2D): number {
    return Math.sqrt(Math.pow(b.x - this.x, 2) + Math.pow(b.y - this.y, 2))
  }
}
