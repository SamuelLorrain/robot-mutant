import { Observer } from "@/common/behavioral/Observer";
import { Character } from "./Character";
import { PublisherEvent, PublisherEventType } from "@/common/behavioral/PublisherEvent";
import { Publisher } from "@/common/behavioral/Publisher";

type GameState =  "Active" | "Waiting";


export class GameStateProvider implements Publisher, Observer {
  private _gameState: GameState;
  public selectedCharacter?: Character;
  private _observers: Observer[];

  constructor() {
    this._gameState = "Active";
    this._observers = [];
    this.selectedCharacter = undefined;
  }

  public addObserver(observer: Observer) {
    this._observers.push(observer);
  }

  public notify() {
    for (const observer of this._observers) {
      observer.update({
        data: this._gameState,
        eventType: "GameStateEvent" as PublisherEventType
      });
    }
  }

  public update(event: PublisherEvent) {
    if (event.eventType === "EndMovementEvent") {
      this.gameState = "Active";
    }
  }

  public set gameState(gameState: GameState) {
    this._gameState = gameState;
    this.notify();
  }

  public get gameState() {
    return this._gameState;
  }
}
