/*
 * @Author: Shirtiny
 * @Date: 2021-09-30 17:29:18
 * @LastEditTime: 2021-11-08 15:09:28
 * @Description:
 */

import {
  format,
  getUnixTime,
  startOfSecond,
  startOfMinute,
  startOfHour,
  startOfDay,
  startOfWeek,
  startOfMonth,
  startOfYear,
  endOfSecond,
  endOfMinute,
  endOfHour,
  endOfDay,
  endOfWeek,
  endOfMonth,
  endOfYear,
  eachDayOfInterval,
  eachHourOfInterval,
  eachMinuteOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  eachYearOfInterval,
  isSameSecond,
  isSameMinute,
  isSameHour,
  isSameDay,
  isSameWeek,
  isSameMonth,
  isSameYear,
  isDate,
  add,
  sub,
  min,
  max,
  Duration,
} from "date-fns";
import lang from "./lang";

// type TimeTypes =
//   | "Second"
//   | "Minute"
//   | "Hour"
//   | "Day"
//   | "Week"
//   | "Month"
//   | "Year";

type Time = Date | number;

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

const formatTime = (time: Time, pattern = "yyyy-MM-dd HH:mm:ss xx") => {
  if (isDate(time)) {
    return format(time, pattern);
  }
  if (lang.isNumber(time)) {
    return format(fromUnixTime(time), pattern);
  }
  return time + "";
};

const intervalTypes = {
  days: eachDayOfInterval,
  hours: eachHourOfInterval,
  minutes: eachMinuteOfInterval,
  months: eachMonthOfInterval,
  weeks: eachWeekOfInterval,
  years: eachYearOfInterval,
};

// 获取一个date数组 传入起始date 和 时长（时长内的值可为负值）
const getIntervalDates = (
  startDate: Date,
  duration: Duration,
  type: keyof typeof intervalTypes,
) => {
  const dates = [startDate, add(startDate, duration)];

  return intervalTypes[type]
    ? intervalTypes[type]({
        start: min(dates),
        end: max(dates),
      })
    : [];
};

const sameTypes = {
  second: isSameSecond,
  minute: isSameMinute,
  hour: isSameHour,
  day: isSameDay,
  week: isSameWeek,
  month: isSameMonth,
  year: isSameYear,
};

/**
 * @description: 确定两个时间是否在同一 秒/分/时/天/周/月/年
 * @param {Time} time1
 * @param {Time} time2
 * @param {String} type 判断类型，天、年等
 * @param {Boolean} isSeconds 输入的time为数字时 是否是秒数
 * @return {*}
 */
const isSame = (
  time1: Time,
  time2: Time,
  type: keyof typeof sameTypes,
  isSeconds = false,
) => {
  let t1 = time1;
  let t2 = time2;
  if (isSeconds) {
    lang.isNumber(t1) && (t1 *= 1000);
    lang.isNumber(t2) && (t2 *= 1000);
  }
  if (!sameTypes[type]) {
    throw new Error(`@shirtiny-utils date.isSame unsupported type: ${type}`);
  }
  return sameTypes[type](t1, t2);
};

// date-fns
const fns = {
  format,
  getUnixTime,
  startOfSecond,
  startOfMinute,
  startOfHour,
  startOfDay,
  startOfWeek,
  startOfMonth,
  startOfYear,
  endOfSecond,
  endOfMinute,
  endOfHour,
  endOfDay,
  endOfWeek,
  endOfMonth,
  endOfYear,
  eachDayOfInterval,
  eachHourOfInterval,
  eachMinuteOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  eachYearOfInterval,
  isSameSecond,
  isSameMinute,
  isSameHour,
  isSameDay,
  isSameWeek,
  isSameMonth,
  isSameYear,
  isDate,
  add,
  sub,
  min,
  max,
};

const date = {
  unix,
  fromUnixTime,
  formatTime,
  getIntervalDates,
  isExpired,
  isSame,
  fns,
};

export default date;
