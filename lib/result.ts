export class Result<T, E> {
  _result?: T | undefined;
  _err?: E | undefined;

  constructor(result: T | undefined, err: E | undefined) {
    this._result = result;
    this._err = err;
  }
  isOk() {
    return this._result != undefined;
  }
  isErr() {
    return !this.isOk();
  }

  unwrap() {
    if (this._result != undefined) {
      return this._result;
    } else {
      throw new Error("Unwrapping error result.");
    }
  }
}

export function Ok<T, E>(value: T): Result<T, E> {
  return new Result(value, undefined as unknown as E);
}

export function Err<T, E>(value: E): Result<T, E> {
  return new Result(undefined as unknown as T, value);
}
