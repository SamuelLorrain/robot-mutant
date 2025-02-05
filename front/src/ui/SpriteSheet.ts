import Picture from "@/ui/Picture";
import { Vec2D } from "@/common/Vec2D";

export class SpriteSheet {
  readonly _picture: Picture;
  readonly _sizeSprite: Vec2D;
  readonly _spritesPerDimension: Vec2D;

  constructor(
      picture: Picture,
      sizeSprite: Vec2D,
      spritesPerDimension: Vec2D,
  ) {
      this._picture = picture;
      this._sizeSprite = sizeSprite;
      this._spritesPerDimension = spritesPerDimension;
  }

  public getSpritePosition(spriteNb: number): Vec2D {
    const x = spriteNb % this._spritesPerDimension.x;
    const y = Math.floor(spriteNb / this._spritesPerDimension.x);
    return new Vec2D(x * this._sizeSprite.x, y * this._sizeSprite.y);
  }

  public get sizeOfSprite() {
    return new Vec2D(this._sizeSprite);
  }

  public get picture() {
    return this._picture;
  }
}
