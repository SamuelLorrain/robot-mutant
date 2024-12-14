import { Sprite } from "@/ui/Sprite";
import { WorldMap } from "./WorldMap";
import { Selector } from "./Selector";

export class Updater {
  private _sprites: Sprite[];
  // TODO makes it mandatory
  private _worldmap?: WorldMap;
  private readonly _selector: Selector;

  constructor(selector: Selector) {
    this._sprites = [];
    this._selector = selector;
  }

  public set sprites(sprites: Sprite[]) {
    this._sprites = sprites;
  }

  public set worldmap(worldMap: WorldMap) {
    this._worldmap = worldMap;
  }

  public updateTimeline(dt: DOMHighResTimeStamp) {
    for(const sprite of this._sprites) {
      sprite.updateTimeline(dt);
    }
    this._worldmap?.update(
      this._selector.hoverTile?.tile.pos,
      dt
    );
  }

}
