import { Context2DException } from "@/ui/exceptions";
import conf from '@/configuration';
import { Vec2D } from "@/common/Vec2D";
import Picture from "./Picture";
import { Observer } from "@/common/behavioral/Observer";
import { PublisherEvent } from "@/common/behavioral/PublisherEvent";

/* Service class used to get the 2D context of the webpage */
export default class Context2DProvider implements Observer {
  private readonly _ctx: CanvasRenderingContext2D;
  private readonly _canvas: HTMLCanvasElement;

  private static _instance: Context2DProvider;

  private constructor() {
    this._canvas = document.querySelector(conf.canvas.querySelector) as HTMLCanvasElement;;

    if (this._canvas == null) {
      throw new Context2DException(`
        Canvas unavailable, ensure that a canvas element
        with ${conf.canvas.querySelector} query selector is present
        in the index.html file`
      );
    }
    this._ctx = this._canvas.getContext("2d") as CanvasRenderingContext2D;
    if (this._ctx == null) {
      throw new Context2DException(`
        Rendering context unavailable,
        can't continue
        `
      );
    }

    this.paintBackground();
  }

  public static getInstance(): Context2DProvider {
    if (!Context2DProvider._instance) {
      Context2DProvider._instance = new Context2DProvider();
    }
    return Context2DProvider._instance;
  }

  public get canvas() {
    return this._canvas;
  }

  public updateCanvasSize(newWidth: number, newHeight: number) {
    if (newWidth !== this._canvas.width || newHeight !== this._canvas.height) {
      this._canvas.width = newWidth;
      this._canvas.height = newHeight;
    }
  }

  public paintBackground() {
    this._ctx.fillStyle = conf.canvas.background;
    this._ctx.fillRect(0,0, this.canvas.width, this.canvas.height);
  }

  public setFilter(filter: string) {
    this._ctx.filter = filter;
  }


  public update(event: PublisherEvent) {
    if (event.eventType === "ScaleEvent") {
      this._canvas.style.scale = event.data.toString();
    } else if (event.eventType === "ResizeEvent") {
      this.updateCanvasSize(
        event.data.width,
        event.data.height
      )
    }
  }

  /**
  * Draw image on canvas, use the same arguments than ctx.drawImage.
  * Except it takes Pictures and Vec2D as arguments instead of ImageData and plain numbers
  * See: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
  */
  public drawImage(picture: Picture, posSrc: Vec2D, sizeSrc?: never, posDst?: never, sizeDst?: never): void;
  public drawImage(picture: Picture, posSrc: Vec2D, sizeSrc: Vec2D, posDst?: never, sizeDst?: never): void;
  public drawImage(picture: Picture, posSrc: Vec2D, sizeSrc: Vec2D, posDst: Vec2D, sizeDst: Vec2D): void;
  public drawImage(picture: Picture, posSrc: Vec2D, sizeSrc?: Vec2D, posDst?: Vec2D, sizeDst?: Vec2D) {
    if (typeof(sizeSrc) === 'undefined') {
      this._ctx.drawImage(picture.bitmap, posSrc.x, posSrc.y);
    } else if (typeof(posDst) === 'undefined') {
      this._ctx.drawImage(picture.bitmap, posSrc.x, posSrc.y, sizeSrc.x, sizeSrc.y);
    } else {
      this._ctx.drawImage(
        picture.bitmap,
        posSrc.x, posSrc.y,
        sizeSrc.x, sizeSrc.y,
        posDst.x, posDst.y,
        (sizeDst as Vec2D).x, (sizeDst as Vec2D).y
      );
    }
  }
}
