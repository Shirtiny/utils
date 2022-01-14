/*
 * @jest-environment jsdom
 * @Author: Shirtiny
 * @Date: 2021-09-29 18:17:03
 * @LastEditTime: 2022-01-14 16:33:56
 * @Description:
 */
import date from "../lib/date";

const unixTime = 1632996383;

describe("date", () => {
  it("isExpired", () => {
    expect(date.isExpired(unixTime)).toBe(true);
  });
  it("formatTime", () => {
    expect(date.formatTime(unixTime)).toMatch(
      /^2021-\d{2}-\d{2} \d+:06:23 \+\d{4}$/,
    );
    expect(date.formatTime(unixTime, "yyyy-MM-dd HH:mm:ss")).toMatch(
      /^\d{1,4}(-)(1[0-2]|0[1-9])\1(0[1-9]|[1-2]\d|30|31) (?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/,
    );
  });

  it("fromUnixTime", () => {
    expect(date.fromUnixTime(unixTime).getTime()).toBe(
      new Date(unixTime * 1000).getTime(),
    );
  });

  it("unix", () => {
    expect(date.unix(new Date(unixTime * 1000))).toBe(unixTime);
  });

  it("format and parse durationString", () => {
    // 1h 30m 15s 7.5ms
    const milliseconds =
      1 * 60 * 60 * 1000 + 1 * 30 * 60 * 1000 + 1 * 15 * 1000 + 1 * 7.5;
    const durationString = date.formatToDurationString(milliseconds, "HOURS", {
      needMilliseconds: true,
      zeroPrefix: false,
    });
    expect(durationString).toBe("1:30:15.007");
    expect(date.parseDurationString(durationString)).toBe(
      Math.floor(milliseconds),
    );
  });
});
