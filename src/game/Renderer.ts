import Context2DProvider from "@/ui/Context2DProvider";
import { SPRITE_SIZE, TILE_LEVEL_SIZE } from "@/globals";
import { Vec2D } from "@/common/Vec2D";
import { Tile } from "./Tile";
import { WorldMap } from "./WorldMap";
import { Sprite } from "@/ui/Sprite";
import { GameState } from "./GameState";

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
  private _worldMap?: WorldMap;
  private _gameState: GameState;

  constructor(cursor: Sprite, gameState: GameState) {
    this._context2DProvider = Context2DProvider.getInstance();
    this._cursor = cursor;
    this._worldMap = undefined;
    this._gameState = gameState;
  }

  public cleanUp() {
    this._context2DProvider.paintBackground();
  }

  // Multiple "z-index line"
  // for each types of entity ?
  // Prend direct la worldmap en entrée ?
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
      this._drawTileInformations(dTile);
      this._drawHoverTile(dTile);
      this._drawCharacters(dTile);
    }
  }

  private _drawTileInformations(dTile: DrawnTile) {
    if (this._worldMap == null) {
      return;
    }
    const tile = this._worldMap.tilesInformations.get(dTile.tile.pos.hash());
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
    if (this._worldMap?.hoverTile?.pos.eq(dTile.tile.pos)) {
      this._context2DProvider.drawImage(
        this._cursor.spriteSheet.picture,
        this._cursor.spriteSheet.getSpritePosition(this._cursor.spriteNb),
        this._cursor.spriteSheet.sizeOfSprite,
        dTile.drawPos,
        this._cursor.spriteSheet.sizeOfSprite,
      )
    }
  }

  // TODO will not work when characters moves
  private _drawCharacters(dTile: DrawnTile) {
    if (this._worldMap == null) {
      return;
    }
    const character = this._worldMap.characters.get(dTile.tile.pos.hash());
    if (character != null) {
      const tile = character.tile;
      this._context2DProvider.drawImage(
        tile.sprite.spriteSheet.picture,
        tile.sprite.spriteSheet.getSpritePosition(tile.sprite.spriteNb),
        tile.sprite.spriteSheet.sizeOfSprite,
        dTile.drawPos,
        tile.sprite.spriteSheet.sizeOfSprite,
      )
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
      drawPos: this.getDrawPos(tile),
      tile: tile
    }))
  }

  public get drawnTiles(): DrawnTile[] {
    return this._drawnTiles;
  }

  private getDrawPos(tile: Tile) {
    return new Vec2D(
      (tile.pos.x-tile.pos.y)*(SPRITE_SIZE.x/2),
      (tile.pos.x+tile.pos.y)*(SPRITE_SIZE.y/2) - (tile.pos.z*TILE_LEVEL_SIZE)
    )
  }
}

