import Context2DProvider from "./Context2DProvider";

document.body.innerHTML = `<canvas id="canvas"></canvas>`;

test('can instantiate Context2DProvider', () => {
  const instance = Context2DProvider.getInstance();
  expect(instance).not.toBeNull();
});

test('always get the same Context2DProvider instance', () => {
  const instance1 = Context2DProvider.getInstance();
  const instance2 = Context2DProvider.getInstance();
  expect(instance1).toEqual(instance2);
})
