import { Vec3D } from "../Vec3D";

export type PublisherEventType = "TimerEvent"
  | "ResizeEvent"
  | "ScaleEvent"
  | "GameStateEvent"
  | "EndMovementEvent"
  | "ClickEvent";

// TODO use "real" type instead of string + any
export type PublisherEvent = {
  data: any,
  eventType: PublisherEventType
}
