import { Observer } from "@/common/behavioral/Observer";
import { Character } from "./Character";
import { PublisherEvent, PublisherEventType } from "@/common/behavioral/PublisherEvent";
import { Publisher } from "@/common/behavioral/Publisher";

type GameState =  "Player1Turn"
  | "Player1Waiting"
  | "Player2Turn"
  | "Player2Waiting";


export class GameStateProvider implements Publisher, Observer {
  private _gameState: GameState;
  public selectedCharacter?: Character;
  private _observers: Observer[];

  constructor() {
    this._gameState = "Player1Turn";
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
      this.nextState();
    }
  }

  public set gameState(gameState: GameState) {
    this._gameState = gameState;
    this.notify();
  }

  public nextState() {
    switch(this._gameState) {
      case "Player1Turn":
        this._gameState = "Player1Waiting";
        break;
      case "Player1Waiting":
        this._gameState = "Player2Turn";
        break;
      case "Player2Turn":
        this._gameState = "Player2Waiting";
        break;
      case "Player2Waiting":
        this._gameState = "Player1Turn";
        break;
    }
  }

  public get isWaiting() {
    return this._gameState === "Player1Waiting" || this._gameState === "Player2Waiting";
  }

  public get isActive() {
    return this._gameState === "Player1Turn" || this._gameState === "Player2Turn";
  }

  public get gameState() {
    return this._gameState;
  }
}
