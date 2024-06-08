export class ValidationException extends Error {
  fields: string[] = [];

  constructor(message, fields = []) {
    super(message);
    this.name = this.constructor.name;
    this.fields = fields;
    Object.setPrototypeOf(this, ValidationException.prototype);
  }
}