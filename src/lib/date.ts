/*
 * @Author: Shirtiny
 * @Date: 2021-09-30 17:29:18
 * @LastEditTime: 2021-11-28 16:40:09
 * @Description:
 */

import {
  format,
  getUnixTime,
  formatDistance,
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
  toDate,
  add,
  sub,
  min,
  max,
  millisecondsInHour,
  millisecondsInMinute,
  millisecondsInSecond,
  Duration,
} from "date-fns";
import lang from "./lang";
import logger from "../utils/logger";

const LibName = "date";

// type TimeTypes =
//   | "second"
//   | "minute"
//   | "hour"
//   | "day"
//   | "week"
//   | "month"
//   | "year";

// date 或者 unix秒数
type Time = Date | number;

// 时分秒对应的毫秒数  顺序不可变
const MILLISECONDS_IN = {
  HOURS: millisecondsInHour,
  MINUTES: millisecondsInMinute,
  SECONDS: millisecondsInSecond,
};

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

const timeToDate = (time: Time): Date => {
  if (isDate(time)) {
    return time as Date;
  }
  if (lang.isNumber(time)) {
    return fromUnixTime(time);
  }
  logger.warn(LibName, "timeToDate", `doesn't accept ${time} as arguments`);
  return new Date(NaN);
};

