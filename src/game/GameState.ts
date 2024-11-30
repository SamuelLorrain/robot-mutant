import { Character } from "./Character";

export class GameState {
  private _selectedCharacter?: Character;

  constructor() {
    this._selectedCharacter = undefined;
  }

  public set selectedCharacter(character: Character | undefined) {
    this._selectedCharacter = character;
  }

  public get selectedCharacter() {
    return this._selectedCharacter;
  }

}
