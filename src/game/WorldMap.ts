import { Vec2D } from "@/common/Vec2D";
import { SpriteSheet } from "./SpriteSheet";
import { WorldMapException } from "./exceptions";
import { Vec3D } from "@/common/Vec3D";
import { TILE_LEVEL_SIZE, TILE_SIZE } from "@/globals";
import { Tile, StaticTile } from "@/game/Tile";

export class WorldMapBuilder {
  private _spriteSheet: SpriteSheet|undefined = undefined;
  private _mapSize: Vec2D|undefined = undefined;

  public setSpriteSheet(spriteSheet: SpriteSheet) {
    this._spriteSheet = spriteSheet;
    return this;
  }

  public setMapSize(mapSize: Vec2D) {
    this._mapSize = mapSize;
    return this;
  }

  public buildFromArray(tilesArray: number[][]) {
    if (this._spriteSheet == null) {
      throw new WorldMapException("Unable to build world map, spriteSheet is not set");
    }
    if (this._mapSize == null) {
      throw new WorldMapException("Unable to build world map, mapSize is not set");
    }
    if (
      tilesArray.length != this._mapSize.x*this._mapSize.y
    ) {
      throw new WorldMapException(`Unable to build world map,
tilesArray length (${tilesArray.length})
not equal to mapSize (${this._mapSize.x*this._mapSize.y})`);
    }
    const tiles: Tile[] = [];
    const mapSize = this._mapSize as Vec2D;

    for (let i = 0; i < mapSize.x; i++) {
      for (let j = 0; j < mapSize.y; j++) {
        const tower = tilesArray[mapSize.x*j+i];
        for (let k = 0; k < tower.length; k++) {
          const pos = new Vec3D(i,j,k);
          tiles.push(new StaticTile(
            pos,
            this._getDrawPos(pos),
            this._spriteSheet as SpriteSheet,
            tilesArray[mapSize.x*j+i][k]
          ))
        }
      }
    }

    return new WorldMap(tiles, mapSize);
  }

  private _getDrawPos(pos: Vec3D) {
    return new Vec2D(
      (pos.x-pos.y)*(TILE_SIZE.x/2),
      (pos.x+pos.y)*(TILE_SIZE.y/2) - (pos.z*TILE_LEVEL_SIZE)
    )
  }
}

export class WorldMap {
  private _tiles: Tile[]
  private _mapSize: Vec2D;

  constructor(tiles: Tile[], mapSize: Vec2D) {
    this._tiles = tiles;
    this._mapSize = mapSize;
  }

  public get tiles() {
    return this._tiles;
  }

  public get mapSize() {
    return new Vec2D(this._mapSize);
  }
}
