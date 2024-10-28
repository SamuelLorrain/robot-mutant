import "./style.css";
import Context2DProvider from '@/ui/infra/Context2DProvider';
import CanvasChangeSizeObserver from "@/ui/infra/CanvasChangeSizeObserver";
import Mouse from "@/ui/infra/Mouse";
import Picture from "@/ui/infra/Picture";
import { Vec2D } from "@/common/Vec2D";

import green from "@/assets/tiles/green.png";
import blue from "@/assets/tiles/blue.png";
import white from "@/assets/tiles/white.png";
import whiteSelection from "@/assets/tiles/white-selection.png";
import selection from "@/assets/tiles/selection.png";
import CanvasPanningListener from "./ui/infra/CanvasPanningListener";

const TILE_SIZE = new Vec2D(32, 16);
let origin = new Vec2D();
let player = new Vec2D(0, 5);
let scale = 5;
let mapSize = new Vec2D(10,10);

const whiteTile = await Picture.createFromUri(white);

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
  const changeSizeObserver = new CanvasChangeSizeObserver();
  const panningListener = new CanvasPanningListener(context2dProvider.canvas, new Vec2D(1500, 700));
  changeSizeObserver.setMouse(cursor);
  changeSizeObserver.observe(context2dProvider.canvas);

  context2dProvider.canvas.style.scale = scale.toString();
  panningListener.scale = scale;
  cursor.scale = scale;

  const tiles: Picture[] = [];
  tiles.push(await Picture.createFromUri(green));

  const grid = new Int32Array(mapSize.x*mapSize.y);

  context2dProvider.canvas.addEventListener('wheel', (e: WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (Math.abs(e.deltaY) < 1) {
      return;
    }

    const direction = e.deltaY < 0 ? 1 : -1;
    const newScale = scale + direction;
    if (newScale < 1) {
      scale = 1
    } else if (newScale > 6) {
      scale = 6
    } else {
      scale = newScale;
    }

    context2dProvider.canvas.style.scale = scale.toString();
    panningListener.scale = scale;
    cursor.scale = scale;
  }, { passive: false});

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


