import { expect, test, vi } from "vitest";
import { SpriteSheet, SpriteSheetBuilder } from "./SpriteSheet";
import Picture from "@/ui/infra/Picture";

vi.stubGlobal('createImageBitmap', (): Promise<ImageBitmap> => {
  return Promise.resolve({
    width: 100,
    height: 100,
    close: vi.fn()
  });
})

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
    width: 16,
    height: 24,
    posX: 0,
    posY: 0
  });
  expect(spriteSheet.getSprite(1)).toStrictEqual({
    width: 16,
    height: 24,
    posX: 16,
    posY: 0
  });
  expect(spriteSheet.getSprite(2)).toStrictEqual({
    width: 16,
    height: 24,
    posX: 32,
    posY: 0
  });
  expect(spriteSheet.getSprite(3)).toStrictEqual({
    width: 16,
    height: 24,
    posX: 0,
    posY: 24
  })
  expect(spriteSheet.getSprite(4)).toStrictEqual({
    width: 16,
    height: 24,
    posX: 16,
    posY: 24
  })
  expect(spriteSheet.getSprite(5)).toStrictEqual({
    width: 16,
    height: 24,
    posX: 32,
    posY: 24
  })
  expect(spriteSheet.getSprite(6)).toStrictEqual({
    width: 16,
    height: 24,
    posX: 0,
    posY: 48
  })
});
