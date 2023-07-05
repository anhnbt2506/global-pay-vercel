export class KnownError extends Error {
  /* istanbul ignore next */
  constructor(name: string, message = '') {
    super(message);
    this.name = name;
    this.message = message || name;
  }
}
