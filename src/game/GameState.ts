import { Character } from "./Character";
import { ClickEvent, isClickPixelEvent, isClickTileEvent } from "./Selector";
import { Tile } from "./Tile";
import { WorldMap } from "./WorldMap";

type GameStates = "PlayerTurn"
  | "Waiting"
  | "CharacterSelected"
  | "CharacterAttack"
  | "CharacterMove"
  | "EndTurn";

export class GameState {
  private _selectedCharacter?: Character;
  private _currentState: GameStates;

  constructor() {
    this._selectedCharacter = undefined;
    this._currentState = "PlayerTurn";
  }

  public set selectedCharacter(character: Character | undefined) {
    this._selectedCharacter = character;
  }

  public get selectedCharacter() {
    return this._selectedCharacter;
  }

  public handleEvent(event: ClickEvent, worldMap: WorldMap) {
    if (isClickTileEvent(event)) {
      switch (this._currentState) {
        case "PlayerTurn":
          const character = worldMap.characters.get(event.tile.hash());
          this.selectedCharacter = character;
          if (character == null) {
            worldMap.tilesInformations = [];
            break;
          } else {
            worldMap.tilesInformations =
              [new Tile(character.pos, worldMap.tileInformationsSprite)];
          }
          this._currentState = "CharacterSelected";
          break;
        case "CharacterSelected":
          if (worldMap.tilesInformations.get(event.tile.hash())) {
            break;
          }
          this.selectedCharacter = undefined;
          worldMap.tilesInformations = []
          this._currentState = "PlayerTurn";
          break;
        default:
          break;
      }
    } else if (isClickPixelEvent(event)) {
      switch (this._currentState) {
        case "CharacterSelected":
          this.selectedCharacter = undefined;
          worldMap.tilesInformations = []
          this._currentState = "PlayerTurn";
          break;
        default:
          break;
      }
    }
  }
}


