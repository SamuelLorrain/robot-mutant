import { PublisherEvent } from "./PublisherEvent";

export type Observer = {
  update(event: PublisherEvent): void;
}
