import { Vec2D } from "@/common/Vec2D";
import { SpriteSheet } from "./SpriteSheet";
import { WorldMapException } from "./exceptions";
import { Vec3D } from "@/common/Vec3D";
import { TILE_LEVEL_SIZE, TILE_SIZE } from "@/globals";
import { Tile, StaticTile } from "@/game/Tile";
import { AnimatedTile, AnimationTileTimelineFrame } from "@/game/AnimatedTile";

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

  public buildFromArray(tilesArray: (number|AnimationTileTimelineFrame[])[][]) {
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
    const tiles: Tile[][] = [];
    const animatedTiles: AnimatedTile[] = [];
    const mapSize = this._mapSize as Vec2D;

    for (let i = 0; i < mapSize.y; i++) {
      for (let j = 0; j < mapSize.x; j++) {
        const tileLevels = tilesArray[mapSize.x*j+i];
        tiles.push([]);
        for (let k = 0; k < tileLevels.length; k++) {
          const tileInformations = tilesArray[mapSize.x*j+i][k];
          const pos = new Vec3D(i,j,k);

          if (typeof tileInformations == 'number') {
            tiles[tiles.length-1].push(new StaticTile(
              pos,
              this._getDrawPos(pos),
              this._spriteSheet as SpriteSheet,
              tileInformations
            ))
          } else if (tileInformations instanceof Array) {
            const newAnimatedTile = new AnimatedTile(
              pos,
              this._getDrawPos(pos),
              this._spriteSheet as SpriteSheet,
              tileInformations
            );
            tiles[tiles.length-1].push(newAnimatedTile);
            animatedTiles.push(newAnimatedTile);
          }

        }
      }
    }

    return new WorldMap(tiles, mapSize, animatedTiles);
  }

  private _getDrawPos(pos: Vec3D) {
    return new Vec2D(
      (pos.x-pos.y)*(TILE_SIZE.x/2),
      (pos.x+pos.y)*(TILE_SIZE.y/2) - (pos.z*TILE_LEVEL_SIZE)
    )
  }
}

export class WorldMap {
  private _tiles: Tile[][]

  /*
   * Point directly to animated tiles
   * Those tiles should also be referenced in
   * the _tiles member. It's just here
   * to have convenient reference to animatedTiles
   * to update them in the `update()` method.
   */
  private _animatedTiles: AnimatedTile[];

  private _mapSize: Vec2D;

  constructor(tiles: Tile[][], mapSize: Vec2D, animatedTiles: AnimatedTile[]) {
    this._tiles = tiles;
    this._mapSize = mapSize;
    this._animatedTiles = animatedTiles;
  }

  public get tiles() {
    return this._tiles;
  }

  public tile(pos: Vec3D) {
    return this.tiles[this.mapSize.y*pos.y+pos.x][pos.z]
  }

  public get mapSize() {
    return new Vec2D(this._mapSize);
  }

  public update(delta: DOMHighResTimeStamp) {
    for (let tile of this._animatedTiles) {
      tile.updateTimeline(delta);
    }
  }
}
