import "./style.css";
import Context2DProvider from '@/ui/infra/Context2DProvider';
import CanvasChangeSizeObserver from "@/ui/infra/CanvasChangeSizeObserver";
import Mouse from "@/ui/infra/Mouse";
import ImageData from "@/ui/infra/ImageData";
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
let scale = 1;

const pointerTile = new ImageData(selection);
const playerPositionTile = new ImageData(blue);
const whiteTile = new ImageData(white);
const whiteSelectionTile = new ImageData(whiteSelection);

function drawTile(ctx: CanvasRenderingContext2D, tile: ImageData, x: number, y: number, alpha: number = 1) {
  const drawX = origin.x + (x-y)*(TILE_SIZE.x/2);
  const drawY = origin.y + (x+y)*(TILE_SIZE.y/2);
  const previousAlpha = ctx.globalAlpha;
  ctx.globalAlpha = alpha;
  ctx.drawImage(tile.imageData, drawX, drawY);
  ctx.globalAlpha = previousAlpha;
}


function drawGrid(ctx: CanvasRenderingContext2D, grid: Int32Array, tiles: ImageData[], mouseCellSelected: Vec2D) {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      drawTile(ctx, tiles[grid[10*j + i]], i, j);

      if (i == player.x && j == player.y) {
        drawTile(ctx, playerPositionTile, i, j);
      }

      if (i == mouseCellSelected.x && j == mouseCellSelected.y) {
        drawTile(ctx, whiteTile, i, j, 0.7);
      }
    }
  }
}

window.addEventListener('load', () => {
  const context2dProvider = Context2DProvider.getInstance();
  const cursor = Mouse.getInstance();
  const ctx = context2dProvider.ctx;
  const changeSizeObserver = new CanvasChangeSizeObserver();
  const panningListener = new CanvasPanningListener(context2dProvider.canvas);
  changeSizeObserver.setMouse(cursor);
  changeSizeObserver.observe(context2dProvider.canvas);

  context2dProvider.canvas.style.scale = scale.toString();
  panningListener.scale = scale;
  cursor.scale = scale;

  const tiles: ImageData[] = [];
  tiles.push(new ImageData(green));

  const grid = new Int32Array(10*10);

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
      TILE_SIZE.x * 5 + panningListener.drag.x,
      TILE_SIZE.y * 5 + panningListener.drag.y
    );

    const vMouse = {
      x: cursor.x - (5 * TILE_SIZE.x + panningListener.drag.x),
      y: cursor.y - (5 * TILE_SIZE.y + panningListener.drag.y)
    } as Vec2D;
    const vSelected = {
      x: Math.floor((vMouse.x + 2 * vMouse.y - Math.floor( TILE_SIZE.x / 2 )) / TILE_SIZE.x),
      y: Math.floor(( -vMouse.x + 2 * vMouse.y + Math.floor( TILE_SIZE.x / 2 )) / TILE_SIZE.x)
    } as Vec2D;

    drawGrid(ctx, grid, tiles, vSelected);

    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.moveTo(cursor.x, 0);
    ctx.lineTo(cursor.x, cursor.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = "blue";
    ctx.moveTo(0, cursor.y);
    ctx.lineTo(cursor.x, cursor.y);
    ctx.stroke();

    requestAnimationFrame(render);
  }

  render();
});


