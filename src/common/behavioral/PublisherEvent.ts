export type PublisherEventType = "TimerEvent"
  | "ResizeEvent"
  | "ScaleEvent"
  | "GameStateEvent"
  | "EndMovementEvent";

// TODO use "real" type instead of string + any
export type PublisherEvent = {
  data: any,
  eventType: PublisherEventType
}
