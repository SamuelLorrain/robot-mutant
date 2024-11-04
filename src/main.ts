import "./style.css";
import Context2DProvider from '@/ui/infra/Context2DProvider';
import CanvasChangeSizeObserver from "@/ui/infra/CanvasChangeSizeObserver";
import Mouse from "@/ui/infra/Mouse";
import { Vec2D } from "@/common/Vec2D";


import CanvasPanningListener from "./ui/infra/CanvasPanningListener";
import ScaleProvider from "./ui/domain/ScaleProvider";
import getMap from "./level";
import { WorldMap } from "./game/WorldMap";
import { TILE_SIZE } from "./globals";

let origin = new Vec2D();

function drawMap(ctx: Context2DProvider, origin: Vec2D, map: WorldMap) {
  for (let tile of map.tiles) {
    if (tile.spriteNb < 0) {
      continue;
    }
    const drawPos = tile.drawPos.add(origin);
    ctx.drawImage(
      tile.spriteSheet.picture,
      tile.spriteSheet.getSprite(tile.spriteNb).position,
      tile.spriteSheet.getSprite(tile.spriteNb).size,
      new Vec2D(
        Math.round(drawPos.x),
        Math.round(drawPos.y)
      ),
      tile.spriteSheet.getSprite(tile.spriteNb).size
    )
  }
}

window.addEventListener('load', async () => {
  const scaleProvider = new ScaleProvider(1);
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

  const map = await getMap();

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

    drawMap(context2dProvider, origin, map);
    requestAnimationFrame(render);
  }

  render();
});
