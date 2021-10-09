/*
 * @Author: Shirtiny
 * @Date: 2021-10-09 12:05:27
 * @LastEditTime: 2021-10-09 14:21:24
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
 * @description: 判断是否为未定义
 * @param {any} arg
 * @return {Boolean} -eg: arg is Object
 */
const isUndefined = (arg?: any): arg is undefined => typeof arg === "undefined";

/**
 * @description:判断是否为text节点的值
 * @param {any} arg
 * @return {Boolean} -eg: arg is number | string
 */
const isText = (arg?: any): arg is number | string =>
  typeof arg === "number" || typeof arg === "string";

const lang = {
  isFn,
  isObject,
  isUndefined,
  isText,
};

export default lang;
