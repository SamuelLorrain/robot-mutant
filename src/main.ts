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

window.addEventListener('load', async () => {
  new DisplaySystem();

  const spriteSheets = await loadSpritesheet();
  const mapSprites = createSprites(
    spriteSheets.get('tiles') as SpriteSheet,
    [0, 1, 2, 3, 4, 5, 6, 8, [{durationMs: 500, spriteNb: 9}, {durationMs: 500, spriteNb: 10}]]
  );
  const characterSprites = createSprites(
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

  const cursorSprites = createSprites(
    spriteSheets.get('cursor') as SpriteSheet,
    [0,1,2,3,4,5,6]
  )

  const sprites = mapSprites;
  sprites.push(...characterSprites);
  sprites.push(...cursorSprites);

  const gameState = new GameState();


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
  redCharacterMap.set(JSON.stringify(["front", "idle"]), characterSprites[0]);
  redCharacterMap.set(JSON.stringify(["back", "idle"]), characterSprites[1]);
  redCharacterMap.set(JSON.stringify(["right", "idle"]), characterSprites[2]);
  redCharacterMap.set(JSON.stringify(["left", "idle"]), characterSprites[3]);
  redCharacterMap.set(JSON.stringify(["front", "walking"]), characterSprites[4]);
  redCharacterMap.set(JSON.stringify(["back", "walking"]), characterSprites[5]);
  redCharacterMap.set(JSON.stringify(["right", "walking"]), characterSprites[6]);
  redCharacterMap.set(JSON.stringify(["left", "walking"]), characterSprites[7]);

  worldmap.characters = [
    new Character(new Vec3D(3,3,0), redCharacterMap, gameEventQueue, 3)
  ]

  worldmap.tilesInformations = [];

  updater.worldmap = worldmap;
  updater.sprites = sprites;
  renderer.worldmap = worldmap;

  const game = new Game(updater, renderer, selector, gameEventQueue);

  game.init();
  game.gameLoop(gameState, worldmap);
});
