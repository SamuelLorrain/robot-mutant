class CommonException extends Error {
  name: string = "CommonException";
}

export class QueueException extends CommonException {
  constructor(msg: string) {
    super(msg);
    this.name = "QueueException";
  }
}
