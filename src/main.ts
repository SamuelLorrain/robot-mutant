import "./style.css";
import Context2DProvider from '@/ui/infra/Context2DProvider';
import CanvasChangeSizeObserver from "@/ui/infra/CanvasChangeSizeObserver";
import Mouse from "@/ui/infra/Mouse";
import Picture from "@/ui/infra/Picture";
import { Vec2D } from "@/common/Vec2D";

import green from "@/assets/tiles/green.png";
import white from "@/assets/tiles/white.png";

import CanvasPanningListener from "./ui/infra/CanvasPanningListener";
import ScaleProvider from "./ui/domain/ScaleProvider";

const TILE_SIZE = new Vec2D(32, 16);
let origin = new Vec2D();
let scaleProvider = new ScaleProvider(1);
let mapSize = new Vec2D(10,10);

let whiteTile: Picture;

function drawTile(ctx: CanvasRenderingContext2D, tile: Picture, x: number, y: number, alpha: number = 1) {
  const drawX = origin.x + (x-y)*(TILE_SIZE.x/2);
  const drawY = origin.y + (x+y)*(TILE_SIZE.y/2);
  const previousAlpha = ctx.globalAlpha;
  ctx.globalAlpha = alpha;
  ctx.drawImage(tile.bitmap, drawX, drawY);
  ctx.globalAlpha = previousAlpha;
}


function drawGrid(ctx: CanvasRenderingContext2D, grid: Int32Array, tiles: Picture[], mouseCellSelected: Vec2D) {
  for (let i = 0; i < mapSize.x; i++) {
    for (let j = 0; j < mapSize.y; j++) {
      drawTile(ctx, tiles[grid[10*j + i]], i, j);

      if (i == mouseCellSelected.x && j == mouseCellSelected.y) {
        drawTile(ctx, whiteTile, i, j, 0.7);
      }
    }
  }
}

window.addEventListener('load', async () => {
  const context2dProvider = Context2DProvider.getInstance();
  const cursor = Mouse.getInstance();
  const ctx = context2dProvider.ctx;
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

  const tiles: Picture[] = [];
  tiles.push(await Picture.createFromUri(green));

  const grid = new Int32Array(mapSize.x*mapSize.y);

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

    drawGrid(ctx, grid, tiles, vSelected);

    requestAnimationFrame(render);
  }

  render();
});
