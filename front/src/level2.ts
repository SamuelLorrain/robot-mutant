import { Vec2D } from "./common/Vec2D";
import { SpriteSheet } from "@/ui/SpriteSheet";
import Picture from "./ui/Picture";
import tiles  from "@/assets/tiles.png";
import cursors from "@/assets/cursors.png";
import blueCharacter from "@/assets/perso-blue-sprite.png";
import redCharacter from "@/assets/perso-red-sprite.png";
import { createSingleFrameTimeline, SpriteTimelineFrame } from "@/ui/SpriteTimelineFrame";
import { Sprite } from "@/ui/Sprite";

export const loadSpritesheet = async (): Promise<Map<string, SpriteSheet>> => {
  const map = new Map();
  const tileSpriteSheet = new SpriteSheet(
    await Picture.createFromUri(tiles),
    new Vec2D(64,64),
    new Vec2D(4,4)
  );
  map.set('tiles', tileSpriteSheet);

  const cursorSpriteSheet = new SpriteSheet(
    await Picture.createFromUri(cursors),
    new Vec2D(64,64),
    new Vec2D(4,4)
  );
  map.set('cursor', cursorSpriteSheet);

  const blueCharacterSpriteSheet = new SpriteSheet(
    await Picture.createFromUri(blueCharacter),
    new Vec2D(64,64),
    new Vec2D(8,8)
  );
  map.set('blue', blueCharacterSpriteSheet);
  const redCharacterSpriteSheet = new SpriteSheet(
    await Picture.createFromUri(redCharacter),
    new Vec2D(64,64),
    new Vec2D(8,8)
  );
  map.set('red', redCharacterSpriteSheet);

  return map;
}

export const createSprites = (
  spriteSheet: SpriteSheet,
  spritesDescription: Array<number|SpriteTimelineFrame[]>
) => spritesDescription.map(description => {
    if (typeof description === 'number') {
      return new Sprite(spriteSheet, [createSingleFrameTimeline(description)]);
    } else {
      return new Sprite(spriteSheet, description);
    }
});
