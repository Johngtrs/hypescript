export class HttpError extends Error {
  public status: number;

  public constructor(status: number, msg: string) {
    super(msg);
    this.status = status;

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}