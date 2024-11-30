import { Vec2D } from "@/common/Vec2D";
import Mouse from "@/ui/Mouse";
import Context2DProvider from "@/ui/Context2DProvider";
import { DrawnTile, Renderer } from "./Renderer";
import { Vec3D } from "@/common/Vec3D";
import { Queue } from "@/common/Queue";
import { GameState } from "./GameState";
import { WorldMap } from "./WorldMap";

export interface ClickEvent {
  tilePos?: Vec3D;
  pixel?: Vec2D;
  kind: string;
};

export interface ClickTileEvent extends ClickEvent {
  tilePos: Vec3D;
  pixel: Vec2D;
  kind: "ClickTileEvent";
};

export interface ClickPixelEvent extends ClickEvent {
  pixel: Vec2D;
  kind: "ClickPixelEvent";
};

export const isClickTileEvent = (clickEvent: ClickEvent): clickEvent is ClickTileEvent => {
  return clickEvent.tilePos instanceof Vec3D;
}

export const isClickPixelEvent = (clickEvent: ClickEvent): clickEvent is ClickPixelEvent => {
  return clickEvent.tilePos == null;
}

export class Selector {
  private _mouse: Mouse;
  private _hoverTile?: DrawnTile;
  private _cursorPositionOnMouseDown?: Vec2D;
  private _context2DProvider: Context2DProvider;
  private _renderer: Renderer;
  private _clickEventQueue: Queue<ClickEvent>;

  constructor (renderer: Renderer) {
    this._mouse = Mouse.getInstance();
    this._context2DProvider = Context2DProvider.getInstance();
    this._hoverTile = undefined;
    this._cursorPositionOnMouseDown = undefined;
    this._renderer = renderer;
    this._clickEventQueue = new Queue();
    this._initMouseDown();
    this._initMouseUp();
  }

  private _initMouseDown() {
    this._context2DProvider.canvas.addEventListener('mousedown', (e: MouseEvent) => {
      this._cursorPositionOnMouseDown = new Vec2D(e.clientX, e.clientY);
    });
  }

  private _initMouseUp() {
    this._context2DProvider.canvas.addEventListener('mouseup', (e: MouseEvent) => {
      const cursorPositionOnMouseUp = new Vec2D(e.clientX, e.clientY);
      if (this._cursorPositionOnMouseDown == null || !this._cursorPositionOnMouseDown.almostEq(cursorPositionOnMouseUp, 3)) {
        return;
      }
      if (this._hoverTile != null) {
        const event = {
          tilePos: this._hoverTile.tile.pos,
          pixel: cursorPositionOnMouseUp,
          kind: "ClickTileEvent"
        } satisfies ClickTileEvent;
        this._clickEventQueue.enqueue(event);
      } else {
        const event = {
          pixel: cursorPositionOnMouseUp,
          kind: "ClickPixelEvent"
        } satisfies ClickPixelEvent;
        this._clickEventQueue.enqueue(event);
      }
    });
  }

  public get hoverTile() {
    return this._hoverTile;
  }

  public hasPendingEvent() {
    return !this._clickEventQueue.empty();
  }

  public getEvent() {
    return this._clickEventQueue.dequeue();
  }

  public handleClickEvents(gameState: GameState, worldMap: WorldMap) {
    while (this.hasPendingEvent()) {
      const event: ClickEvent = this.getEvent();
      gameState.handleEvent(
        event,
        worldMap
      );
    }
  }

  public updateHoverTile() {
    let mousePos = this._mouse.pos;
    const firstPassHoverTiles = [];
    if (this._renderer.drawnTiles.length === 0) {
      return;
    }
    for (let dTile of this._renderer.drawnTiles) {

      const spriteSheet = dTile.tile.sprite.spriteSheet;
      const realDrawPos = dTile.drawPos.add(this._context2DProvider.origin);

      /* Optimisation.
        * Only verify pixels on "almost certains" tiles.
        * TODO verify if the optimisation worth.
        */
      if ((realDrawPos.x < mousePos.x && (realDrawPos.x + spriteSheet.sizeOfSprite.x) >= mousePos.x)
        &&
        (realDrawPos.y < mousePos.y && (realDrawPos.y + spriteSheet.sizeOfSprite.y) >= mousePos.y)) {
        firstPassHoverTiles.push(dTile);
      }
    }
    const secondPassHoverTiles: DrawnTile[] = [];

    mousePos = this._mouse.pos.sub(this._context2DProvider.origin);
    mousePos.set(
      Math.round(mousePos.x),
      Math.round(mousePos.y),
    )

    for (let dTile of firstPassHoverTiles.reverse()) {
      const spriteSheet = dTile.tile.sprite.spriteSheet;
      const spritePosition = spriteSheet.getSpritePosition(dTile.tile.sprite.spriteNb);
      const spriteSheetImageData = spriteSheet.picture.imageData;

      const y = spritePosition.y;
      const x = spritePosition.x;
      const width = spriteSheetImageData.width;

      const drawPos = dTile.drawPos;
      const hoverPixelPosOnATile = mousePos.sub(drawPos);
      if ((hoverPixelPosOnATile.x >= spriteSheet.sizeOfSprite.x)
        || (hoverPixelPosOnATile.y >= spriteSheet.sizeOfSprite.y)) {
        continue;
      }
      const pixelRGBAPosition = (width*(y+hoverPixelPosOnATile.y)+(x+hoverPixelPosOnATile.x))*4;

      if (spriteSheetImageData.data[pixelRGBAPosition+3] > 0) {
        secondPassHoverTiles.push(dTile);
        break;
      }
    }

    this._hoverTile = secondPassHoverTiles[0];
  }
}
