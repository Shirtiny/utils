/*
 * @Author: Shirtiny
 * @Date: 2021-10-09 12:05:27
 * @LastEditTime: 2021-12-14 13:36:18
 * @Description:
 */

const toString = Object.prototype.toString

export function getTag(value: any) {
  if (value == null) {
    return value === undefined ? '[object Undefined]' : '[object Null]'
  }
  return toString.call(value)
}


export const isFn = (arg?: any): arg is Function => typeof arg === "function";


export const isObject = (arg?: any): arg is object => {
  const type = typeof arg
  return arg != null && (type === 'object' || type === 'function')
};

export const isObjectLike = (arg?: any): boolean => {
  return typeof arg === 'object' && arg !== null
}

export const isArray = Array.isArray;

export const isBoolean = (arg?: any): arg is boolean => {
  return arg === true || arg === false || (isObjectLike(arg) && getTag(arg) == '[object Boolean]');
}

export const isUndefined = (arg?: any): arg is undefined => arg === undefined


export const isNullOrUndefined = (arg?: any): arg is null | undefined => {
  if (arg) return false;
  return !!(arg ?? true);
};

/**
 * @description 与isNullOrUndefined相同
 * */
export const isNil = (arg: any): arg is null | undefined => arg == null

export const isNumber = (arg?: any): arg is number => {
  return typeof arg === 'number' ||
    (isObjectLike(arg) && getTag(arg) == '[object Number]')
};


export const isString = (arg?: any): arg is string => {
  const type = typeof arg
  return type === 'string' || (type === 'object' && arg != null && !Array.isArray(arg) && getTag(arg) == '[object String]')
};


export const isText = (arg?: any): arg is number | string =>
  isNumber(arg) || isString(arg);

const lang = {
  isFn,
  isBoolean,
  isObject,
  isArray,
  isUndefined,
  isNumber,
  isString,
  isNullOrUndefined,
  isText
};

export default lang;
