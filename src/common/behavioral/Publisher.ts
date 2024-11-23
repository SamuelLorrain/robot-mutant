import { Observer } from "./Observer";

export type Publisher = {
  addObserver(observer: Observer): void;
}
