import { Character } from "./Character";

type GameState =  "Active" | "Waiting";


export class GameStateProvider {
  public gameState: GameState;
  public selectedCharacter?: Character;

  constructor() {
    this.gameState = "Active";
    this.selectedCharacter = undefined;
  }

}
