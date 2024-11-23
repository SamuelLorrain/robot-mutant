export type PublisherEventType = "TimerEvent" | "ResizeEvent" | "ScaleEvent";

export type PublisherEvent = {
  data: any,
  eventType: PublisherEventType
}
