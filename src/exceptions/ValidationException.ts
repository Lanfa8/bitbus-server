export class ValidationException extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, ValidationException.prototype);
  }
}