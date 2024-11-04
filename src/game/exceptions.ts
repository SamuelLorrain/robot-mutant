class GameException extends Error {
  name: string = "GameException";
}

export class WorldMapException extends GameException {
  constructor(msg: string) {
    super(msg);
    this.name = "GameGridException";
  }
}

export class SpriteException extends GameException {
  constructor(msg: string) {
    super(msg);
    this.name = "SpriteException";
  }
}
