import { PriorityQueueException } from "./exceptions";
import { Hash } from "./Hash";

export class PriorityQueueHash {
  private _content: [Hash, number][];

  constructor() {
    this._content = [];
  }

  public enqueue(el: Hash, priority: number) {
    var inserted = false;

    for (let i = 0; i < this._content.length; i++) {
      if (this._content[i][1] > priority) {
        this._content.splice(i, 0, [el, priority]);
        inserted = true;
        break;
      }
    }

    if (!inserted) {
      this._content.push([el, priority]);
    }
  }

  public dequeue(): [Hash, number] {
    const el = this._content.shift();
    if (el == null) {
      throw new PriorityQueueException("Priority queue is empty");
    }
    return el;
  }

  public length() {
    return this._content.length;
  }

  public empty() {
    return this._content.length == 0;
  }
}
