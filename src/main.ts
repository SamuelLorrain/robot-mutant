import "./style.css";
import Context2DProvider from '@/ui/infra/Context2DProvider';
import CanvasChangeSizeObserver from "@/ui/infra/CanvasChangeSizeObserver";
import Mouse from "@/ui/infra/Mouse";
import { Vec2D } from "@/common/Vec2D";
import CanvasPanningListener from "./ui/infra/CanvasPanningListener";
import ScaleProvider from "./ui/domain/ScaleProvider";
import getMap, { getCursors, getRedCharacter } from "./level";
import { WorldMap } from "./game/WorldMap";
import { Tile } from "./game/Tile";
import { SpriteSheet } from "./game/SpriteSheet";
import { AutonomousTimer } from "./common/Timer";
import { TICKS_PER_FRAME } from "./globals";
import { Character } from "./game/Character";
import { Vec3D } from "./common/Vec3D";
import { CharacterBuilder } from "./game/CharacterBuilder";

let origin = new Vec2D();

function getSelectedTiles(origin: Vec2D, map: WorldMap, cursor: Vec2D): Tile[] {
  const firstPassSelectedTiles: Tile[] = [];
  for (let tileTower of map.tiles) {
    for (let tile of tileTower) {
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

function drawMap(
  ctx: Context2DProvider,
  origin: Vec2D,
  map: WorldMap,
  selectedTiles: Tile[],
  cursors: SpriteSheet,
  character: Character,
) {
  for (let tileTower of map.tiles) {
    for (let tile of tileTower) {
      if (tile.spriteNb < 0) {
        continue;
      }
      const pos = tile.position;
      const drawPos = tile.drawPos.add(origin);
      const roundedDrawpos = new Vec2D(
        Math.round(drawPos.x),
        Math.round(drawPos.y)
      )
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
        roundedDrawpos,
        tile.spriteSheet.getSprite(tile.spriteNb).size
      )
      if (isSelected) {
        ctx.drawImage(
          cursors.picture,
          cursors.getSprite(2).position,
          cursors.getSprite(2).size,
          roundedDrawpos,
          cursors.getSprite(tile.spriteNb).size
        )
      }
      if (character.pos.eq(tile.position)) {
        const characterDrawPos = character.drawPos.add(origin);
        const characterTile = character.tile;
        const characterSprite = characterTile.spriteSheet.getSprite(characterTile.spriteNb);
        ctx.drawImage(
          characterTile.spriteSheet.picture,
          characterSprite.position,
          characterSprite.size,
          new Vec2D(
            Math.round(characterDrawPos.x),
            Math.round(characterDrawPos.y)
          ),
          characterSprite.size,
        )
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

  const map = await getMap();
  const cursors = await getCursors();
  const redSpriteSheet = await getRedCharacter();
  const c = (new CharacterBuilder())
    .setSpriteSheet(redSpriteSheet)
    .build();

  c.pos = new Vec3D(1, 1, 1);
  const tileToMap = map.tile(c.pos);
  c.drawPos = tileToMap.drawPos;

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
    map.update(millisecondsDt);
    c.updateTimeline(millisecondsDt);

    if (accumulatedDt >= TICKS_PER_FRAME) {
      // new draw if we are not capping fps
      context2dProvider.paintBackground();
      drawMap(
        context2dProvider,
        origin,
        map,
        selectedTiles,
        cursors,
        c
      );
      accumulatedDt = 0;
    }

    countedFrames++;
    requestAnimationFrame(gameLoop);
  }

  gameLoop();
});
