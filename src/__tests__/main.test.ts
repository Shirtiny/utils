/*
 * @Author: Shirtiny
 * @Date: 2021-09-29 18:17:03
 * @LastEditTime: 2021-09-30 18:06:34
 * @Description:
 */
import { date } from "../main";

describe("main", () => {
  describe("date", () => {
    it("should expired", () => {
      expect(date.isExpired(1632996383)).toBe(true);
    });
  });
});
