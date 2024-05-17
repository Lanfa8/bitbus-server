export class AlreadyCreatedRegister extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, AlreadyCreatedRegister.prototype);
  }
}