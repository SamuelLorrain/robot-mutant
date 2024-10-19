/**
 * @vitest-environment jsdom
 */
import { expect, test, vi } from 'vitest'
import Context2DProvider from "./Context2DProvider";
import { JSDOM } from 'jsdom';


const dom = new JSDOM(`
<!DOCTYPE html>
<html>
<body>
  <canvas id="canvas"></canvas>
</body>
</html>
`);

vi.stubGlobal('document', dom.window.document);

test('can instantiate Context2DProvider', () => {
  const instance = Context2DProvider.getInstance();
  expect(instance).not.toBeNull();
});

test('always get the same Context2DProvider instance', () => {
  const instance1 = Context2DProvider.getInstance();
  const instance2 = Context2DProvider.getInstance();
  expect(instance1).toEqual(instance2);
})
