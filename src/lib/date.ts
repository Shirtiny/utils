/*
 * @Author: Shirtiny
 * @Date: 2021-09-30 17:29:18
 * @LastEditTime: 2021-11-03 09:24:30
 * @Description:
 */

import {
  format,
  getUnixTime,
  add,
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

const isSame = (time1: Time, time2: Time, type: keyof typeof sameTypes) => {
  if (!sameTypes[type]) {
    throw new Error(`@shirtiny-utils date.isSame unsupported type: ${type}`);
  }
  return sameTypes[type](time1, time2);
};

const date = {
  unix,
  isExpired,
  fromUnixTime,
  formatTime,
  getIntervalDates,
  isSame,
};

export default date;
