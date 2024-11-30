import { Hash } from "./Hash";

export class Vec3D {
  public x: number;
  public y: number;
  public z: number;

  constructor();
  constructor(x: number, y: number, z: number);
  constructor(x: number | Vec3D, y?: never, z?: never);
  constructor(x: number | Vec3D = 0, y: number = 0, z: number = 0) {
    if (x instanceof Vec3D) {
      this.x = x.x;
      this.y = x.y;
      this.z = x.z;
    } else {
      this.x = x;
      this.y = y;
      this.z = z;
    }
  }

  public set(x: number, y: number, z: number): void;
  public set(v: Vec3D, y?: never, z?: never): void;
  public set(x: number | Vec3D, y: number = 0, z:number = 0) {
    if (x instanceof Vec3D) {
      this.x = x.x;
      this.y = x.y;
      this.z = x.z;
    } else {
      this.x = x;
      this.y = y;
      this.z = z;
    }
  }

  public add(v: Vec3D) {
    return new Vec3D(
      this.x + v.x,
      this.y + v.y,
      this.z + v.z
    )
  }

  public sub(v: Vec3D) {
    return new Vec3D(
      this.x - v.x,
      this.y - v.y,
      this.z - v.z
    )
  }

  public mul(n: number) {
    return new Vec3D(
      this.x * n,
      this.y * n,
      this.z * n,
    )
  }

  public eq(v: Vec3D): boolean {
    return this.x === v.x && this.y === v.y && this.z == v.z;
  }

  public almostEq(v: Vec3D, delta: number): boolean {
    return Math.abs(this.x - v.x) <= delta && Math.abs(this.y - v.y) <= delta && Math.abs(this.z - v.z) <= delta;
  }

  public hash(): Hash {
    return JSON.stringify([this.x, this.y, this.z]);
  }

  public static unhash(hash: Hash): Vec3D {
    const jsonRepr = JSON.parse(hash);
    return new Vec3D(jsonRepr[0], jsonRepr[1], jsonRepr[2]);
  }
}
