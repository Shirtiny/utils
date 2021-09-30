/*
 * @Author: Shirtiny
 * @Date: 2021-09-30 11:38:42
 * @LastEditTime: 2021-09-30 14:19:50
 * @Description:
 */

interface IDev {
  check(pwd: string): boolean;
  set(k: string, v: any): void;
  get(k: string, pwd: string): any;
}

class Dev implements IDev {
  private _map = new Map();

  check(pwd: string): boolean {
    return pwd === "123456";
  }

  set(k: string, v: any): void {
    this._map.set(k, v);
  }

  get(k: string, pwd: string) {
    if (!this.check(pwd)) {
      return;
    }
    return this._map.get(k);
  }
}

const dev = new Dev();

export default dev;
