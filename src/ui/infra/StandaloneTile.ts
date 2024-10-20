export class StandaloneTile {
  private readonly _uri: string;
  private readonly _imageData: HTMLImageElement;

  constructor(uri: string) {
    this._uri = uri;
    this._imageData = new Image();
    this._imageData.src = this.uri;
  }

  public async isReady(): Promise<boolean> {
    return new Promise((resolve) => {
      this._imageData.onload = () => {
        resolve(true)
      }
    });
  }

  public get uri() {
    return this._uri;
  }

  public get imageData() {
    return this._imageData;
  }
}
