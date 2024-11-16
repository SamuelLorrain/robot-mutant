class CommonException extends Error {
  name: string = "CommonException";
}

export class QueueException extends CommonException {
  constructor(msg: string) {
    super(msg);
    this.name = "QueueException";
  }
}

export class PriorityQueueException extends CommonException {
  constructor(msg: string) {
    super(msg);
    this.name = "PriorityQueueException";
  }
}

export class GraphException extends CommonException {
  constructor(msg: string) {
    super(msg);
    this.name = "GraphException";
  }
}
