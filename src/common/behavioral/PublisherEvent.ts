export type PublisherEventType = "TimerEvent"
  | "ResizeEvent"
  | "ScaleEvent"
  | "DragEvent"
  | "ClickEvent";

// TODO use "real" type instead of string + any
export type PublisherEvent = {
  data: any,
  eventType: PublisherEventType
}
