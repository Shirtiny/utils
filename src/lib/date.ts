/*
 * @Author: Shirtiny
 * @Date: 2021-09-30 17:29:18
 * @LastEditTime: 2021-09-30 17:53:07
 * @Description:
 */

/**
 * @description: 获取unix时间戳
 * @return {Number}
 */
const unix = (): number => {
  return Math.floor(Date.now() / 1000);
};

const fromUnix = (unix: number) => {
  return new Date(unix);
};

const isExpired = (unixTime: number) => {
  // 传入的时间 小于现在的时间
  return unixTime - unix() < 0;
};

const date = {
  unix,
  fromUnix,
  isExpired,
};

export default date;
