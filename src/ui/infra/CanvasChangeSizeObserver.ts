export default class CanvasChangeSizeObserver {
  private readonly _resize_observer: ResizeObserver;
  private _width: number = 0;
  private _height: number = 0;

  constructor() {
    this._resize_observer = new ResizeObserver(this.onResize);
  }

  /* From : https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html */
  private onResize: ResizeObserverCallback = (entries) => {
    for (const entry of entries) {
      let width;
      let height;
      let dpr = window.devicePixelRatio;
      if (entry.devicePixelContentBoxSize) {
        width = entry.devicePixelContentBoxSize[0].inlineSize;
        height = entry.devicePixelContentBoxSize[0].blockSize;
        dpr = 1; // it's already in width and height
      } else if (entry.contentBoxSize) {
        if (entry.contentBoxSize[0]) {
          width = entry.contentBoxSize[0].inlineSize;
          height = entry.contentBoxSize[0].blockSize;
        } else {
          width = (entry.contentBoxSize as any).inlineSize;
          height = (entry.contentBoxSize as any).blockSize;
        }
      } else {
        width = entry.contentRect.width;
        height = entry.contentRect.height;
      }
      this._width = Math.round(width * dpr);
      this._height = Math.round(height * dpr);
    }
  }

  public get width() {
    return this._width;
  }

  public get height() {
    return this._height;
  }

  public observe(canvas: HTMLCanvasElement) {
    this._resize_observer.observe(canvas, {box: 'content-box'});
  }
}
