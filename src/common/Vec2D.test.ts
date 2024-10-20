import { expect, test} from "vitest";
import { Vec2D } from "./Vec2D";

test('Should create Vec2D with numbers parameters', () => {
  const vec = new Vec2D(10, 20);
  expect(vec.x).toBe(10);
  expect(vec.y).toBe(20);
})

test('Should create Vec2D with Vec2D parameters', () => {
  const vec = new Vec2D(10, 20);
  const vec2 = new Vec2D(vec);
  expect(vec2.x).toBe(10);
  expect(vec2.y).toBe(20);
})

test('Should set Vec2D with numbers', () => {
  const vec = new Vec2D(10, 20);
  vec.set(30, 50);
  expect(vec.x).toBe(30);
  expect(vec.y).toBe(50);
})

test('Should set Vec2D with Vec2D', () => {
  const vec = new Vec2D(10, 20);
  vec.set(new Vec2D(30, 50));
  expect(vec.x).toBe(30);
  expect(vec.y).toBe(50);
})
