import { Vec2D } from "@/common/Vec2D";
import Mouse from "@/ui/infra/Mouse";
import { WorldMap } from "./WorldMap";
import { Tile } from "./Tile";

export class Selector {
  private _mouse: Mouse;
  private _hoverTile?: Tile;

  constructor (mouse: Mouse) {
    this._mouse = mouse;
    this._hoverTile = undefined;
  }

  public get hoverTile() {
    return this._hoverTile;
  }

  updateHoverTile(origin: Vec2D, map: WorldMap) {
    const cursor = this._mouse.vec;
    const firstPassHoverTiles: Tile[] = [];
    for (let tileTower of map.tiles) {
      for (let tile of tileTower) {
        if (tile.spriteNb < 0) {
          continue;
        }
        const drawPos = tile.drawPos.add(origin);

        /*
        * Optimisation.
        * Only verify pixels on "almost certains" tiles.
        * TODO verify if the optimisation worth.
        */
        if ((drawPos.x < cursor.x && (drawPos.x + tile.spriteSheet.size.x) >= cursor.x)
            &&
            (drawPos.y < cursor.y && (drawPos.y + tile.spriteSheet.size.y) >= cursor.y)) {
          firstPassHoverTiles.push(tile);
        }
      }
    }

    const secondPassHoverTiles: Tile[] = [];
    const mousePos = cursor.sub(origin);
    mousePos.set(
      Math.round(mousePos.x),
      Math.round(mousePos.y),
    )
    for (let tile of firstPassHoverTiles.reverse()) {
      const spritePosition = tile.spriteSheet.getSprite(tile.spriteNb);
      const spriteSheetImageData = tile.spriteSheet.picture.imageData;

      const y = spritePosition.position.y;
      const x = spritePosition.position.x;
      const width = spriteSheetImageData.width;

      const drawPos = tile.drawPos;
      const hoverPixelPosOnATile = mousePos.sub(drawPos);
      if ((hoverPixelPosOnATile.x >= spritePosition.size.x)
        || (hoverPixelPosOnATile.y >= spritePosition.size.y)) {
        continue;
      }
      const pixelRGBAPosition = (width*(y+hoverPixelPosOnATile.y)+(x+hoverPixelPosOnATile.x))*4;

      if (spriteSheetImageData.data[pixelRGBAPosition+3] > 0) {
        secondPassHoverTiles.push(tile);
        break;
      }
    }
    const hoverTile = secondPassHoverTiles[0];
    if (hoverTile?.blocked) {
      return this._hoverTile = undefined;
    }
    this._hoverTile = secondPassHoverTiles[0];
  }
}
