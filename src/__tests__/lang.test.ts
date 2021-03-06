/*
 * @jest-environment jsdom
 * @Author: Shirtiny
 * @Date: 2021-10-09 14:17:20
 * @LastEditTime: 2022-01-14 16:34:18
 * @Description:
 */
import lang from "../lib/lang";

describe("lang", () => {
  it("isFn", () => {
    const fnsArr = [() => {}, async () => {}, function* () {}, Proxy];
    const nonFnsArr = [
      undefined,
      [1, 2, 3],
      true,
      new Date(),
      new Error(),
      Symbol("a"),
      { a: 1 },
      1,
      /x/,
      "a",
    ];
    fnsArr.forEach((f) => {
      expect(lang.isFn(f)).toBe(true);
    });
    nonFnsArr.forEach((n) => {
      expect(lang.isFn(n)).toBe(false);
    });
  });

  it("isNullOrUndefined", () => {
    expect(lang.isNullOrUndefined(null)).toBe(true);
    expect(lang.isNullOrUndefined()).toBe(true);
    expect(lang.isNullOrUndefined(0)).toBe(false);
    expect(lang.isNullOrUndefined("")).toBe(false);
    expect(lang.isNullOrUndefined("undefined")).toBe(false);
    expect(lang.isNullOrUndefined({})).toBe(false);
    expect(lang.isNullOrUndefined(() => {})).toBe(false);
    expect(lang.isNullOrUndefined(NaN)).toBe(false);
    expect(lang.isNullOrUndefined(false)).toBe(false);
  });
});
