import "./style.css";
import { createSprites, loadSpritesheet } from "./level2";
import { SpriteSheet } from "@/ui/SpriteSheet";
import { Game } from "./game/Game";
import { Renderer } from "./game/Renderer";
import { Updater } from "./game/Updater";
import { DisplaySystem } from "./ui/DisplaySystem";
import { Tile } from "./game/Tile";
import { Vec3D } from "./common/Vec3D";
import { WorldMap } from "./game/WorldMap";
import { Selector } from "./game/Selector";
import { Character } from "./game/Character";
import { Sprite } from "./ui/Sprite";
import { GameState } from "./game/GameState";
import { Queue } from "./common/Queue";
import { GameEvent } from "./game/events/GameEvent";
import { Team } from "./game/Teams";
import { TitleScreen } from "./ui/TitleScreen";

window.addEventListener('load', async () => {
  new DisplaySystem();

  const spriteSheets = await loadSpritesheet();
  const mapSprites = createSprites(
    spriteSheets.get('tiles') as SpriteSheet,
    [0, 1, 2, 3, 4, 5, 6, 8, [{durationMs: 500, spriteNb: 9}, {durationMs: 500, spriteNb: 10}]]
  );
  const redCharacterSprites = createSprites(
    spriteSheets.get('red') as SpriteSheet,
    [
      // idle
      [{durationMs: 400, spriteNb: 0}, {durationMs: 400, spriteNb: 1}],
      [{durationMs: 400, spriteNb: 4}, {durationMs: 400, spriteNb: 5}],
      [{durationMs: 400, spriteNb: 32}, {durationMs: 400, spriteNb: 33}],
      [{durationMs: 400, spriteNb: 36}, {durationMs: 400, spriteNb: 37}],
      // walking
      [{durationMs: 400, spriteNb: 16}, {durationMs: 400, spriteNb: 17}],
      [{durationMs: 400, spriteNb: 20}, {durationMs: 400, spriteNb: 21}],
      [{durationMs: 400, spriteNb: 48}, {durationMs: 400, spriteNb: 49}],
      [{durationMs: 400, spriteNb: 52}, {durationMs: 400, spriteNb: 53}]
    ]
  )
  const blueCharacterSprites = createSprites(
    spriteSheets.get('blue') as SpriteSheet,
    [
      // idle
      [{durationMs: 400, spriteNb: 0}, {durationMs: 400, spriteNb: 1}],
      [{durationMs: 400, spriteNb: 4}, {durationMs: 400, spriteNb: 5}],
      [{durationMs: 400, spriteNb: 32}, {durationMs: 400, spriteNb: 33}],
      [{durationMs: 400, spriteNb: 36}, {durationMs: 400, spriteNb: 37}],
      // walking
      [{durationMs: 400, spriteNb: 16}, {durationMs: 400, spriteNb: 17}],
      [{durationMs: 400, spriteNb: 20}, {durationMs: 400, spriteNb: 21}],
      [{durationMs: 400, spriteNb: 48}, {durationMs: 400, spriteNb: 49}],
      [{durationMs: 400, spriteNb: 52}, {durationMs: 400, spriteNb: 53}]
    ]
  )

  const cursorSprites = createSprites(
    spriteSheets.get('cursor') as SpriteSheet,
    [0,1,2,3,4,5,6]
  )

  const sprites = mapSprites;
  sprites.push(...redCharacterSprites);
  sprites.push(...blueCharacterSprites);
  sprites.push(...cursorSprites);

  const tiles = new Map();
  for(let i = 0; i < 8; i++) {
    for(let j = 0; j < 8; j++) {
      tiles.set(new Vec3D(i, j, 0).hash(), new Tile(new Vec3D(i, j, 0), mapSprites[1]));
    }
  }

  const worldmap = new WorldMap(tiles, cursorSprites[6], cursorSprites[6]);
  const renderer = new Renderer(cursorSprites[2], worldmap);
  const selector = new Selector(renderer);
  const updater = new Updater(selector);
  const gameEventQueue: Queue<GameEvent> = new Queue();

  const redCharacterMap:Map<string, Sprite> = new Map();
  redCharacterMap.set(JSON.stringify(["front", "idle"]), redCharacterSprites[0]);
  redCharacterMap.set(JSON.stringify(["back", "idle"]), redCharacterSprites[1]);
  redCharacterMap.set(JSON.stringify(["right", "idle"]), redCharacterSprites[2]);
  redCharacterMap.set(JSON.stringify(["left", "idle"]), redCharacterSprites[3]);
  redCharacterMap.set(JSON.stringify(["front", "walking"]), redCharacterSprites[4]);
  redCharacterMap.set(JSON.stringify(["back", "walking"]), redCharacterSprites[5]);
  redCharacterMap.set(JSON.stringify(["right", "walking"]), redCharacterSprites[6]);
  redCharacterMap.set(JSON.stringify(["left", "walking"]), redCharacterSprites[7]);

  const blueCharacterMap:Map<string, Sprite> = new Map();
  blueCharacterMap.set(JSON.stringify(["front", "idle"]), blueCharacterSprites[0]);
  blueCharacterMap.set(JSON.stringify(["back", "idle"]), blueCharacterSprites[1]);
  blueCharacterMap.set(JSON.stringify(["right", "idle"]), blueCharacterSprites[2]);
  blueCharacterMap.set(JSON.stringify(["left", "idle"]), blueCharacterSprites[3]);
  blueCharacterMap.set(JSON.stringify(["front", "walking"]), blueCharacterSprites[4]);
  blueCharacterMap.set(JSON.stringify(["back", "walking"]), blueCharacterSprites[5]);
  blueCharacterMap.set(JSON.stringify(["right", "walking"]), blueCharacterSprites[6]);
  blueCharacterMap.set(JSON.stringify(["left", "walking"]), blueCharacterSprites[7]);

  worldmap.characters = [
    new Character(new Vec3D(3,3,0), redCharacterMap, gameEventQueue, 3),
    new Character(new Vec3D(5,3,0), blueCharacterMap, gameEventQueue, 3),
  ]

  const teams = [
    new Team([worldmap.characters[0]]),
    new Team([worldmap.characters[1]]),
  ]

  worldmap.tilesInformations = new Map();

  updater.worldmap = worldmap;
  updater.sprites = sprites;
  renderer.worldmap = worldmap;

  const titleScreen = new TitleScreen();
  const game = new Game(updater, renderer, selector, gameEventQueue);
  const gameState = new GameState(teams, 0);

  const titleScreenInterval = setInterval(() => {
    if (titleScreen.started == true) {
      clearInterval(titleScreenInterval);
      game.init();
      game.gameLoop(gameState, worldmap);
    }
  }, 250);
});
