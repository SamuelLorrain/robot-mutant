import { WorldMap, WorldMapBuilder } from "./game/WorldMap";
import tiles  from "@/assets/tiles.png";
import cursors from "@/assets/cursors.png";
import blueCharacter from "@/assets/perso-blue-sprite.png";
import redCharacter from "@/assets/perso-red-sprite.png";
import Picture from "@/ui/infra/Picture";
import { SpriteSheet, SpriteSheetBuilder } from "./game/SpriteSheet";
import { Vec2D } from "./common/Vec2D";

const grid = [
  [0, 1], [0, 1], [0], [0], [0], [0], [0], [0], [0], [0],
  [0, 1], [0, 1], [0, 1], [[{durationMs: 500, spriteNb: 9}, {durationMs: 500, spriteNb: 10}]], [0], [0], [0], [0], [0], [0],
  [0, 1], [0, 1], [0], [0], [0], [0], [0], [0], [0], [0],
  [0, 0], [0], [0], [0], [0], [3], [0], [0], [0], [0],
  [0, 0], [0], [2], [0], [3], [3], [3], [0], [0], [0],
  [0, 0], [0], [0], [0], [0], [3], [3], [0], [0], [0],
  [0, 0], [5], [6], [7], [8], [0], [0], [1], [0, 1], [0],
  [0, 0], [0], [0], [0], [0], [0], [0], [-1], [-1], [0],
  [0, 0], [0], [0], [0], [0], [0], [0], [0], [0], [0],
  [0, 0],
  [[{durationMs: 500, spriteNb: 9}, {durationMs: 500, spriteNb: 10}]],
  [[{durationMs: 500, spriteNb: 9}, {durationMs: 500, spriteNb: 10}]],
  [[{durationMs: 500, spriteNb: 9}, {durationMs: 500, spriteNb: 10}]],
  [[{durationMs: 500, spriteNb: 9}, {durationMs: 500, spriteNb: 10}]], [0], [0], [0], [0], [0],
]

const getMap = async (): Promise<WorldMap> => {
  const spriteSheet = (new SpriteSheetBuilder())
    .setPicture(await Picture.createFromUri(tiles))
    .setSizeSpriteX(64)
    .setSizeSpriteY(64)
    .setNbSpritesRow(4)
    .setNbSpritesColumn(4)
    .build()
  const worldMap = (new WorldMapBuilder())
    .setSpriteSheet(spriteSheet)
    .setMapSize(new Vec2D(10,10))
    .buildFromArray(grid)

  return worldMap;
}

export const getCursors = async (): Promise<SpriteSheet> => {
  return (new SpriteSheetBuilder())
    .setPicture(await Picture.createFromUri(cursors))
    .setSizeSpriteX(64)
    .setSizeSpriteY(64)
    .setNbSpritesRow(4)
    .setNbSpritesColumn(4)
    .build()
}

export const getBlueCharacter = async (): Promise<SpriteSheet> => {
    return (new SpriteSheetBuilder())
    .setPicture(await Picture.createFromUri(blueCharacter))
    .setSizeSpriteX(64)
    .setSizeSpriteY(64)
    .setNbSpritesRow(8)
    .setNbSpritesColumn(8)
    .build();
}

export const getRedCharacter = async (): Promise<SpriteSheet> => {
    return (new SpriteSheetBuilder())
    .setPicture(await Picture.createFromUri(redCharacter))
    .setSizeSpriteX(64)
    .setSizeSpriteY(64)
    .setNbSpritesRow(8)
    .setNbSpritesColumn(8)
    .build();
}

export default getMap;
