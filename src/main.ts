import "./style.css";
import Context2DProvider from '@/ui/infra/Context2DProvider';
import CanvasChangeSizeObserver from "@/ui/infra/CanvasChangeSizeObserver";
import Mouse from "@/ui/infra/Mouse";
import Picture from "@/ui/infra/Picture";
import { Vec2D } from "@/common/Vec2D";

import debugSpritesheet from "@/assets/debug.png"

import CanvasPanningListener from "./ui/infra/CanvasPanningListener";
import ScaleProvider from "./ui/domain/ScaleProvider";
import { SpriteSheet, SpriteSheetBuilder } from "./game/SpriteSheet";
import grid from "./level";

const TILE_SIZE = new Vec2D(32, 16);
const TILE_LEVEL_SIZE = 8;
let origin = new Vec2D();
let mapSize = new Vec2D(10,10);
let nbLevels = 16;

function getCoordinateFromGrid(tile: Vec2D, nbLevel: number): Vec2D {
  const drawX = origin.x + (tile.x-tile.y)*(TILE_SIZE.x/2);
  const drawY = origin.y + (tile.x+tile.y)*(TILE_SIZE.y/2) - nbLevel*TILE_LEVEL_SIZE;
  return new Vec2D(
    drawX,
    drawY
  )
}

function drawSpriteToPosition(
  ctx: Context2DProvider,
  spriteSheet: SpriteSheet,
  spriteNb: number,
  positionX: number,
  positionY: number
) {
  const sprite = spriteSheet.getSprite(spriteNb);
  ctx.drawImage(
    spriteSheet.picture,
    new Vec2D(sprite.sX, sprite.sY),
    new Vec2D(spriteSheet.sizeSpriteX, spriteSheet.sizeSpriteY),
    new Vec2D(positionX, positionY),
    new Vec2D(spriteSheet.sizeSpriteX, spriteSheet.sizeSpriteY)
  )
}


function drawTileFromSpriteSheet(
  ctx: Context2DProvider,
  spriteSheet: SpriteSheet,
  spriteNb: number,
  x: number,
  y: number,
  z: number,
) {
  // Allow to skip levels
  if (spriteNb < 0) {
    return;
  }
  const coordinates = getCoordinateFromGrid(new Vec2D(x,y), z);
  drawSpriteToPosition(ctx, spriteSheet, spriteNb, coordinates.x, coordinates.y);
}

function drawGrid(
  ctx: Context2DProvider,
  spriteSheet: SpriteSheet,
  grid: number[][]
) {
  for (let i = 0; i < mapSize.x; i++) {
    for (let j = 0; j < mapSize.y; j++) {
      for (let k = 0; k < nbLevels; k++) {
        if (grid[mapSize.x*j+i].length >= k) {
          drawTileFromSpriteSheet(ctx, spriteSheet, grid[mapSize.x*j+i][k], i, j, k);
        }
      }
    }
  }
}

window.addEventListener('load', async () => {
  const scaleProvider = new ScaleProvider(3);
  const context2dProvider = Context2DProvider.getInstance();
  const cursor = Mouse.getInstance();
  const panningListener = new CanvasPanningListener(context2dProvider.canvas, new Vec2D(1500, 700));
  const changeSizeObserver = new CanvasChangeSizeObserver(
    context2dProvider.canvas,
    cursor,
    panningListener,
    scaleProvider
  );

  context2dProvider.canvas.style.scale = scaleProvider.scale.toString();
  panningListener.scale = scaleProvider.scale;
  cursor.scale = scaleProvider.scale;

  const spriteSheetData = await Picture.createFromUri(debugSpritesheet);
  const spriteSheetBuilder = new SpriteSheetBuilder();
  const spriteSheet = spriteSheetBuilder
    .setPicture(spriteSheetData)
    .setSizeSpriteX(32)
    .setSizeSpriteY(32)
    .setNbSpritesRow(4)
    .setNbSpritesColumn(4)
    .build()

  const render = () => {
    context2dProvider.paintBackground();
    context2dProvider.updateCanvasSize(
      changeSizeObserver.width,
      changeSizeObserver.height
    );
    origin.set(
      panningListener.drag.x,
      panningListener.drag.y
    );

    const vMouse = {
      x: cursor.x - panningListener.drag.x,
      y: cursor.y - panningListener.drag.y
    } as Vec2D;
    const vSelected = {
      x: Math.floor((vMouse.x + 2 * vMouse.y - Math.floor( TILE_SIZE.x / 2 )) / TILE_SIZE.x),
      y: Math.floor(( -vMouse.x + 2 * vMouse.y + Math.floor( TILE_SIZE.x / 2 )) / TILE_SIZE.x)
    } as Vec2D;

    drawGrid(context2dProvider, spriteSheet, grid);

    requestAnimationFrame(render);
  }

  render();
});
