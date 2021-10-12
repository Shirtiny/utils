/*
 * @Author: Shirtiny
 * @Date: 2021-09-29 18:17:03
 * @LastEditTime: 2021-10-12 17:14:25
 * @Description:
 */
import { date } from "../main";

const unixTime = 1632996383;

describe("date", () => {
  it("isExpired", () => {
    expect(date.isExpired(unixTime)).toBe(true);
  });
  it("formatUnixTime", () => {
    expect(date.formatUnixTime(unixTime)).toMatch(
      /^2021-\d{2}-\d{2} \d+:06:23 \+\d{4}$/,
    );
    expect(date.formatUnixTime(unixTime, "yyyy-MM-dd HH:mm:ss")).toMatch(
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
});
