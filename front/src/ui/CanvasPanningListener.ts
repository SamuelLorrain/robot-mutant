import { Observer } from "@/common/behavioral/Observer";
import { Publisher } from "@/common/behavioral/Publisher";
import { PublisherEvent, PublisherEventType } from "@/common/behavioral/PublisherEvent";
import { Vec2D } from "@/common/Vec2D";

export default class CanvasPanningListener implements Observer, Publisher {
  readonly _canvas: HTMLCanvasElement;
  private _dragging: boolean;
  private _drag: Vec2D;
  private _dragstart: Vec2D;
  private _currentDragging: Vec2D;
  private _scale: number;
  private _observers: Observer[];

  constructor(canvas: HTMLCanvasElement, initialOffset?: Vec2D) {
    this._canvas = canvas;
    this._dragging = false;
    if (initialOffset == null) {
      this._drag = new Vec2D();
    } else {
      this._drag = new Vec2D(initialOffset);
    }
    this._dragstart = new Vec2D();
    this._currentDragging = new Vec2D();
    this._scale = 1;
    this._observers = [];

    this._canvas.addEventListener('mousedown', (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      this._dragging = true;
      this._currentDragging = new Vec2D(this._drag);
      this._dragstart.set(
        (e.clientX * window.devicePixelRatio) / this._scale,
        (e.clientY * window.devicePixelRatio) / this._scale
      )
    });

    canvas.addEventListener('mouseup', (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      this._dragging = false;
    });

    canvas.addEventListener('mousemove', (e: MouseEvent) => {
      if (!this._dragging) {
        return;
      }
      const currentPosition = new Vec2D(
        (e.clientX * window.devicePixelRatio) / this._scale,
        (e.clientY * window.devicePixelRatio) / this._scale
      )
      if (this._dragstart.almostEq(currentPosition, 2)) {
        return;
      }

      this.drag = new Vec2D(
        (e.clientX * window.devicePixelRatio / this._scale) - this._dragstart.x + this._currentDragging.x,
        (e.clientY * window.devicePixelRatio / this._scale) - this._dragstart.y + this._currentDragging.y
      );
    });
  }

  public addObserver(observer: Observer) {
    this._observers.push(observer);
  }

  public notifyChanges() {
    const event =  {
      eventType: "DragEvent" as PublisherEventType,
      data: {
        x: this.drag.x,
        y: this.drag.y
      }
    }
    for(const observer of this._observers) {
      observer.update(event);
    }
  }

  public get drag(): Vec2D {
    return this._drag;
  };

  public set scale(scale: number) {
    this._scale = scale;
  }

  public set drag(vec: Vec2D) {
    this._drag = new Vec2D(vec);
    this.notifyChanges();
  }

  public update(event: PublisherEvent) {
    if (event.eventType === "ScaleEvent") {
      this._scale = event.data;
    }
    else if (event.eventType === "ResizeEvent") {
      this.drag = new Vec2D(event.data.width/2, event.data.height/2);
    }
  }
}
