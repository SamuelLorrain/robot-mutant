import Picture from "@/ui/infra/Picture";
import { SpriteException } from "./exceptions";
import { Vec2D } from "@/common/Vec2D";

export type SpritePosition = {
  /**
   * Size of each elements in the spritesheet
   */
  size: Vec2D,

  /**
   * Position of the current sprite in the spritesheet
   */
  position: Vec2D,

  /**
   * Indicate that an entity cannot cross the sprite
   */
  blocked: boolean;
};

export class SpriteSheet {
  readonly picture: Picture;
  readonly sizeSpriteX: number;
  readonly sizeSpriteY: number;
  readonly nbSpritesColumn: number;
  readonly nbSpritesRow: number;
  readonly blockedSprites: number[];

  constructor(
      picture: Picture,
      sizeSpriteX: number,
      sizeSpriteY: number,
      nbSpritesColumn: number,
      nbSpritesRow: number,
      blockedSprites: number[] = []
  ) {
      this.picture = picture;
      this.sizeSpriteX = sizeSpriteX;
      this.sizeSpriteY = sizeSpriteY;
      this.nbSpritesColumn = nbSpritesColumn;
      this.nbSpritesRow = nbSpritesRow;
      this.blockedSprites = blockedSprites;
  }

  /**
   * Get the top-right position of the
   * requested sprite in the sprite sheet.
   * Doesn't do a lot of checks
   */
  public getSprite(spriteNb: number): SpritePosition {
    const x = spriteNb % this.nbSpritesRow;
    const y = Math.floor(spriteNb / this.nbSpritesRow);

    return {
      size: new Vec2D(
        this.sizeSpriteX,
        this.sizeSpriteY,
      ),
      position: new Vec2D(
        x * this.sizeSpriteX,
        y * this.sizeSpriteY
      ),
      blocked: this.blockedSprites.includes(spriteNb)
    }
  }

  public get size() {
    return new Vec2D(this.sizeSpriteX, this.sizeSpriteY)
  }
}

export class SpriteSheetBuilder {
  private picture: Picture|null = null;
  private sizeSpriteX: number|null = null;
  private sizeSpriteY: number|null = null;
  private nbSpritesColumn: number|null = null;
  private blockedSprites: number[] = [];
  private nbSpritesRow: number|null = null;

  public setPicture(picture: Picture): SpriteSheetBuilder {
    this.picture = picture;
    return this;
  }

  public setSizeSpriteX(sizeSpriteX: number): SpriteSheetBuilder {
    this.sizeSpriteX = sizeSpriteX;
    return this
  }

  public setSizeSpriteY(sizeSpriteY: number): SpriteSheetBuilder {
    this.sizeSpriteY = sizeSpriteY;
    return this
  }

  public setNbSpritesColumn(nbSpritesColumn: number): SpriteSheetBuilder {
    this.nbSpritesColumn = nbSpritesColumn;
    return this
  }

  public setNbSpritesRow(nbSpritesRow: number): SpriteSheetBuilder {
    this.nbSpritesRow = nbSpritesRow;
    return this
  }

  public setBlockedSprites(blockedSprites: number[]) {
    this.blockedSprites = blockedSprites;
    return this;
  }

  public build(): SpriteSheet {
    if(!this.canBuild()) {
      throw new SpriteException("Unable to build Sprite, bad value");
    }
    return new SpriteSheet(
      this.picture as Picture,
      this.sizeSpriteX as number,
      this.sizeSpriteY as number,
      this.nbSpritesColumn as number,
      this.nbSpritesRow as number,
      this.blockedSprites
    )
  }

  private canBuild(): boolean {
    if (this.picture == null) {
      return false;
    }
    if (this.sizeSpriteX == null || !Number.isInteger(this.sizeSpriteX) || this.sizeSpriteX < 1) {
      return false
    }
    if (this.sizeSpriteY == null || !Number.isInteger(this.sizeSpriteY) || this.sizeSpriteY < 1) {
      return false
    }
    if (this.nbSpritesColumn == null || !Number.isInteger(this.nbSpritesColumn) || this.nbSpritesColumn < 1) {
      return false
    }
    if (this.nbSpritesRow == null || !Number.isInteger(this.nbSpritesRow) || this.nbSpritesRow < 1) {
      return false
    }
    return true;
  }
}
