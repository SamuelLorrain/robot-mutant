class GameException extends Error {
  name: string = "GameException";
}

export class WorldMapException extends GameException {
  constructor(msg: string) {
    super(msg);
    this.name = "WorldMapException";
  }
}

export class SpriteException extends GameException {
  constructor(msg: string) {
    super(msg);
    this.name = "SpriteException";
  }
}

export class CharacterException extends GameException {
  constructor(msg: string) {
    super(msg);
    this.name = "CharacterException";
  }
}

export class GameStateException extends GameException {
  constructor(msg: string) {
    super(msg);
    this.name = "GameStateException";
  }
}
