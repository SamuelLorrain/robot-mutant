import { Vec2D } from "@/common/Vec2D";
import Mouse from "@/ui/infra/Mouse";
import { WorldMap } from "./WorldMap";
import { Tile } from "./Tile";

export class Selector {
  private _mouse: Mouse;
  private _selectedTiles: Tile[];

  constructor (mouse: Mouse) {
    this._mouse = mouse;
    this._selectedTiles = [];
  }

  public get selectedTiles() {
    return this._selectedTiles;
  }

  updateSelectedTiles(origin: Vec2D, map: WorldMap) {
    const cursor = this._mouse.vec;
    const firstPassSelectedTiles: Tile[] = [];
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
          firstPassSelectedTiles.push(tile);
        }
      }
    }

    const secondPassSelectedTiles: Tile[] = [];
    const mousePos = cursor.sub(origin);
    mousePos.set(
      Math.round(mousePos.x),
      Math.round(mousePos.y),
    )
    for (let tile of firstPassSelectedTiles.reverse()) {
      const spritePosition = tile.spriteSheet.getSprite(tile.spriteNb);
      const spriteSheetImageData = tile.spriteSheet.picture.imageData;

      const y = spritePosition.position.y;
      const x = spritePosition.position.x;
      const width = spriteSheetImageData.width;

      const drawPos = tile.drawPos;
      const selectedPixelPosOnATile = mousePos.sub(drawPos);
      if ((selectedPixelPosOnATile.x >= spritePosition.size.x)
        || (selectedPixelPosOnATile.y >= spritePosition.size.y)) {
        continue;
      }
      const pixelRGBAPosition = (width*(y+selectedPixelPosOnATile.y)+(x+selectedPixelPosOnATile.x))*4;

      if (spriteSheetImageData.data[pixelRGBAPosition+3] > 0) {
        secondPassSelectedTiles.push(tile);
        break;
      }
    }
    const selectedTile = secondPassSelectedTiles[0];
    if (selectedTile?.blocked) {
      return this._selectedTiles = [];
    }
    this._selectedTiles = secondPassSelectedTiles;
  }

}
