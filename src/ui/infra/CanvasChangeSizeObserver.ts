import ScaleProvider from "../domain/ScaleProvider";
import { Publisher } from "@/common/behavioral/Publisher";
import { Observer } from "@/common/behavioral/Observer";
import { PublisherEventType } from "@/common/behavioral/PublisherEvent";

export default class CanvasChangeSizeObserver implements Publisher {
  private readonly _resize_observer: ResizeObserver;
  private _width: number = 0;
  private _height: number = 0;
  private readonly _canvas: HTMLCanvasElement;
  private readonly _scaleProvider: ScaleProvider;
  private readonly _changeSizeObservers: Observer[];

  constructor(
    canvas: HTMLCanvasElement,
    scaleProvider: ScaleProvider
  ) {
    this._resize_observer = new ResizeObserver(this.onResize);
    this._resize_observer.observe(canvas, {box: 'content-box'});
    this._canvas = canvas;
    this._scaleProvider = scaleProvider;
    this._changeSizeObservers = [];
    this.createWheelEventListener()
  }

  public addObserver(observer: Observer) {
    this._changeSizeObservers.push(observer)
  }

  public notifyResize() {
    const event = {
      data: {
        width: this._width,
        height: this._height
      },
      eventType: "ResizeEvent" as PublisherEventType
    }
    for(const observer of this._changeSizeObservers) {
      observer.update(event);
    }
  }

  public notifyScaleChange() {
    const event = {
      data: this._scaleProvider.scale,
      eventType: "ScaleEvent" as PublisherEventType
    }
    for(const observer of this._changeSizeObservers) {
      observer.update(event);
    }
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
    this.notifyResize();
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

      this.notifyScaleChange();
    }, { passive: false});
  }

  public get width() {
    return this._width;
  }

  public get height() {
    return this._height;
  }
}
