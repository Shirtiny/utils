/*
 * @Author: Shirtiny
 * @Date: 2021-09-30 11:38:42
 * @LastEditTime: 2021-11-21 23:28:21
 * @Description:
 */

interface IDev {
  check(pwd: string): boolean;
  set(k: string, v: any): void;
  get(k: string, pwd: string): any;
}

const isSupportWeakRef = !!WeakRef || !!(global && global.WeakRef);

interface IData {
  name: string;
  value: any;
}

const map = isSupportWeakRef
  ? new Map<string, WeakRef<IData> | IData>()
  : new Map<string, IData>();

class Dev implements IDev {
  check(pwd: string): boolean {
    return pwd === process.env.PASSWORD;
  }

  set(k: string, v: any): void {
    const data: IData = {
      name: k,
      value: v,
    };
    map.set(k, isSupportWeakRef ? new WeakRef(data) : data);
  }

  get(k: string, pwd: string) {
    if (!this.check(pwd)) {
      return;
    }
    const data = map.get(k);
    return isSupportWeakRef
      ? (data as WeakRef<IData>).deref()?.value
      : (data as IData).value;
  }
}

const dev = new Dev();

export default dev;
