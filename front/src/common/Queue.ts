import { QueueException } from "./exceptions";

export class Queue<T> {
  private _content: T[];

  constructor() {
    this._content = [];
  }

  public enqueue(el: T) {
    this._content.push(el);
  }

  public peek(): T {
    return this._content[0];
  }

  public dequeue(): T {
    const el: T|undefined = this._content.shift();
    if (el == null) {
      throw new QueueException("The queue is empty");
    }
    return el;
  }

  public length(): number {
    return this._content.length;
  }

  public empty(): boolean {
    return this._content.length == 0;
  }
}
