import Context2DProvider from "@/ui/Context2DProvider";
import { SPRITE_SIZE, TILE_LEVEL_SIZE } from "@/globals";
import { Vec2D } from "@/common/Vec2D";
import { Vec3D } from "@/common/Vec3D";
import { Tile } from "./Tile";
import { WorldMap } from "./WorldMap";
import { Sprite } from "@/ui/Sprite";
import { Hash } from "@/common/Hash";

export type DrawnTile = {
  tile: Tile,
  drawPos: Vec2D
}

/**
 * TODO the Renderer does 2 things here...
 * - draw things in order
 * - project on plane,
 *
 * we may split both things
 */
export class Renderer {
  private _context2DProvider: Context2DProvider;
  private _tiles: Tile[] = [];
  private _drawnTiles: DrawnTile[] = [];
  private _cursor: Sprite;
  private _worldMap: WorldMap;

  constructor(cursor: Sprite, worldMap: WorldMap) {
    this._context2DProvider = Context2DProvider.getInstance();
    this._cursor = cursor;
    this._worldMap = worldMap;
  }

  public cleanUp() {
    this._context2DProvider.paintBackground();
  }

  public render() {
    for(const dTile of this._drawnTiles) {
      const sprite = dTile.tile.sprite;
      const drawPos = dTile.drawPos;
      this._context2DProvider.drawImage(
        sprite.spriteSheet.picture,
        sprite.spriteSheet.getSpritePosition(sprite.spriteNb),
        sprite.spriteSheet.sizeOfSprite,
        drawPos,
        sprite.spriteSheet.sizeOfSprite,
      )
      this._drawTileLine(dTile, this._worldMap.tilesInformations);
      this._drawHoverTile(dTile);
      this._drawTileLine(dTile, this._worldMap.currentPath);
      this._drawCharacters(dTile);
    }
  }

  private _drawTileLine(dTile: DrawnTile, tilesMap: Map<Hash, Tile>) {
    const tile = tilesMap.get(dTile.tile.pos.hash());
    if (tile != null) {
      this._context2DProvider.drawImage(
        tile.sprite.spriteSheet.picture,
        tile.sprite.spriteSheet.getSpritePosition(tile.sprite.spriteNb),
        tile.sprite.spriteSheet.sizeOfSprite,
        dTile.drawPos,
        tile.sprite.spriteSheet.sizeOfSprite,
      )
    }
  }

  private _drawHoverTile(dTile: DrawnTile) {
    if (this._worldMap.hoverTile?.pos.eq(dTile.tile.pos)) {
      this._context2DProvider.drawImage(
        this._cursor.spriteSheet.picture,
        this._cursor.spriteSheet.getSpritePosition(this._cursor.spriteNb),
        this._cursor.spriteSheet.sizeOfSprite,
        dTile.drawPos,
        this._cursor.spriteSheet.sizeOfSprite,
      )
    }
  }

  private _drawCharacters(dTile: DrawnTile) {
    const gridPos = dTile.tile.pos;
    for (const character of this._worldMap.characters) {
      if (character != null && character.pos.map(Math.ceil).eq(gridPos)) {
        const tile = character.tile;
        this._context2DProvider.drawImage(
          tile.sprite.spriteSheet.picture,
          tile.sprite.spriteSheet.getSpritePosition(tile.sprite.spriteNb),
          tile.sprite.spriteSheet.sizeOfSprite,
          this._getDrawPos(character.pos),
          tile.sprite.spriteSheet.sizeOfSprite,
        )
      }
    }
  }

  public set worldmap(worldMap: WorldMap) {
    this._worldMap = worldMap;
    const tilesShallowCopy = [...worldMap.tiles.values()];

    // sort tiles by sum of components of pos.
    // it handle ordering in the painter algorithm
    tilesShallowCopy.sort((a,b) => {
      const xyCmp = (a.pos.x + a.pos.y) - (b.pos.x + b.pos.y);
      if (xyCmp === 0) {
        return a.pos.z - b.pos.z;
      }
      return xyCmp;
    })

    this._tiles = tilesShallowCopy;
    this._drawnTiles = this._tiles.map(tile => ({
      drawPos: this._getDrawPos(tile.pos),
      tile: tile
    }))
  }

  public get drawnTiles(): DrawnTile[] {
    return this._drawnTiles;
  }

  private _getDrawPos(pos: Vec3D) {
    return new Vec2D(
      (pos.x-pos.y)*(SPRITE_SIZE.x/2),
      (pos.x+pos.y)*(SPRITE_SIZE.y/2) - (pos.z*TILE_LEVEL_SIZE)
    )
  }
}

