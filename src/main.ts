import "./style.css";
import Context2DProvider from '@/ui/infra/Context2DProvider';
import CanvasChangeSizeObserver from "@/ui/infra/CanvasChangeSizeObserver";
import { StandaloneTile } from "@/ui/infra/StandaloneTile";
import grass from "@/assets/tiles/kenney/grass.png";
import sand from "@/assets/tiles/kenney/sand.png";
import { Vec2D } from "./common/Vec2D";

const TILE_SIZE = new Vec2D(100, 50);
let origin = new Vec2D();
let mouse = new Vec2D();
let pointerTile = new StandaloneTile(sand);

function drawTile(ctx: CanvasRenderingContext2D, tile: StandaloneTile, x: number, y: number) {
    const drawX = origin.x + (x-y)*(TILE_SIZE.x/2);
    const drawY = origin.y + (x+y)*(TILE_SIZE.y/2);
    ctx.drawImage(tile.imageData, drawX, drawY);
}

function drawGrid(ctx: CanvasRenderingContext2D, grid: Int32Array, tiles: StandaloneTile[], mouseCellSelected: Vec2D) {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (i == mouseCellSelected.x && j == mouseCellSelected.y) {
          drawTile(ctx, pointerTile, i, j);
        } else {
          drawTile(ctx, tiles[grid[9*j + i]], i, j);
        }
      }
    }
}

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX * window.devicePixelRatio;
  mouse.y = e.clientY * window.devicePixelRatio;
});

window.addEventListener('load', () => {
  const context2dProvider = Context2DProvider.getInstance();
  const ctx = context2dProvider.ctx;
  const changeSizeObserver = new CanvasChangeSizeObserver();
  changeSizeObserver.observe(context2dProvider.canvas);

  const tiles: StandaloneTile[] = [];
  tiles.push(new StandaloneTile(grass));

  const grid = new Int32Array(9*9); // everything initialised to 0

  const render = () => {

    context2dProvider.paintBackground();
    context2dProvider.updateCanvasSize(
      changeSizeObserver.width,
      changeSizeObserver.height
    );
    origin.set(TILE_SIZE.x * 5, TILE_SIZE.y * 5);

    const vMouse = {
      x: mouse.x - (5 * TILE_SIZE.x),
      y: mouse.y - (5 * TILE_SIZE.y)
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


