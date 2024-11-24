export type PublisherEventType = "TimerEvent"
  | "ResizeEvent"
  | "ScaleEvent"
  | "GameStateEvent";

export type PublisherEvent = {
  data: any,
  eventType: PublisherEventType
}
