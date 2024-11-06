import { WorldMap, WorldMapBuilder } from "./game/WorldMap";
import debugSprites from "@/assets/debug.png"
import Picture from "@/ui/infra/Picture";
import { SpriteSheetBuilder } from "./game/SpriteSheet";
import { Vec2D } from "./common/Vec2D";

const grid = [
  [1, 0], [1], [1], [1], [1, 0],
  [1], [1], [1], [1], [1],
  [1], [1], [1], [1], [1],
  [1], [1], [1], [1], [1],
  [1], [1], [1], [1], [1],
]


const getMap = async (): Promise<WorldMap> => {
  const spriteSheet = (new SpriteSheetBuilder())
    .setPicture(await Picture.createFromUri(debugSprites))
    .setSizeSpriteX(32)
    .setSizeSpriteY(32)
    .setNbSpritesRow(4)
    .setNbSpritesColumn(4)
    .build()
  const worldMap = (new WorldMapBuilder())
    .setSpriteSheet(spriteSheet)
    .setMapSize(new Vec2D(5,5))
    .buildFromArray(grid)

  return worldMap;
}

export default getMap;
