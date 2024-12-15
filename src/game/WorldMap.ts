import { Hash } from "@/common/Hash";
import { Vec3D } from "@/common/Vec3D";
import { Tile } from "@/game/Tile";
import { Vec2D } from "@/common/Vec2D";
import { Character } from "./Character";
import { Sprite } from "@/ui/Sprite";
import { Graph } from "@/common/Graph";

export class WorldMap {
  private _tiles: Map<Hash, Tile>;
  private _2DTiles: Map<Hash, Tile>;
  private _hoverTile?: Tile;
  private _tileInformationsSprite: Sprite;
  private _pathSprite: Sprite;

  private _characters: Character[];

  private _tilesInformations: Map<Hash, Tile>;
  private _currentPath: Map<Hash, Tile>;
  private _graph?: Graph;

  constructor(
    tiles: Map<Hash, Tile>,
    tileInformationsSprite: Sprite,
    pathSprite: Sprite
  ) {
    this._tiles = tiles;
    this._2DTiles = new Map();
    this._hoverTile = undefined;
    this._characters = [];
    this._tilesInformations = new Map<Hash, Tile>;
    this._tileInformationsSprite = tileInformationsSprite;
    this._currentPath = new Map<Hash, Tile>;
    this._pathSprite = pathSprite;
    this._graph = undefined;
    this._update2DTiles();
  }

  public get tileInformationsSprite() {
    return this._tileInformationsSprite;
  }

  public get pathSprite() {
    return this._pathSprite;
  }

  public update(hoverTilePosition: Vec3D|undefined, dt: DOMHighResTimeStamp) {
    this.updateCharacters(dt);
    if (hoverTilePosition == null) {
      this._hoverTile = undefined;
      return;
    }
    const hoverTile = this.tiles.get(hoverTilePosition.hash());
    if (hoverTile == null) {
      this._hoverTile = undefined;
      return;
    }

    const hoverTile2D = this._2DTiles.get(
      new Vec2D(hoverTile.pos.x, hoverTile.pos.y).hash()
    )
    this._hoverTile = hoverTile2D;
  }

  private updateCharacters(dt: DOMHighResTimeStamp) {
    for (const character of this._characters) {
      character.update(dt);
    }
  }

  public get hoverTile() {
    return this._hoverTile;
  }

  public get tiles() {
    return this._tiles;
  }

  public tile(pos: Vec3D) {
    return this.tiles.get(pos.hash());
  }

  public get tiles2D() {
    return this._2DTiles;
  }

  public set characters(characters: Character[]) {
    this._characters = characters;
  }

  public get characters(): Character[] {
    return this._characters;
  }

  public set tilesInformations(tilesInformations: Tile[]) {
    this._tilesInformations = new Map();
    for(const tile of tilesInformations) {
      this._tilesInformations.set(tile.pos.hash(), tile);
    }
  }

  public get tilesInformations(): Map<Hash, Tile> {
    return this._tilesInformations;
  }

  public set currentPath(currentPath: Tile[]) {
    this._currentPath = new Map();
    for(const tile of currentPath) {
      this._currentPath.set(tile.pos.hash(), tile);
    }
  }

  public get currentPath(): Map<Hash, Tile> {
    return this._currentPath;
  }

  public get graph() {
    return this._graph;
  }

  private _update2DTiles() {
    for(let tile of this._tiles.values()) {
      const vec2D = new Vec2D(tile.pos.x, tile.pos.y);
      const existingTile = this._2DTiles.get(vec2D.hash());
      if (existingTile && existingTile.pos.z > tile.pos.z) {
        continue;
      }
      this._2DTiles.set(vec2D.hash(), tile);
    }
  }

  public computeTilesInformations(origin: Vec3D, range: number) {
    const currentTilesInformations = []
    for (const [_,tile] of this._2DTiles) {
      const manhattanDistance =
          Math.abs(tile.pos.x - origin.x) + Math.abs(tile.pos.y - origin.y);
      if (manhattanDistance <= range) {
        currentTilesInformations.push(new Tile(tile.pos, this.tileInformationsSprite))
      }
    }
    this.tilesInformations = currentTilesInformations;
  }
}
