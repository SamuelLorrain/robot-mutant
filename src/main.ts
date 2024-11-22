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
import { TICKS_PER_FRAME, TILE_LEVEL_SIZE } from "./globals";
import { Character } from "./game/Character";
import { Vec3D } from "./common/Vec3D";
import { CharacterBuilder } from "./game/CharacterBuilder";
import { GameStateProvider } from "./game/GameStateProvider";
import { Hash } from "./common/Hash";
import { Selector } from "./game/Selector";

let origin = new Vec2D();

function drawMap(
  ctx: Context2DProvider,
  origin: Vec2D,
  map: WorldMap,
  selectedTiles: Tile[],
  cursors: SpriteSheet,
  character: Character,
  path: Set<Hash>,
  gameState: GameStateProvider,
  reachableTiles: Set<Hash>
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
      if (path.has(new Vec2D(pos.x, pos.y).hash())) {
        ctx.drawImage(
          cursors.picture,
          cursors.getSprite(4).position,
          cursors.getSprite(4).size,
          roundedDrawpos,
          cursors.getSprite(tile.spriteNb).size
        )
      }
      if (reachableTiles.has(new Vec2D(pos.x, pos.y).hash())) {
        ctx.drawImage(
          cursors.picture,
          cursors.getSprite(6).position,
          cursors.getSprite(6).size,
          roundedDrawpos,
          cursors.getSprite(tile.spriteNb).size
        )
      }
      if (
        character.pos.eq(tile.position) ||
        (
          character.target != null &&
            character.target.eq(tile.position)
        )
      ) {
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
        if (gameState.selectedCharacter === character && gameState.gameState === "Active") {
        ctx.drawImage(
          cursors.picture,
          cursors.getSprite(8).position,
          cursors.getSprite(8).size,
          new Vec2D(
            Math.round(characterDrawPos.x),
            Math.round(characterDrawPos.y) - (3*TILE_LEVEL_SIZE)
          ),
          cursors.getSprite(tile.spriteNb).size
        )
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
  const gameStateProvider = new GameStateProvider();
  const selector = new Selector(cursor);

  context2dProvider.canvas.style.scale = scaleProvider.scale.toString();
  panningListener.scale = scaleProvider.scale;
  cursor.scale = scaleProvider.scale;

  const map = await getMap();
  const graph = map.toGraph();
  const cursors = await getCursors();
  const redSpriteSheet = await getRedCharacter();
  const character = (new CharacterBuilder())
    .setSpriteSheet(redSpriteSheet)
    .build();
  character.gameStateProvider = gameStateProvider;

  character.pos = new Vec3D(1, 1, 1);
  const tileToMap = map.tile(character.pos);
  character.drawPos = tileToMap.drawPos;

  // Tile selection routine
  let cursorPositionOnMouseDown: Vec2D|null = null;
  context2dProvider.canvas.addEventListener('mousedown', (e: MouseEvent) => {
    cursorPositionOnMouseDown = new Vec2D(e.clientX, e.clientY);
  });

  let reachableTilePos: Set<Hash> = new Set();
  context2dProvider.canvas.addEventListener('mouseup', (e: MouseEvent) => {
    const cursorPositionOnMouseUp = new Vec2D(e.clientX, e.clientY);
    if (cursorPositionOnMouseDown == null || !cursorPositionOnMouseDown.almostEq(cursorPositionOnMouseUp, 3)) {
      return;
    }
    if (gameStateProvider.gameState !== "Active") {
      return;
    }
    const tile = selector.selectedTiles[0];
    if (tile == null || tile.blocked === true) {
      gameStateProvider.selectedCharacter = undefined;
      reachableTilePos = new Set();
      return;
    }
    if (tile.position.eq(character.pos)) {
      gameStateProvider.selectedCharacter = character;
      const floodFillResult = graph.floodFill(
        new Vec2D(character.pos.x, character.pos.y).hash(),
        3
      )
      reachableTilePos = floodFillResult;
      reachableTilePos = reachableTilePos.difference(map.lockedTilesPos2D);
      const toDelete = new Set<Hash>();
      for(const vecHash of reachableTilePos) {
        const vec = Vec2D.unhash(vecHash);
        const north = vec.add(new Vec2D(0,-1)).hash();
        const south = vec.add(new Vec2D(0,1)).hash();
        const east = vec.add(new Vec2D(1,0)).hash();
        const west = vec.add(new Vec2D(-1,0)).hash();
        if (
          !reachableTilePos.has(north) &&
          !reachableTilePos.has(south) &&
          !reachableTilePos.has(east) &&
          !reachableTilePos.has(west)
        ) {
          toDelete.add(vecHash);
        }
      }
      reachableTilePos = reachableTilePos.difference(toDelete);
      return;
    }

    if (gameStateProvider.selectedCharacter == null) {
      return;
    }

    const path = graph.djikstra(
        new Vec2D(character.pos.x, character.pos.y).hash(),
        new Vec2D(tile.position.x, tile.position.y).hash()
      )
    if (new Set(path).difference(reachableTilePos).size > 0) {
      return;
    }
    gameStateProvider.gameState = "Waiting";
    character.startMove(path.map(Vec2D.unhash), map);
    reachableTilePos = new Set();
    gameStateProvider.selectedCharacter = undefined;
  });

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

    let path: Set<Hash> = new Set();
    if (gameStateProvider.gameState == "Active") {
      selector.updateSelectedTiles(origin, map);

      if (gameStateProvider.selectedCharacter != null) {
        if (selector.selectedTiles.length > 0) {
          const tile = selector.selectedTiles[0];
          const pathList = graph.djikstra(
            new Vec2D(character.pos.x, character.pos.y).hash(),
            new Vec2D(tile.position.x, tile.position.y).hash()
          );
          path = new Set(pathList);
          if (path.difference(reachableTilePos).size > 0) {
            path = new Set();
          }
        }
      }
    } else {
      for(let step of character.targetPath) {
        path.add(new Vec2D(step.target.x, step.target.y).hash());
      }
    }
    map.update(millisecondsDt);
    character.updateTimeline(millisecondsDt);

    if (accumulatedDt >= TICKS_PER_FRAME) {
      context2dProvider.paintBackground();
      drawMap(
        context2dProvider,
        origin,
        map,
        selector.selectedTiles,
        cursors,
        character,
        path,
        gameStateProvider,
        reachableTilePos
      );
      accumulatedDt = 0;
    }

    countedFrames++;
    requestAnimationFrame(gameLoop);
  }

  gameLoop();
});
