import { Vec2D } from "./common/Vec2D";

export const SPRITE_SIZE = new Vec2D(64, 32);
export const TILE_LEVEL_SIZE = 8;


/*
 * The framerate will be caped by
 * requestAnimationFrame regardless.
 * As it acts similary to a VSYNC
 */
export const FRAME_RATE = 60;

/**
 * One tick is on ms.
 * The code has one millisecond per frame.
 */
export const TICKS_PER_FRAME = 1000 / FRAME_RATE;
