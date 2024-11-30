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

window.addEventListener('load', async () => {
  new DisplaySystem();

  const spriteSheets = await loadSpritesheet();
  const mapSprites = createSprites(
    spriteSheets.get('tiles') as SpriteSheet,
    [0, 1, 2, 3, 4, 5, 6, 8, [{durationMs: 500, spriteNb: 9}, {durationMs: 500, spriteNb: 10}]]
  );
  const characterSprites = createSprites(
    spriteSheets.get('red') as SpriteSheet,
    [[{durationMs: 400, spriteNb: 0}, {durationMs: 400, spriteNb: 1}]]
  )

  const cursorSprites = createSprites(
    spriteSheets.get('cursor') as SpriteSheet,
    [0,1,2,3,4,5,6]
  )

  const sprites = mapSprites;
  sprites.push(...characterSprites);

  const gameState = new GameState();

  const renderer = new Renderer(cursorSprites[2], gameState);

  const tiles = new Map();
  tiles.set(new Vec3D(0, 0, 0).hash(), new Tile(new Vec3D(0, 0, 0), mapSprites[1]));
  tiles.set(new Vec3D(0, 1, 0).hash(), new Tile(new Vec3D(0, 1, 0), mapSprites[1]));
  tiles.set(new Vec3D(1, 2, 0).hash(), new Tile(new Vec3D(1, 2, 0), mapSprites[1]));
  tiles.set(new Vec3D(-1, 0, 0).hash(), new Tile(new Vec3D(-1, 0, 0), mapSprites[1]));
  tiles.set(new Vec3D(-1, 0, 1).hash(), new Tile(new Vec3D(-1, 0, 1), mapSprites[1]));
  tiles.set(new Vec3D(-1, 0, 2).hash(), new Tile(new Vec3D(-1, 0, 2), mapSprites[1]));
  tiles.set(new Vec3D(1, 1, 0).hash(), new Tile(new Vec3D(1, 1, 0), mapSprites[8]));
  tiles.set(new Vec3D(0, -1, 0).hash(), new Tile(new Vec3D(0, -1, 0), mapSprites[8]));
  tiles.set(new Vec3D(1, 0, 0).hash(), new Tile(new Vec3D(1, 0, 0), mapSprites[1]));
  tiles.set(new Vec3D(1, 3, 0).hash(), new Tile(new Vec3D(1, 3, 0), mapSprites[2]));

  const selector = new Selector(renderer);
  const updater = new Updater(selector, gameState);
  const worldmap = new WorldMap(tiles);

  const redCharacterMap:Map<string, Sprite> = new Map();
  redCharacterMap.set(JSON.stringify(["front", "idle"]), characterSprites[0]);

  worldmap.characters = [
    new Character(new Vec3D(0,0,0), redCharacterMap)
  ]

  worldmap.tilesInformations = [
    new Tile(new Vec3D(1, 1, 0), cursorSprites[6])
  ];

  updater.worldmap = worldmap;
  updater.sprites = sprites;
  renderer.worldmap = worldmap;

  const game = new Game(updater, renderer, selector);

  game.init();
  game.gameLoop();
});
