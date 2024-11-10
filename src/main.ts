import "./style.css";
import Context2DProvider from '@/ui/infra/Context2DProvider';
import CanvasChangeSizeObserver from "@/ui/infra/CanvasChangeSizeObserver";
import Mouse from "@/ui/infra/Mouse";
import { Vec2D } from "@/common/Vec2D";
import CanvasPanningListener from "./ui/infra/CanvasPanningListener";
import ScaleProvider from "./ui/domain/ScaleProvider";
import getMap, { getCursors } from "./level";
import { WorldMap } from "./game/WorldMap";
import { Tile } from "./game/Tile";
import { SpriteSheet } from "./game/SpriteSheet";
import { AutonomousTimer } from "./common/Timer";
import { TICKS_PER_FRAME } from "./globals";

let origin = new Vec2D();

function getSelectedTiles(origin: Vec2D, map: WorldMap, cursor: Vec2D): Tile[] {
  const firstPassSelectedTiles: Tile[] = [];
  for (let tile of map.tiles) {
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
  return secondPassSelectedTiles;
}

function drawMap(ctx: Context2DProvider, origin: Vec2D, map: WorldMap, selectedTiles: Tile[], cursors: SpriteSheet) {
  for (let tile of map.tiles) {
    if (tile.spriteNb < 0) {
      continue;
    }
    const pos = tile.position;
    const drawPos = tile.drawPos.add(origin);
    let isSelected = false;
    for(let selectedTile of selectedTiles) {
      if (selectedTile.position.eq(pos)) {
        isSelected = true;
      }
    }
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
    if (isSelected) {
      ctx.drawImage(
        cursors.picture,
        cursors.getSprite(0).position,
        cursors.getSprite(0).size,
        new Vec2D(
          Math.round(drawPos.x),
          Math.round(drawPos.y)
        ),
        cursors.getSprite(tile.spriteNb).size
      )
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

  const map = await getMap();
  const cursors = await getCursors();

  const capTimer = new AutonomousTimer();
  capTimer.start();

  let lastTime = 0;
  let countedFrames = 0;
  let accumulatedDt = 0;

  const gameLoop = () => {
    const now = capTimer.getTicks();
    const millisecondsDt = now - lastTime;
    lastTime = now;
    accumulatedDt += millisecondsDt;

    context2dProvider.updateCanvasSize(
      changeSizeObserver.width,
      changeSizeObserver.height
    );
    origin.set(
      panningListener.drag.x,
      panningListener.drag.y
    );

    const selectedTiles = getSelectedTiles(origin, map, cursor.vec);

    if (accumulatedDt >= TICKS_PER_FRAME) {
      // new draw if we are not capping fps
      context2dProvider.paintBackground();
      drawMap(context2dProvider, origin, map, selectedTiles, cursors);
      accumulatedDt = 0;
    }

    countedFrames++;
    requestAnimationFrame(gameLoop);
  }

  gameLoop();
});
