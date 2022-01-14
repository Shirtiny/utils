/*
 * @Author: Shirtiny
 * @Date: 2022-01-14 16:01:01
 * @LastEditTime: 2022-01-14 18:49:00
 * @Description:
 */

import logger from "../utils/logger";

/**
 *  字节数组转字符串
 * @param {Iterable<number>} buffer
 * @returns {string}
 */
const ab2str = (buffer: Iterable<number>): string => {
  return String.fromCharCode(...new Uint8Array(buffer));
};

/**
 * 字符串转字节数组
 * @param {string} str
 * @returns {Uint8Array} Uint8Array
 */
const str2ab = (str: string): Uint8Array => {
  // const buffer = new ArrayBuffer(str.length);
  // const bufferView = new Uint8Array(buffer);
  // for (let i = 0, len = str.length; i < len; i++) {
  //   bufferView[i] = str.charCodeAt(i);
  // }
  return new Uint8Array(new TextEncoder().encode(str).buffer);
};

/**
 * 扩展base64后缀
 * @param input base64字符串
 * @returns
 */
const padSuffix = (input: string): string => {
  let num = 0;
  const mo = input.length % 4;
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
      logger.error("base64", "padSuffix", "无效的base64Url长度", input, mo);
      return "";
  }

  return input + "=".repeat(num);
};

/**
 *  字节数组转Base64
 * @param {Iterable<number>} buffer
 * @returns {string}
 */
const ab2Base64 = (buffer: Iterable<number>): string =>
  window.btoa(ab2str(buffer));

const base64 = { ab2str, str2ab, padSuffix, ab2Base64 };

export default base64;
