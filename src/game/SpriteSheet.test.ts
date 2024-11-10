import { Vec2D } from "@/common/Vec2D";
import { SpriteSheet, SpriteSheetBuilder } from "./SpriteSheet";
import Picture from "@/ui/infra/Picture";

test('Can build SpriteSheet with the builder', async () => {
  const builder = new SpriteSheetBuilder()
  const picture = await Picture.createFromBlob(
    new Blob([new Uint8Array(1000)], {type: "image/png"})
  );
  const spriteSheet = builder
    .setPicture(picture)
    .setSizeSpriteX(10)
    .setSizeSpriteY(10)
    .setNbSpritesColumn(3)
    .setNbSpritesRow(3)
    .build();
  expect(spriteSheet).toBeInstanceOf(SpriteSheet);
});

test('Get good sprite position', async () => {
  const builder = new SpriteSheetBuilder()
  const picture = await Picture.createFromBlob(
    new Blob([new Uint8Array(1024)], {type: "image/png"})
  );
  const spriteSheet = builder
    .setPicture(picture)
    .setSizeSpriteX(16)
    .setSizeSpriteY(24)
    .setNbSpritesColumn(3)
    .setNbSpritesRow(3)
    .build();
  expect(spriteSheet.getSprite(0)).toStrictEqual({
    size: new Vec2D(
      16,
      24
    ),
    position: new Vec2D(
      0,
      0
    ),
  });
  expect(spriteSheet.getSprite(1)).toStrictEqual({
    size: new Vec2D(
      16,
      24
    ),
    position: new Vec2D(
      16,
      0
    ),
  });
  expect(spriteSheet.getSprite(2)).toStrictEqual({
    size: new Vec2D(
      16,
      24
    ),
    position: new Vec2D(
      32,
      0
    ),
  });
  expect(spriteSheet.getSprite(3)).toStrictEqual({
    size: new Vec2D(
      16,
      24
    ),
    position: new Vec2D(
      0,
      24
    ),
  })
  expect(spriteSheet.getSprite(4)).toStrictEqual({
    size: new Vec2D(
      16,
      24
    ),
    position: new Vec2D(
      16,
      24
    ),
  })
  expect(spriteSheet.getSprite(5)).toStrictEqual({
    size: new Vec2D(
      16,
      24,
    ),
    position: new Vec2D(
      32,
      24
    ),
  })
  expect(spriteSheet.getSprite(6)).toStrictEqual({
    size: new Vec2D(
      16,
      24,
    ),
    position: new Vec2D(
      0,
      48
    ),
  })
});
