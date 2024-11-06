import "./style.css";
import Context2DProvider from '@/ui/infra/Context2DProvider';
import CanvasChangeSizeObserver from "@/ui/infra/CanvasChangeSizeObserver";
import Mouse from "@/ui/infra/Mouse";
import { Vec2D } from "@/common/Vec2D";
import CanvasPanningListener from "./ui/infra/CanvasPanningListener";
import ScaleProvider from "./ui/domain/ScaleProvider";
import getMap from "./level";
import { Tile, WorldMap } from "./game/WorldMap";

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

function drawMap(ctx: Context2DProvider, origin: Vec2D, map: WorldMap, selectedTiles: Tile[]) {
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
    if (isSelected) {
      ctx.drawImage(
        tile.spriteSheet.picture,
        tile.spriteSheet.getSprite(16).position,
        tile.spriteSheet.getSprite(16).size,
        new Vec2D(
          Math.round(drawPos.x),
          Math.round(drawPos.y)
        ),
        tile.spriteSheet.getSprite(16).size
      )
    } else {
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

    const selectedTiles = getSelectedTiles(origin, map, cursor.vec);
    drawMap(context2dProvider, origin, map, selectedTiles);
    requestAnimationFrame(render);
  }

  render();
});
