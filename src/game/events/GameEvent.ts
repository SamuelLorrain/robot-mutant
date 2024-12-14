import { Vec2D } from "@/common/Vec2D";
import { Vec3D } from "@/common/Vec3D";

export interface GameEvent {
  kind: string;
}

export interface FinishActionEvent {
  kind: "FinishActionEvent"
}

export interface ClickEvent extends GameEvent {
  tilePos?: Vec3D;
  pixel?: Vec2D;
  kind: string;
};

export interface ClickTileEvent extends ClickEvent {
  tilePos: Vec3D;
  pixel: Vec2D;
  kind: "ClickTileEvent";
};

export interface ClickPixelEvent extends ClickEvent {
  pixel: Vec2D;
  kind: "ClickPixelEvent";
};

export const isClickTileEvent = (gameEvent: ClickEvent): gameEvent is ClickTileEvent => {
  return gameEvent.kind == "ClickTileEvent";
}

export const isClickPixelEvent = (gameEvent: ClickEvent): gameEvent is ClickPixelEvent => {
  return gameEvent.kind == "ClickPixelEvent";
}

export const isFinishActionEvent = (gameEvent: GameEvent): gameEvent is FinishActionEvent => {
  return gameEvent.kind == "FinishActionEvent";
}
