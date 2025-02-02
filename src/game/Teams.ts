import { Character } from "./Character";

export class Team {
  private _characters: Character[];

  constructor(characters: Character[]) {
    this._characters = characters;
  }

  public hasCharacter(character: Character) {
    return this._characters.find(x => x == character);
  }
}
