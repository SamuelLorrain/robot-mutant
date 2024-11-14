import { Vec2D } from "@/common/Vec2D";
import Mouse from "./Mouse";
import CanvasPanningListener from "./CanvasPanningListener";
import ScaleProvider from "../domain/ScaleProvider";

export default class CanvasChangeSizeObserver {
  private readonly _resize_observer: ResizeObserver;
  private _width: number = 0;
  private _height: number = 0;
  private readonly _canvas: HTMLCanvasElement;
  private readonly _mouse: Mouse;
  private readonly _panningListener: CanvasPanningListener;
  private readonly _scaleProvider: ScaleProvider;


  constructor(
    canvas: HTMLCanvasElement,
    mouse: Mouse,
    panningListener: CanvasPanningListener,
    scaleProvider: ScaleProvider
  ) {
    this._resize_observer = new ResizeObserver(this.onResize);
    this._resize_observer.observe(canvas, {box: 'content-box'});
    this._mouse = mouse;
    this._panningListener = panningListener;
    this._canvas = canvas;
    this._scaleProvider = scaleProvider;
    this.createWheelEventListener()
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
      if (this._mouse) {
        this._mouse.canvasSize = new Vec2D(
          this._width,
          this._height
        );
      }
    }
    this._panningListener.drag = new Vec2D(this._width/2, this._height/2);
  }

  private createWheelEventListener() {
    this._canvas.addEventListener('wheel', (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (Math.abs(e.deltaY) < 1) {
        return;
      }

      const direction = e.deltaY < 0 ? 1 : -1;
      const newScale = this._scaleProvider.scale + direction;
      if (newScale < 1) {
        this._scaleProvider.scale = 1
      } else if (newScale > 6) {
        this._scaleProvider.scale = 6
      } else {
        this._scaleProvider.scale = newScale;
      }

      this._canvas.style.scale = this._scaleProvider.scale.toString();
      this._panningListener.scale = this._scaleProvider.scale;
      this._mouse.scale = this._scaleProvider.scale;
    }, { passive: false});
  }

  public get width() {
    return this._width;
  }

  public get height() {
    return this._height;
  }
}
