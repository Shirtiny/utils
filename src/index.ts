/*
 * @Author: Shirtiny
 * @Date: 2021-09-29 18:17:03
 * @LastEditTime: 2021-10-12 17:15:39
 * @Description:
 */
import { date, dev } from "./main";

date.formatUnixTime(date.unix()); /* ? */

dev.set("k", "asd");
dev.set("a", { a: "a" });
dev.get("k", "123456"); /* ? */
dev.get("a", "123456"); /* ? */

/^\d{1,4}(-)(1[0-2]|0[1-9])\1(0[1-9]|[1-2]\d|30|31) (?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(
  "2021-01-01 12:06:03",
); /* ? */
