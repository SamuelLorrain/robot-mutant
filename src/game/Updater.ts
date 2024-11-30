import { Sprite } from "@/ui/Sprite";
import { WorldMap } from "./WorldMap";
import { ClickEvent, isClickPixelEvent, isClickTileEvent, Selector } from "./Selector";
import { GameState } from "./GameState";

export class Updater {
  private _sprites: Sprite[];
  // TODO makes it mandatory
  private _worldmap?: WorldMap;
  private _gameState: GameState;
  private readonly _selector: Selector;

  constructor(selector: Selector, gameState: GameState) {
    this._sprites = [];
    this._gameState = gameState;
    this._selector = selector;
  }

  public set sprites(sprites: Sprite[]) {
    this._sprites = sprites;
  }

  public set worldmap(worldMap: WorldMap) {
    this._worldmap = worldMap;
  }

  public update(db: DOMHighResTimeStamp) {
    this._handleSelectorEvents();
    for(const sprite of this._sprites) {
      sprite.updateTimeline(db);
    }
    this._worldmap?.update(
      this._selector.hoverTile?.tile.pos
    );
  }

  private _handleSelectorEvents() {
    while (this._selector.hasPendingEvent()) {
      const event: ClickEvent = this._selector.getEvent();
      if (isClickTileEvent(event)) {
        const character = this._worldmap?.characters.get(event.tile.hash());
        this._gameState.selectedCharacter = character;
      } else if (isClickPixelEvent(event)) {
        this._gameState.selectedCharacter = undefined;
      }
    }
  }
}
