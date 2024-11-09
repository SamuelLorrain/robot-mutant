import { ImageDataException, PictureException } from "../exceptions";

export default class Picture {
  private _image_bitmap: ImageBitmap;
  private _blob: Blob;
  private _imageData: ImageData;

  static async createFromUri(uri: string): Promise<Picture> {
    const response = await fetch(uri);
    const blob = await response.blob()
    const bitmap = await this.bitmapFromBlob(blob);

    const imageData = this.imageDataFromBitmap(bitmap);

    return new Picture(bitmap, blob, imageData);
  }

  static async createFromBlob(blob: Blob): Promise<Picture> {
    const bitmap = await this.bitmapFromBlob(blob);
    const imageData = this.imageDataFromBitmap(bitmap);
    return new Picture(bitmap, blob, imageData);
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

  static imageDataFromBitmap(imageBitmap: ImageBitmap): ImageData {
    const canvas = document.createElement('canvas');
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    const ctx = canvas.getContext('2d');
    if (ctx == null) {
      throw new PictureException("Unable to fetch Context2d while creating imageData from bitmap");
    }
    ctx.drawImage(imageBitmap,0,0);
    return ctx.getImageData(0, 0, imageBitmap.width, imageBitmap.height);
  }

  private constructor(bitmap: ImageBitmap, blob: Blob, imageData: ImageData) {
      this._image_bitmap = bitmap;
      this._blob = blob;
      this._imageData = imageData;
  }

  public get bitmap() {
    return this._image_bitmap;
  }

  public get blob() {
    return this._blob;
  }

  public get imageData() {
    return this._imageData;
  }

}
