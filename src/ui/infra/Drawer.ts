import { Vec2D } from "@/common/Vec2D";
import Context2DProvider from "./Context2DProvider";
import { WorldMap } from "@/game/WorldMap";
import { Tile } from "@/game/Tile";
import { SpriteSheet } from "@/game/SpriteSheet";
import { Character } from "@/game/Character";
import { Hash } from "@/common/Hash";
import { GameStateProvider } from "@/game/GameStateProvider";
import { TILE_LEVEL_SIZE } from "@/globals";

export function drawMap(
  ctx: Context2DProvider,
  origin: Vec2D,
  map: WorldMap,
  hoverTile: Tile|undefined,
  cursors: SpriteSheet,
  characters: Character[],
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
      let isHoverTile = false;
      if (hoverTile != null && hoverTile.position.eq(pos)) {
          isHoverTile = true;
      }
      ctx.drawImage(
        tile.spriteSheet.picture,
        tile.spriteSheet.getSprite(tile.spriteNb).position,
        tile.spriteSheet.getSprite(tile.spriteNb).size,
        roundedDrawpos,
        tile.spriteSheet.getSprite(tile.spriteNb).size
      )
      if (isHoverTile) {
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
      for(const character of characters) {
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
          if (gameState.selectedCharacter === character && gameState.isActive) {
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
}
