
class UIException extends Error {
  name: string = "UIException";
}

export class Context2DException extends UIException {
  constructor(msg: string) {
    super(msg);
    this.name = "Context2DException";
  }
}

export class ImageDataException extends UIException {
  constructor(msg: string) {
    super(msg);
    this.name = "ImageDataException";
  }
}

export class PictureException extends UIException {
  constructor(msg: string) {
    super(msg);
    this.name = "PictureException";
  }
}
