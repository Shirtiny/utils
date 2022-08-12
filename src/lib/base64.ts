/*
 * @Author: Shirtiny
 * @Date: 2022-01-14 16:01:01
 * @LastEditTime: 2022-01-17 12:09:06
 * @Description:
 */

import logger from "../utils/logger";

/**
 * @description 字节数组转字符串
 * @param {Iterable<number>} buffer
 * @param {boolean} noEncode 不使用utf8解码
 * @returns {string}
 */
export const ab2str = (
  buffer: Iterable<number>,
  noEncode: boolean = false,
): string => {
  const arr = new Uint8Array(buffer);
  return noEncode
    ? String.fromCharCode(...arr)
    : new TextDecoder().decode(arr.buffer);
};

/**
 * @description 字符串转字节数组
 * @param {string} str
 * @param {boolean} noEncode 不使用utf8解码
 * @returns {Uint8Array} Uint8Array
 */
export const str2ab = (str: string, noEncode: boolean = false): Uint8Array => {
  if (noEncode) {
    const buffer = new ArrayBuffer(str.length);
    const bufferView = new Uint8Array(buffer);
    for (let i = 0, len = str.length; i < len; i++) {
      bufferView[i] = str.charCodeAt(i);
    }
    return bufferView;
  }

  return new Uint8Array(new TextEncoder().encode(str).buffer);
};

/**
 * @description 字节数组转Base64
 * @param {Iterable<number>} buffer
 * @returns {string}
 */
export const ab2Base64 = (buffer: Iterable<number>): string => {
  const str = ab2str(buffer, true);
  return window.btoa(str);
};

/**
 * @description base64字符串转字节数组
 * @param {string} base64Input base64字符串
 * @returns {Uint8Array} Uint8Array
 */
export const base642ab = (base64Input: string): Uint8Array => {
  const str = window.atob(base64Input);
  return str2ab(str, true);
};

/**
 * @description 转为base64字符串
 * @param {string} str 字符串
 * @returns {string} base64字符串
 */
export const toBase64 = (str: string): string => {
  const ab = str2ab(str);
  return ab2Base64(ab);
};

/**
 * @description 从base64字符串解析
 * @param {string} base64Input base64字符串
 * @returns {string} 字符串
 */
export const fromBase64 = (base64Input: string): string => {
  const ab = base642ab(base64Input);
  return ab2str(ab);
};

/**
 * @description 填充base64后的等号
 * @param {string} base64Input base64字符串
 * @returns {string}
 */
export const padSuffix = (base64Input: string): string => {
  let num = 0;
  const mo = base64Input.length % 4;
  switch (mo) {
    case 3:
      num = 1;
      break;
    case 2:
      num = 2;
      break;
    case 0:
      num = 0;
      break;
    default:
      logger.error(
        "base64",
        "padSuffix",
        "无效的base64Url长度",
        base64Input,
        mo,
      );
      return "";
  }

  return base64Input + "=".repeat(num);
};

/**
 * @description 移除base64后的等号
 * @param {string} base64Input base64字符串
 * @returns {string}
 */
export const removeSuffix = (base64Input: string): string => {
  const pos = base64Input.indexOf("=");
  return pos > 0 ? base64Input.slice(0, pos) : base64Input;
};

/**
 * @description 将base64转为ur传输安全的格式 base64 url_safe
 * @param {string} base64Input base64字符串
 * @returns {string}
 */
export const toUrlSafe = (base64Input: string): string => {
  const str = base64Input.replace(/\+/g, "-").replace(/\//g, "_");
  return removeSuffix(str);
};

/**
 * @description 从base64 url_safe 转为base64
 * @param {string} base64Input base64字符串
 * @returns {string}
 */
export const fromUrlSafe = (base64Input: string): string => {
  const str = base64Input.replace(/-/g, "+").replace(/_/g, "/");
  return padSuffix(str);
};

/**
 * @description 将字符串转为base64 url_safe
 * @param {string} base64Input base64字符串
 * @returns {string}
 */
export const toBase64Url = (str: string): string => toUrlSafe(toBase64(str));

/**
 * @description 从base64 url_safe解析
 * @param {string} base64UrlInput base64 url_safe字符串
 * @returns {string}
 */
export const fromBase64url = (base64UrlInput: string): string => {
  return fromBase64(fromUrlSafe(base64UrlInput));
};

const base64 = {
  ab2str,
  str2ab,
  ab2Base64,
  base642ab,
  toBase64,
  fromBase64,
  padSuffix,
  removeSuffix,
  toUrlSafe,
  fromUrlSafe,
  toBase64Url,
  fromBase64url,
};

export default base64;
