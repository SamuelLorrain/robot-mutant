import { Vec2D } from "@/common/Vec2D";
import CanvasChangeSizeObserver from "./CanvasChangeSizeObserver";
import CanvasPanningListener from "./CanvasPanningListener";
import Context2DProvider from "./Context2DProvider";
import Mouse from "./Mouse";
import ScaleProvider from "./ScaleProvider";

/*
 * Act as a IoC For the display system.
 * Handle graphics transformations not directly linked
 * to the game itself.
 */
export class DisplaySystem {
  private _mouse: Mouse;

  private _scaleProvider: ScaleProvider;
  private _context2DProvider: Context2DProvider;
  private _panningListener: CanvasPanningListener;
  private _changeSizeObserver: CanvasChangeSizeObserver;

  constructor() {
    this._scaleProvider = new ScaleProvider(3);
    this._context2DProvider = Context2DProvider.getInstance();
    this._mouse = Mouse.getInstance();
    this._panningListener = new CanvasPanningListener(this._context2DProvider.canvas, new Vec2D(1500, 700));
    this._changeSizeObserver = new CanvasChangeSizeObserver(
      this._context2DProvider.canvas,
      this._scaleProvider
    );
    this._panningListener.addObserver(this._context2DProvider);

    this._changeSizeObserver.addObserver(this._context2DProvider);
    this._changeSizeObserver.addObserver(this._mouse);
    this._changeSizeObserver.addObserver(this._panningListener);

    this._changeSizeObserver.notifyScaleChange();
    this._changeSizeObserver.notifyResize();
  }

}

