import { HttpError } from "routing-controllers";

export class ValidationError extends HttpError {
  public operationName: string;
  public args: any[];

  constructor(operationName: string = "400 ValidationError", args: any[] = []) {
    super(400);
    Object.setPrototypeOf(this, ValidationError.prototype);
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