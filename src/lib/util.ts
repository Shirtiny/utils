/*
 * @Author: Shirtiny
 * @Date: 2021-11-18 15:49:57
 * @LastEditTime: 2021-11-28 16:58:03
 * @Description:
 */

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const sleepSync = (milliseconds: number) => {
  const date = Date.now();
  let currentDate: number | null = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
};

const memo = (func: Function, createHash?: Function): Function => {
  const memoize = (key: any) => {
    let cache = memoize.cache;
    let address = "" + (createHash ? createHash() : key);
    if (!cache[address]) cache[address] = func();
    return cache[address];
  };
  memoize.cache = {};
  return memoize;
};

const pipe = (...fns: Function[]) => {
  return (input: any) => fns.reduce((r, fn) => fn(r), input);
};

const pipePromises = (...fns: Array<(v: any) => any>) => {
  return (input: any) =>
    fns.reduce((promise, fn) => promise.then(fn), Promise.resolve(input));
};

const util = {
  sleep,
  sleepSync,
  memo,
  pipe,
  pipePromises
};

export default util;
