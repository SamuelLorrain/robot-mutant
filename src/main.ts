import "./style.css";
import Context2DProvider from '@/ui/infra/Context2DProvider';
import CanvasChangeSizeObserver from "@/ui/infra/CanvasChangeSizeObserver";
import Mouse from "@/ui/infra/Mouse";
import { Vec2D } from "@/common/Vec2D";
import CanvasPanningListener from "./ui/infra/CanvasPanningListener";
import ScaleProvider from "./ui/domain/ScaleProvider";
import getMap, { getCursors, getRedCharacter } from "./level";
import { AutonomousTimer } from "./common/Timer";
import { TICKS_PER_FRAME } from "./globals";
import { Vec3D } from "./common/Vec3D";
import { CharacterBuilder } from "./game/CharacterBuilder";
import { GameStateProvider } from "./game/GameStateProvider";
import { Hash } from "./common/Hash";
import { Selector } from "./game/Selector";
import { drawMap } from "./ui/infra/Drawer";

let origin = new Vec2D();

window.addEventListener('load', async () => {
  const scaleProvider = new ScaleProvider(3);
  const context2dProvider = Context2DProvider.getInstance();
  const cursor = Mouse.getInstance();
  const panningListener = new CanvasPanningListener(context2dProvider.canvas, new Vec2D(1500, 700));
  const changeSizeObserver = new CanvasChangeSizeObserver(
    context2dProvider.canvas,
    scaleProvider
  );
  changeSizeObserver.addObserver(context2dProvider);
  changeSizeObserver.addObserver(cursor);
  changeSizeObserver.addObserver(panningListener);

  changeSizeObserver.notifyScaleChange();
  changeSizeObserver.notifyResize();

  const gameStateProvider = new GameStateProvider();

  const map = await getMap();
  const graph = map.toGraph();
  const cursors = await getCursors();
  const redSpriteSheet = await getRedCharacter();
  const character = (new CharacterBuilder())
    .setSpriteSheet(redSpriteSheet)
    .build();
  character.addObserver(gameStateProvider);
  character.pos = new Vec3D(1, 1, 1);
  const tileToMap = map.tile(character.pos);
  character.drawPos = tileToMap.drawPos;

  let reachableTilePos: Set<Hash> = new Set();

  const onClick = (_: MouseEvent) => {
    if (gameStateProvider.gameState !== "Active") {
      return;
    }
    const tile = selector.hoverTile;
    if (tile == null || tile.blocked === true) {
      gameStateProvider.selectedCharacter = undefined;
      reachableTilePos = new Set();
      return;
    }
    if (tile.position.eq(character.pos)) {
      gameStateProvider.selectedCharacter = character;
      const floodFillResult = graph.floodFill(
        new Vec2D(character.pos.x, character.pos.y).hash(),
        3,
        map.lockedTilesPos2D
    )
      reachableTilePos = floodFillResult;
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
  }

  const selector = new Selector(cursor, context2dProvider, onClick);

  const capTimer = new AutonomousTimer();
  capTimer.start();
  capTimer.addObserver(character);
  capTimer.addObserver(map);

  let lastTime = 0;
  let countedFrames = 0;
  let accumulatedDt = 0;

  const gameLoop = () => {
    const now = capTimer.getTicks();
    const millisecondsDt = now - lastTime;
    lastTime = now;
    accumulatedDt += millisecondsDt;

    origin.set(
      panningListener.drag.x,
      panningListener.drag.y
    );

    let path: Set<Hash> = new Set();
    if (gameStateProvider.gameState == "Active") {
      selector.updateHoverTile(origin, map);

      if (gameStateProvider.selectedCharacter != null && selector.hoverTile != null) {
        const tile = selector.hoverTile;
        const pathList = graph.djikstra(
          new Vec2D(character.pos.x, character.pos.y).hash(),
          new Vec2D(tile.position.x, tile.position.y).hash()
        );
        path = new Set(pathList);
        if (path.difference(reachableTilePos).size > 0) {
          path = new Set();
        }
      }
    } else {
      for(let step of character.targetPath) {
        path.add(new Vec2D(step.target.x, step.target.y).hash());
      }
    }

    capTimer.notify();
    if (accumulatedDt >= TICKS_PER_FRAME) {
      context2dProvider.paintBackground();
      drawMap(
        context2dProvider,
        origin,
        map,
        selector.hoverTile,
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
