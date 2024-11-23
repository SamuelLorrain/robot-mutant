import { Vec2D } from "@/common/Vec2D";
import Mouse from "@/ui/infra/Mouse";
import { WorldMap } from "./WorldMap";
import { Tile } from "./Tile";
import Context2DProvider from "@/ui/infra/Context2DProvider";

export class Selector {
  private _mouse: Mouse;
  private _hoverTile?: Tile;
  private _cursorPositionOnMouseDown?: Vec2D;
  private _context2dProvider: Context2DProvider;

  constructor (
    mouse: Mouse,
    context2DProvider: Context2DProvider,
    onClick: (e: MouseEvent) => void
  ) {
    this._mouse = mouse;
    this._hoverTile = undefined;
    this._cursorPositionOnMouseDown = undefined;
    this._context2dProvider = context2DProvider;
    this._initMouseDown();
    this._initMouseUp(onClick);
  }

  private _initMouseDown() {
    this._context2dProvider.canvas.addEventListener('mousedown', (e: MouseEvent) => {
      this._cursorPositionOnMouseDown = new Vec2D(e.clientX, e.clientY);
    });
  }

  private _initMouseUp(f: (e: MouseEvent) => void) {
    this._context2dProvider.canvas.addEventListener('mousedown', (e: MouseEvent) => {
      const cursorPositionOnMouseUp = new Vec2D(e.clientX, e.clientY);
      if (this._cursorPositionOnMouseDown == null || !this._cursorPositionOnMouseDown.almostEq(cursorPositionOnMouseUp, 3)) {
        return;
      }
      f(e);
    });
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
