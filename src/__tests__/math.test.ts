/*
 * @Author: Shirtiny
 * @Date: 2021-10-15 10:54:56
 * @LastEditTime: 2021-10-15 10:57:18
 * @Description:
 */
import { math } from "../main";

describe("math", () => {
  it("restrict", () => {
    expect(math.restrict(-1, 0, 10)).toBe(0);
    expect(math.restrict(11, 0, 10)).toBe(10);
    expect(math.restrict(0, 0, 10)).toBe(0);
    expect(math.restrict(5, 0, 10)).toBe(5);
  });
});
