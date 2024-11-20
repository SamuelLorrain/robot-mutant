type GameState =  "Active" | "Waiting";


export class GameStateProvider {
  private _gameState: GameState;

  constructor() {
    this._gameState = "Active";
  }

  public set gameState(gameState: GameState) {
    this._gameState = gameState;
  }

  public get gameState() {
    return this._gameState;
  }
}
