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

const TILE_SIZE = new Vec2D(32, 16);
let origin = new Vec2D();
let player = new Vec2D(0, 5);

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
  changeSizeObserver.observe(context2dProvider.canvas);

  const tiles: ImageData[] = [];
  tiles.push(new ImageData(green));

  const grid = new Int32Array(10*10);

  let dragging = false;
  let drag = new Vec2D(0,0);
  let dragstart = new Vec2D(0,0);
  let currentDragging = new Vec2D(0,0);

  const canvas = context2dProvider.canvas;

  canvas.addEventListener('mousedown', (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragging = true;
    currentDragging = new Vec2D(drag);
    dragstart.set(
      e.clientX * window.devicePixelRatio,
      e.clientY * window.devicePixelRatio
    )
  });

  canvas.addEventListener('mouseup', (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragging = false;
  });

  canvas.addEventListener('mousemove', (e: MouseEvent) => {
    if (!dragging) {
      return;
    }
    const currentPosition = new Vec2D(
      e.clientX * window.devicePixelRatio,
      e.clientY * window.devicePixelRatio
    )
    if (dragstart.almostEq(currentPosition, 2)) {
      return;
    }

    drag.set(new Vec2D(
      e.clientX * window.devicePixelRatio - dragstart.x + currentDragging.x,
      e.clientY * window.devicePixelRatio - dragstart.y + currentDragging.y
    ));

  });

  const render = () => {

    context2dProvider.paintBackground();
    context2dProvider.updateCanvasSize(
      changeSizeObserver.width,
      changeSizeObserver.height
    );
    origin.set(TILE_SIZE.x * 5 + drag.x, TILE_SIZE.y * 5 + drag.y);

    const vMouse = {
      x: cursor.x - (5 * TILE_SIZE.x + drag.x),
      y: cursor.y - (5 * TILE_SIZE.y + drag.y)
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


