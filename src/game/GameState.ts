import { Character } from "./Character";
import { ClickEvent, isClickPixelEvent, isClickTileEvent } from "./Selector";
import { WorldMap } from "./WorldMap";

export type TurnStep = {
  handleEvent(event: ClickEvent, worldMap: WorldMap, gameState: GameState): void;
}

const BeginTurn = {
  handleEvent(event: ClickEvent, worldMap: WorldMap, gameState: GameState) {
    if (isClickTileEvent(event)) {
      const character = worldMap.characters.get(event.tilePos.hash());
      if (character == null) {
        worldMap.tilesInformations = [];
        return;
      }
      worldMap.computeTilesInformations(character.pos, 2);
      gameState.selectedCharacter = character;
      gameState.turnStep = CharacterSelected;
    }
  }
} satisfies TurnStep;

const CharacterSelected = {
  handleEvent(event: ClickEvent, worldMap: WorldMap, gameState: GameState) {
    if (isClickTileEvent(event)) {
      const tileInformation = worldMap.tilesInformations.get(event.tilePos.hash());
      if (tileInformation == null) {
        worldMap.tilesInformations = [];
        gameState.selectedCharacter = undefined;
        gameState.turnStep = BeginTurn;
        return;
      }
    } else if (isClickPixelEvent(event)) {
      worldMap.tilesInformations = [];
      gameState.selectedCharacter = undefined;
      gameState.turnStep = BeginTurn;
    }
  }
} satisfies TurnStep;


export class GameState {
  private _selectedCharacter?: Character;
  private _turnStep: TurnStep;

  constructor() {
    this._selectedCharacter = undefined;
    this._turnStep = BeginTurn;
  }

  public set turnStep(step: TurnStep) {
    this._turnStep = step;
  }

  public set selectedCharacter(character: Character | undefined) {
    this._selectedCharacter = character;
  }

  public get selectedCharacter() {
    return this._selectedCharacter;
  }

  public handleEvent(event: ClickEvent, worldMap: WorldMap) {
    this._turnStep.handleEvent(event, worldMap, this);
  }
}


