import { ImageDataException } from "../exceptions";

export default class Picture {
  private _bitmap: ImageBitmap;

  static async createFromUri(uri: string): Promise<Picture> {
    const response = await fetch(uri);
    const bitmap = await this.bitmapFromBlob(await response.blob());
    return new Picture(bitmap)
  }

  static async createFromBlob(blob: Blob): Promise<Picture> {
    const bitmap = await this.bitmapFromBlob(blob);
    return new Picture(bitmap)
  }

  static async bitmapFromBlob(blob: Blob|HTMLImageElement): Promise<ImageBitmap> {
    try {
      return window.createImageBitmap(blob, { resizeQuality: "pixelated"});
    } catch (e) {
      throw new ImageDataException(
        `Unable to create ImageBitmap:  ${(e as Error).toString()}`
      );
    }
  }

  private constructor(bitmap: ImageBitmap) {
        this._bitmap = bitmap;
  }

  public get bitmap() {
    return this._bitmap;
  }
}
