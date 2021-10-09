/*
 * @Author: Shirtiny
 * @Date: 2021-09-29 18:17:03
 * @LastEditTime: 2021-10-09 14:34:40
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
      /^2021-09-30 18:06:23 \+\d{4}$/,
    );
    expect(date.formatUnixTime(unixTime, "yyyy-MM-dd HH:mm:ss")).toMatch(
      "2021-09-30 18:06:23",
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
