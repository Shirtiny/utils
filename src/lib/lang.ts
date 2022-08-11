/*
 * @Author: Shirtiny
 * @Date: 2021-10-09 12:05:27
 * @LastEditTime: 2021-12-14 13:36:18
 * @Description:
 */

/**
 * @description: 判断是否为函数
 * @param {any} arg
 * @return {Boolean} -eg: arg is Function
 */
const isFn = (arg?: any): arg is Function => typeof arg === "function";

/**
 * @description: 判断是否为对象
 * @param {any} arg
 * @return {Boolean} -eg: arg is Object
 */
const isObject = (arg?: any): arg is Object => arg instanceof Object;

/**
 * @description: 判断是否为数组
 * @param {any} arg
 * @return {Boolean} -eg: arg is Array
 */
const isArray = Array.isArray;

/**
 * @description: 判断是否为布尔
 * @param {any} arg
 * @return {Boolean} -eg: arg is Boolean
 */
const isBoolean = (arg?: any): arg is boolean => typeof arg === "boolean";

/**
 * @description: 判断是否为未定义
 * @param {any} arg
 * @return {Boolean} -eg: arg is Object
 */
const isUndefined = (arg?: any): arg is undefined => typeof arg === "undefined";

/**
 * @description: 判断是否为null或者未定义
 * @param {any} arg
 * @return {Boolean} -eg: arg is null | undefined
 */
const isNullOrUndefined = (arg?: any): arg is null | undefined => {
  if (arg) return false;
  return !!(arg ?? true);
};

/**
 * @description:判断是否为数字
 * @param {any} arg
 * @return {Boolean} -eg: arg is number
 */
const isNumber = (arg?: any): arg is number => typeof arg === "number";

/**
 * @description:判断是否为字符串
 * @param {any} arg
 * @return {Boolean} -eg: arg is string
 */
const isString = (arg?: any): arg is string => typeof arg === "string";

/**
 * @description:判断是否为text节点的值
 * @param {any} arg
 * @return {Boolean} -eg: arg is number | string
 */
const isText = (arg?: any): arg is number | string =>
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
  isText,
};

export default lang;
