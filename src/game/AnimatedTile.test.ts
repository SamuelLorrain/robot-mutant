import { AnimatedTile } from "@/game/AnimatedTile";
import { Vec3D } from "@/common/Vec3D";
import { Vec2D } from "@/common/Vec2D";
import { SpriteSheet, SpriteSheetBuilder } from "@/game/SpriteSheet";
import Picture from "@/ui/infra/Picture";

const getSpritesheet = async (): Promise<SpriteSheet> => {
  const picture = await Picture.createFromBlob(
    new Blob([new Uint8Array(1000)], {type: "image/png"})
  );
  return new SpriteSheetBuilder()
    .setPicture(picture)
    .setSizeSpriteX(16)
    .setSizeSpriteY(16)
    .setNbSpritesColumn(4)
    .setNbSpritesRow(4)
    .build()
}

test("AnimatedTile update sprite number and ticks according to delta", async () => {
  const timeline = [
    { durationMs: 300, spriteNb: 0 },
    { durationMs: 300, spriteNb: 1 },
  ];
  const animatedTile = new AnimatedTile(
    new Vec3D(0, 0, 0),
    new Vec2D(0,0),
    await getSpritesheet(),
    timeline
  )
  expect(animatedTile).toBeInstanceOf(AnimatedTile);
  expect(animatedTile.spriteNb).toEqual(0);

  animatedTile.updateTimeline(299)
  expect(animatedTile.ticks).toEqual(299);
  expect(animatedTile.spriteNb).toEqual(0);

  animatedTile.updateTimeline(1)
  expect(animatedTile.ticks).toEqual(0);
  expect(animatedTile.spriteNb).toEqual(1);

  animatedTile.updateTimeline(299)
  expect(animatedTile.ticks).toEqual(299);
  expect(animatedTile.spriteNb).toEqual(1);

  // assert that it wrap around
  animatedTile.updateTimeline(1)
  expect(animatedTile.ticks).toEqual(0);
  expect(animatedTile.spriteNb).toEqual(0);
});

test("AnimatedTile update sprite number according to delta", async () => {
  const timeline = [
    { durationMs: 300, spriteNb: 0 },
    { durationMs: 200, spriteNb: 1 },
    { durationMs: 100, spriteNb: 2 },
    { durationMs: 50, spriteNb: 3 },
  ];
  const animatedTile = new AnimatedTile(
    new Vec3D(0, 0, 0),
    new Vec2D(0,0),
    await getSpritesheet(),
    timeline
  )
  expect(animatedTile.spriteNb).toEqual(0);
  animatedTile.updateTimeline(300)
  expect(animatedTile.ticks).toEqual(0);
  expect(animatedTile.spriteNb).toEqual(1);
  animatedTile.updateTimeline(200)
  expect(animatedTile.ticks).toEqual(0);
  expect(animatedTile.spriteNb).toEqual(2);
  animatedTile.updateTimeline(100)
  expect(animatedTile.ticks).toEqual(0);
  expect(animatedTile.spriteNb).toEqual(3);
  animatedTile.updateTimeline(50)
  expect(animatedTile.ticks).toEqual(0);
  expect(animatedTile.spriteNb).toEqual(0);
});
