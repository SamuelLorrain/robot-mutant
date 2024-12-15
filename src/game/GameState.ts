import { Vec2D } from "@/common/Vec2D";
import { Character } from "./Character";
import { GameEvent, isClickPixelEvent, isClickTileEvent, isFinishActionEvent, isHoverEvent } from "./events/GameEvent";
import { GameStateException } from "./exceptions";
import { tiles3DToGraph2D } from "./TilesToGraph";
import { WorldMap } from "./WorldMap";
import { Vec3D } from "@/common/Vec3D";

export type TurnStep = {
  handleEvent(event: GameEvent, worldMap: WorldMap, gameState: GameState): void;
}

const BeginTurn = {
  handleEvent(event: GameEvent, worldMap: WorldMap, gameState: GameState) {
    if (isClickTileEvent(event)) {
      const character = worldMap.characters.find(character => character.pos.eq(event.tilePos));
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
  handleEvent(event: GameEvent, worldMap: WorldMap, gameState: GameState) {
    if (isClickTileEvent(event)) {
      const tileInformation = worldMap.tilesInformations.get(event.tilePos.hash());
      if (tileInformation == null) {
        worldMap.tilesInformations = [];
        gameState.selectedCharacter = undefined;
        gameState.turnStep = BeginTurn;
        return;
      }
      if (gameState.selectedCharacter == null) {
        throw new GameStateException("Character can't be null or undefined when game is in 'CharacterSelected' state.")
      }
      const graph = tiles3DToGraph2D(worldMap.tilesInformations);
      if (!graph.has(new Vec2D(event.tilePos.x, event.tilePos.y).hash())) {
        return;
      }
      const characterPos = new Vec2D(gameState.selectedCharacter.pos.x, gameState.selectedCharacter.pos.y);
      const path = graph.getPath(characterPos, new Vec2D(event?.tilePos.x, event.tilePos.y));
      const path3D: Vec3D[] = path.map(vec => worldMap.tiles2D.get(vec.hash())!.pos)
      gameState.selectedCharacter.startMoving(path3D);
      gameState.turnStep = CharacterDoingAction;

    } else if (isClickPixelEvent(event)) {
      worldMap.tilesInformations = [];
      gameState.selectedCharacter = undefined;
      gameState.turnStep = BeginTurn;
    } if (isHoverEvent(event)) {
      if (event.tilePos == null || gameState.selectedCharacter == null) {
        return;
      }
    }
  }
} satisfies TurnStep;

const CharacterDoingAction = {
  handleEvent(event: GameEvent, worldMap: WorldMap, gameState: GameState) {
    if (isFinishActionEvent(event)) {
      gameState.turnStep = CharacterSelected;
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

  public handleEvent(event: GameEvent, worldMap: WorldMap) {
    this._turnStep.handleEvent(event, worldMap, this);
  }
}


