import { test, expect } from "vitest";
import Mouse from "./Mouse";

test('Can get instance of Mouse', () => {
  const instance = Mouse.getInstance();
  expect(instance).toBeInstanceOf(Mouse);
});

test('Mouse should be a singleton', () => {
  const instance = Mouse.getInstance();
  const instance2 = Mouse.getInstance();
  expect(instance).toEqual(instance2);
});


test('Can get mouse components', () => {
  const instance = Mouse.getInstance();
  expect(instance.x).toBeTypeOf('number');
  expect(instance.y).toBeTypeOf('number');
});

test('Should change Mouse position on mousemove', () => {
  const instance = Mouse.getInstance();
  const mouseEvent = new MouseEvent('mousemove', {
    clientX: 200,
    clientY: 300,
  });
  dispatchEvent(mouseEvent);
  expect(instance.x).toBe(200);
  expect(instance.y).toBe(300);
});
