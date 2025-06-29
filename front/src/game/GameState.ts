import { Vec2D } from "@/common/Vec2D";
import { Character } from "./Character";
import { GameEvent, isClickPixelEvent, isClickTileEvent, isFinishActionEvent, isHoverEvent } from "./events/GameEvent";
import { GameStateException } from "./exceptions";
import { tiles3DToGraph2D } from "./TilesToGraph";
import { WorldMap } from "./WorldMap";
import { Tile } from "./Tile";
import { Team } from "./Teams";

export type TurnStep = {
  handleEvent(event: GameEvent, worldMap: WorldMap, gameState: GameState): void;
}

export const BeginTurn = {
  handleEvent(event: GameEvent, worldMap: WorldMap, gameState: GameState) {
    if (isClickTileEvent(event)) {
      const character = worldMap.characters.find(character => character.pos.eq(event.tilePos));
      if (character == null || !gameState.activeTeam.hasCharacter(character)) {
        worldMap.tilesInformations = new Map();
        return;
      }
      worldMap.getCharacterRangeTiles(character, character.currentMoveAvailable);
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
        worldMap.tilesInformations = new Map();
        gameState.selectedCharacter = undefined;
        gameState.turnStep = BeginTurn;
        return;
      }
      if (gameState.selectedCharacter == null) {
        throw new GameStateException("Character can't be null or undefined when game is in 'CharacterSelected' state.")
      }
      if (worldMap.currentPathArray.length === 0) {
        return;
      }
      const path = worldMap.currentPathArray.map(tile => tile.pos);
      gameState.selectedCharacter.startMoving(path);
      gameState.selectedCharacter.currentMoveAvailable -= path.length;
      gameState.turnStep = CharacterDoingAction;

    } else if (isClickPixelEvent(event)) {
      worldMap.tilesInformations = new Map();
      gameState.selectedCharacter = undefined;
      gameState.turnStep = BeginTurn;
    } if (isHoverEvent(event)) {
      if (event.tilePos == null || gameState.selectedCharacter == null) {
        worldMap.currentPath = [];
        return;
      }
      const graph = tiles3DToGraph2D(worldMap.tilesInformations);
      if (!graph.has(new Vec2D(event.tilePos.x, event.tilePos.y).hash())) {
        worldMap.currentPath = [];
        return;
      }
      const characterPos = new Vec2D(gameState.selectedCharacter.pos.x, gameState.selectedCharacter.pos.y);
      const path = graph.getPath(characterPos, new Vec2D(event?.tilePos.x, event.tilePos.y));
      if (path.length === 0) {
        worldMap.currentPath = [];
        return;
      }
      const path3D: Tile[] = path.map(vec => worldMap.tiles2D.get(vec.hash())!)
      worldMap.currentPath = path3D;
    }
  }
} satisfies TurnStep;

const CharacterDoingAction = {
  handleEvent(event: GameEvent, worldMap: WorldMap, gameState: GameState) {
    if (isFinishActionEvent(event)) {
      const character = gameState.selectedCharacter;
      if (character == null) {
        throw new GameStateException("A character should be selected while doing action");
      }
      worldMap.getCharacterRangeTiles(character, character.currentMoveAvailable);
      worldMap.currentPath = [];
      gameState.turnStep = CharacterSelected;
    }
  }
} satisfies TurnStep;

export class GameState {
  private _selectedCharacter?: Character;
  private _turnStep: TurnStep;
  private _teams: Team[];
  private _activeTeam: number;

  constructor(teams: Team[], activeTeam: number) {
    this._selectedCharacter = undefined;
    this._turnStep = BeginTurn;
    this._teams = teams;
    this._activeTeam = activeTeam;
  }

  public get teams() {
    return this._teams;
  }

  public get activeTeam(): Team {
    return this._teams[this._activeTeam];
  }

  public set activeTeams(activeTeam: number) {
    if (activeTeam >= this.teams.length) {
      throw new GameStateException("activeTeam should be an existing team");
    }
    this._activeTeam = activeTeam;
  }

  public set turnStep(step: TurnStep) {
    this._turnStep = step;
  }

  public get turnStep() {
    return this._turnStep;
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

