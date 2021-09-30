/*
 * @Author: Shirtiny
 * @Date: 2021-04-27 10:41:10
 * @LastEditTime: 2021-09-30 18:00:56
 * @Description:
 */
import date from "./date";

interface IStorageData {
  value: any;
  expire?: number;
}

/**
 * 存储到本地
 * @param {String} key 键
 * @param {any} value 值
 * @param {number} expire 到期时间戳
 */
const set = (key: string, value: any, expire: number) => {
  const data: IStorageData = {
    value,
    expire,
  };
  const json = JSON.stringify(data);
  localStorage.setItem(key, json);
  return data;
};

/**
 * 存储到本地 设置多少秒后过期
 * @param {String} key 键
 * @param {any} value 值
 * @param {number} timeoutSeconds 秒数
 */
const setTimeout = (
  key: string,
  value: object | string,
  timeoutSeconds: number,
) => {
  const nowUnixSecond = date.unix();
  const expire = nowUnixSecond + timeoutSeconds;
  return set(key, value, expire);
};

/**
 * 从本地读取 未读取到或者过期 则返回null
 * @param {String} key 键
 * @param {Boolean} origin 是否取出原值
 */
const get = (key: string, origin?: boolean): any => {
  const dataJson = localStorage.getItem(key);
  if (!dataJson) return null;
  try {
    const data: IStorageData = JSON.parse(dataJson);
    // 取原始数据 不管是否过期
    if (origin) return data;
    // 数据的expire为空或者为0 则表示永久有效 直接返回
    if (!data.expire) return data.value;
    // 判断数据是否过期
    const isExpired = date.isExpired(data.expire);
    // 小于现在 表示已经过期 返回null
    if (isExpired) {
      return null;
    } else {
      return data.value;
    }
  } catch (error) {
    console.log(error, dataJson, "Storage读取数据时， JSON解析出错");
  }
};

const remove = (key: string) => {
  return localStorage.removeItem(key);
};

const storage = {
  set,
  setTimeout,
  get,
  remove,
};

export default storage;