const formatTime = (time: Time, pattern = "yyyy-MM-dd HH:mm:ss xx") => {
  const date = timeToDate(time);
  return format(date, pattern);
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
  start: Time,
  duration: Duration,
  type: keyof typeof intervalTypes,
) => {
  const startDate = timeToDate(start);
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
 * @return {Boolean}
 */
const isSame = (
  time1: Time,
  time2: Time,
  type: keyof typeof sameTypes,
): boolean => {
  let t1 = timeToDate(time1);
  let t2 = timeToDate(time2);
  if (!sameTypes[type]) {
    throw new Error(`@shirtiny-utils date.isSame unsupported type: ${type}`);
  }
  return sameTypes[type](t1, t2);
};

// https://github.dev/date-fns/date-fns/blob/f8fb243c55853f90d04efd8933fc291a24402b27/src/formatDistance/index.ts#L199
type DistanceTypes =
  | "lessThanXSeconds"
  | "halfAMinute"
  | "lessThanXMinutes"
  | "xMinutes"
  | "aboutXHours"
  | "xDays"
  | "aboutXMonths"
  | "xMonths"
  | "aboutXYears"
  | "overXYears"
  | "almostXYears";

type DistanceFormatter = (
  date1: Date,
  date2: Date,
  upTo: number,
  format: (date: Date) => string,
) => string;

type DistanceFormattersFactory = Record<DistanceTypes, DistanceFormatter>;

const defaultDistanceFormattersFactory: DistanceFormattersFactory = {
  lessThanXSeconds: (d) => formatTime(d, "HH:mm:ss"),
  halfAMinute: (d) => formatTime(d, "HH:mm:ss"),
  lessThanXMinutes: (d) => formatTime(d, "HH:mm:ss"),
  xMinutes: (d) => formatTime(d, "HH:mm:ss"),
  aboutXHours: (d) => formatTime(d, "HH:mm:ss"),
  xDays: (d) => formatTime(d, "MM-dd HH:mm:ss"),
  aboutXMonths: (d) => formatTime(d, "MM-dd HH:mm:ss"),
  xMonths: (d) => formatTime(d, "MM-dd HH:mm:ss"),
  aboutXYears: (d) => formatTime(d, "yyyy-MM-dd HH:mm:ss"),
  overXYears: (d) => formatTime(d, "yyyy-MM-dd HH:mm:ss"),
  almostXYears: (d) => formatTime(d, "yyyy-MM-dd HH:mm:ss"),
};

const formatTimeByDistance = (
  time1: Time,
  time2: Time,
  options: {
    distanceFormattersFactory?: Partial<DistanceFormattersFactory>;
    includeSeconds?: boolean;
    addSuffix?: boolean;
  } = {},
) => {
  const { distanceFormattersFactory, includeSeconds, addSuffix } = options;
  const patternsFactory: DistanceFormattersFactory = Object.assign(
    {},
    defaultDistanceFormattersFactory,
    distanceFormattersFactory,
  );
  const date1 = timeToDate(time1);
  const date2 = timeToDate(time2);
  return formatDistance(date1, date2, {
    includeSeconds,
    addSuffix,
    locale: {
      formatDistance: (type: string, upTo: number) => {
        const formatter: DistanceFormatter = patternsFactory[type];
        if (!formatter) return "";
        return formatter(date1, date2, upTo, formatTime);
      },
    },
  });
};

const formatTimeByDistanceToNow = (
  time: Time,
  options?: {
    distanceFormattersFactory?: Partial<DistanceFormattersFactory>;
    includeSeconds?: boolean;
    addSuffix?: boolean;
    defaultFormat?: (date: Date) => string;
  },
) => {
  return formatTimeByDistance(time, unix(), options);
};

// 格式化为时长字符串 如视频时长
interface IFormatToDurationStringOption {
  zeroPrefix?: boolean;
  needMilliseconds?: boolean;
}

/**
 * @description 格式化为时长字符串 如视频时长 毫秒只保留到整数
 * @param {number} milliseconds
 * @param {keyof typeof MILLISECONDS_IN } upTo 最高位的时间单位 -eg: HOURS
 * @param {IFormatToDurationStringOption} option -eg: {zeroPrefix : true, needMilliseconds : true}
 * @returns durationString  -eg: input 321039.5 (ms)  output 00:05:21.039
 */
const formatToDurationString = (
  milliseconds: number = 0,
  upTo: keyof typeof MILLISECONDS_IN = "HOURS",
  option?: IFormatToDurationStringOption,
) => {
  const { zeroPrefix = true, needMilliseconds = true } = option || {};
  const keys = Object.keys(MILLISECONDS_IN);
  const startIndex = upTo ? keys.findIndex((t) => t === upTo) : 0;
  if (startIndex < 0) {
    logger.warn(
      LibName,
      "formatToDurationString",
      `the param "upto" ${upTo} invalid`,
    );
    return "";
  }
  const types = startIndex === 0 ? keys : keys.slice(startIndex);
  const results = {};

  const remainingMilliseconds = types.reduce((remaining, type, index) => {
    const unit = MILLISECONDS_IN[type];
    const r = Math.floor(remaining / unit);
    results[type] = !zeroPrefix && index === 0 ? r : String(r).padStart(2, "0");
    return remaining - r * unit;
  }, milliseconds);

  return `${Object.values(results).join(":")}${
    needMilliseconds
      ? `.${String(Math.floor(remainingMilliseconds)).padStart(3, "0")}`
      : ""
  }`;
};

/**
 * @description: 解析格式化出的时长字符串
 * @param {string} durationString -eg: 00:05:21.039
 * @return {number} milliseconds
 */
const parseDurationString = (durationString: string = ""): number => {
  const str = String(durationString);
  const [mainStr, millisecondsStr] = str.split(".");

  const mainTimeStrArr = mainStr.split(":");
  const types = Object.keys(MILLISECONDS_IN);

  let totalMilliseconds = 0;
  while (true) {
    const type = types.pop();
    const timeStr = mainTimeStrArr.pop();
    if (!type || !timeStr) break;
    const num = parseInt(timeStr);
    if (isNaN(num)) continue;
    totalMilliseconds += num * MILLISECONDS_IN[type];
  }

  const milliseconds = parseInt(millisecondsStr);
  if (!isNaN(milliseconds)) {
    totalMilliseconds += milliseconds;
  }
  return totalMilliseconds;
};

// date-fns
const fns = {
  format,
  getUnixTime,
  formatDistance,
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
  toDate,
  add,
  sub,
  min,
  max,
};

const fnsConstants = {
  millisecondsInHour,
  millisecondsInMinute,
  millisecondsInSecond,
};

const date = {
  unix,
  fromUnixTime,
  formatTime,
  formatTimeByDistance,
  formatTimeByDistanceToNow,
  formatToDurationString,
  parseDurationString,
  getIntervalDates,
  isExpired,
  isSame,
  MILLISECONDS_IN,
  fns,
  fnsConstants,
};

export default date;
