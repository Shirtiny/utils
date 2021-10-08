/*
 * @Author: Shirtiny
 * @Date: 2021-09-30 17:29:18
 * @LastEditTime: 2021-10-08 17:38:08
 * @Description:
 */

import { format } from "date-fns";

/**
 * @description: 获取unix时间戳
 * @return {Number}
 */
const unix = (): number => {
  return Math.floor(Date.now() / 1000);
};

const isExpired = (unixTime: number) => {
  // 传入的时间 小于现在的时间
  return unixTime - unix() < 0;
};

const fromUnixTime = (unixTime: number) => {
  return new Date(unixTime * 1000);
};

const formatUnixTime = (unixTime: number, pattern = "yyyy-MM-dd HH:mm:ss xx") => {
  return format(fromUnixTime(unixTime), pattern);
};

const date = {
  unix,
  isExpired,
  fromUnixTime,
  formatUnixTime,
};

export default date;
