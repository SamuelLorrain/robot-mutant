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


}
