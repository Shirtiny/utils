/*
 * @Author: Shirtiny
 * @Date: 2021-09-30 17:29:18
 * @LastEditTime: 2021-10-09 12:09:34
 * @Description:
 */

import { format, getUnixTime } from "date-fns";
import lang from "./lang";

/**
 * @description: 获取unix时间戳
 * @return {Number}
 */
const unix = (date?: Date): number => {
  if (lang.isUndefined(date)) return Math.floor(Date.now() / 1000);
  return getUnixTime(date);
};

const isExpired = (unixTime: number) => {
  // 传入的时间 小于现在的时间
  return unixTime - unix() < 0;
};

const fromUnixTime = (unixTime: number) => {
  return new Date(unixTime * 1000);
};

const formatUnixTime = (
  unixTime: number,
  pattern = "yyyy-MM-dd HH:mm:ss xx",
) => {
  return format(fromUnixTime(unixTime), pattern);
};

const date = {
  unix,
  isExpired,
  fromUnixTime,
  formatUnixTime,
};

export default date;
