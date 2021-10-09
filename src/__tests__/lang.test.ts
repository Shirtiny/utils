/*
 * @Author: Shirtiny
 * @Date: 2021-10-09 14:17:20
 * @LastEditTime: 2021-10-09 14:55:17
 * @Description:
 */
import { lang } from "../main";

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
});
