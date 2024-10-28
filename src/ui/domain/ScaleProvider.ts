
export default class ScaleProvider {
  private _scale: number;

  constructor(initialScale: number = 1) {
    this._scale = initialScale;
  }

  public get scale() {
    return this._scale;
  }

  public set scale(scale: number) {
    this._scale = scale;
  }
}
