import { Vec2D } from "@/common/Vec2D";
import { SpriteSheet } from "./SpriteSheet";
import { WorldMapException } from "./exceptions";
import { Vec3D } from "@/common/Vec3D";
import { TILE_LEVEL_SIZE, TILE_SIZE } from "@/globals";
import { Tile, StaticTile } from "@/game/Tile";
import { AnimatedTile, AnimationTileTimelineFrame } from "@/game/AnimatedTile";
import { Graph } from "@/common/Graph";
import { Hash } from "@/common/Hash";

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
        const tileLevels = tilesArray[mapSize.x*i+j];
        tiles.push([]);
        for (let k = 0; k < tileLevels.length; k++) {
          const tileInformations = tilesArray[mapSize.x*i+j][k];
          const pos = new Vec3D(j,i,k);

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

    return new WorldMap(
      tiles,
      mapSize,
      animatedTiles,
    );
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

  /**
  * Set of locked tiles in the map
  */
  private _lockedTilesPos2D: Set<Hash> = new Set();

  private _mapSize: Vec2D;


  constructor(
    tiles: Tile[][],
    mapSize: Vec2D,
    animatedTiles: AnimatedTile[]
  ) {
    this._tiles = tiles;
    this._mapSize = mapSize;
    this._animatedTiles = animatedTiles;
    this.computeLockedTilesPos2D();
  }

  public get tiles() {
    return this._tiles;
  }

  public get lockedTilesPos2D(): Set<Hash> {
    return this._lockedTilesPos2D;
  }

  public tile(pos: Vec3D) {
    return this.tiles[this._mapSize.x*pos.y+pos.x][pos.z];
  }

  public tileTower(pos: Vec2D) {
    return this.tiles[this._mapSize.x*pos.y+pos.x];
  }

  public tileTopTower(pos: Vec2D) {
    const tower = this.tiles[this._mapSize.x*pos.y+pos.x];
    const towerLength = tower.length;
    return tower[towerLength-1];
  }

  public get mapSize() {
    return new Vec2D(this._mapSize);
  }

  public update(delta: DOMHighResTimeStamp) {
    for (let tile of this._animatedTiles) {
      tile.updateTimeline(delta);
    }
  }

  private _isGraphNeighbour(vec: Vec2D): boolean {
    const tile = this.tileTopTower(vec);
    if (tile == null) {
      return false;
    }
    if (tile.spriteNb === -1) {
      return false;
    }
    if (tile.spriteSheet.getSprite(tile.spriteNb).blocked) {
      return false;
    }
    return true;
  }

  public toGraph(): Graph {
    const map = new Map<Hash, Hash[]>();

    for (let i = 0; i < this._mapSize.y; i++) {
      for (let j = 0; j <  this._mapSize.x; j++) {
        const vec = new Vec2D(i, j);

        const neighbours: Hash[] = [];
        const n1 = new Vec2D(vec.x+1, vec.y);
        const n2 = new Vec2D(vec.x-1, vec.y);
        const n3 = new Vec2D(vec.x, vec.y+1);
        const n4 = new Vec2D(vec.x, vec.y-1);

        if (n1.x < this._mapSize.x) {
          if (this._isGraphNeighbour(n1)) {
            neighbours.push(n1.hash());
          }
        }
        if (n2.x >= 0) {
          if (this._isGraphNeighbour(n2)) {
            neighbours.push(n2.hash());
          }
        }
        if (n3.y < this._mapSize.y) {
          if (this._isGraphNeighbour(n3)) {
            neighbours.push(n3.hash());
          }
        }
        if (n4.y >= 0) {
          if (this._isGraphNeighbour(n4)) {
            neighbours.push(n4.hash());
          }
        }

        map.set(vec.hash(), neighbours);
      }
    }

    const graph = new Graph(map);
    return graph;
  }

  public computeLockedTilesPos2D() {
    for (let i = 0; i < this._mapSize.y; i++) {
      for (let j = 0; j <  this._mapSize.x; j++) {
        const vec = new Vec2D(i, j);
        const tileTower = this.tileTower(vec);
        for(const tile of tileTower) {
          if (tile.blocked) {
            this._lockedTilesPos2D.add(vec.hash());
            continue;
          }
        }
      }
    }
  }
}
