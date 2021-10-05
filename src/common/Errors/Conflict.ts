import { HttpError } from "routing-controllers";

export class ConflictError extends HttpError {
  public operationName: string;
  public args: any[];

  constructor(operationName: string = "409 Conflict", args: any[] = []) {
    super(400);
    Object.setPrototypeOf(this, ConflictError.prototype);
    this.operationName = operationName;
    this.args = args
  }

  toJSON() {
    return {
      status: this.httpCode,
      failedOperation: this.operationName,
    };
  }
}