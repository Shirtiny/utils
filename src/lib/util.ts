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
        const interceptor = (interceptors as any)[p];
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

// 异步管道
export const pipePromises = (...fns: Array<(v: any) => any>) => {
  return (input: any) =>
    fns
      .filter((fn) => lang.isFn(fn))
      .reduce((promise, fn) => promise.then(fn), Promise.resolve(input));
};

// 异步队列 顺序执行 可中断
export const quePromises = async (
  fns: Array<(v: any) => any>,
  args: any,
  isAbort: (result: any) => boolean,
) => {
  if (!Array.isArray(fns)) return;
  const validFns = fns.filter((fn) => lang.isFn(fn));
  let result = null;
  for (const fn of validFns) {
    result = await fn(args);
    if (isAbort?.(result)) {
      return result;
    }
  }
  return result;
};

// 深冻结函数。
export const deepFreeze = (obj: any) => {
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

/**
 * 从对象中去除值为 undefined 或 null 的字段，返回一个新对象。
 * 该方案兼容性良好，适用于不支持 ES2017 Object.fromEntries 的环境。
 */
const clean = (obj: any) => {
  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];
    // 使用 != null 同时排除 undefined 和 null
    if (value != null) {
      acc[key] = value;
    }
    return acc;
  }, {});
};

// 转驼峰
export const camelCase = (str: string) => {
  return String(str)
    .split(" ")
    .map((e, i) =>
      i
        ? e.charAt(0).toUpperCase() + e.slice(1).toLowerCase()
        : e.toLowerCase(),
    )
    .join("");
}; // "text That I WaNt to make cAMEL case" => "textThatIWantToMakeCamelCase"

const util = {
  sleep,
  sleepSync,
  serialize,
  memo,
  pipe,
  pipePromises,
  deepFreeze,
  camelCase,
  clean,
};

export default util;
