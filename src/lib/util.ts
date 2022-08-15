/*
 * @Author: Shirtiny
 * @Date: 2021-11-18 15:49:57
 * @LastEditTime: 2021-12-14 14:32:15
 * @Description:
 */

import lang from "./lang";

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const sleepSync = (milliseconds: number) => {
  const date = Date.now();
  let currentDate: number | null = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
};

export const serialize = (...args: any[]) => {
  return JSON.stringify(args, (_k, v) => (lang.isFn(v) ? String(v) : v));
};

export const memo = (
  func: Function,
  createKey?: Function,
): Function & { cache: Map<any, any> } => {
  const createKeyFn = createKey || serialize;
  const map = new Map<string, any>();
  const memoize = (...args: any[]) => {
    let key = "" + createKeyFn(...args);
    if (!map.get(key)) {
      try {
        const result = func(...args);
        map.set(key, result);
      } catch (e) {
        console.error(e);
        return undefined;
      }
    }
    return map.get(key);
  };
  memoize.cache = new Proxy(map, {
    get(target, p, receiver) {
      let methodOrValue = Reflect.get(target, p, receiver);
      p;
      if (lang.isFn(methodOrValue)) {
        const method = methodOrValue.bind(target);
        const interceptors = {
          get(...args: any[]) {
            return method(createKeyFn(...args));
          },
          set(...args: any[]) {
            const result = args.pop();
            return method(createKeyFn(...args), result);
          },
          delete(...args: any[]) {
            return method(createKeyFn(...args));
          },
        };
        const interceptor = interceptors[p];
        return interceptor || method;
      }

      return methodOrValue;
    },
  });
  return memoize;
};

export const pipe = (...fns: Function[]) => {
  return (input: any) => fns.reduce((r, fn) => fn(r), input);
};

export const pipePromises = (...fns: Array<(v: any) => any>) => {
  return (input: any) =>
    fns.reduce((promise, fn) => promise.then(fn), Promise.resolve(input));
};

// 深冻结函数。
export const deepFreeze = (obj: object) => {
  // 取回定义在 obj 上的属性名
  var propNames = Object.getOwnPropertyNames(obj);

  // 在冻结自身之前冻结属性
  propNames.forEach(function (name) {
    const prop = obj[name];

    // 如果 prop 是个对象，冻结它
    if (typeof prop == "object" && prop !== null) deepFreeze(prop);
  });

  // 冻结自身 (no-op if already frozen)
  return Object.freeze(obj);
};

const util = {
  sleep,
  sleepSync,
  serialize,
  memo,
  pipe,
  pipePromises,
  deepFreeze,
};

export default util;
