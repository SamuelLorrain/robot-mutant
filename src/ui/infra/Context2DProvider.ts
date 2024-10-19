import { Context2DException } from "@/ui/exceptions";
import conf from '@/configuration';

/* Service class used to get the 2D context of the webpage */
export default class Context2DProvider {
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

  public get ctx() {
    return this._ctx;
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
    this.ctx.fillStyle = conf.canvas.background;
    this.ctx.fillRect(0,0, this.canvas.width, this.canvas.height);
  }
}
