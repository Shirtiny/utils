/*
 * @Author: Shirtiny
 * @Date: 2022-01-11 11:51:04
 * @LastEditTime: 2022-01-11 11:54:00
 * @Description:
 */
function fixStack(target: Error, fn: Function = target.constructor) {
  const captureStackTrace: Function = (Error as any).captureStackTrace;
  captureStackTrace && captureStackTrace(target, fn);
}

class CustomError extends Error {
  name!: string;

  constructor(message?: string) {
    super(message);

    Object.defineProperty(this, "name", {
      value: new.target.name,
      enumerable: false,
      configurable: true,
    });
    Object.setPrototypeOf(this, new.target.prototype);
    fixStack(this);
  }

  toString() {
    return `Error: ${this.message}, ${new Error().stack}`;
  }
}

export { CustomError };
