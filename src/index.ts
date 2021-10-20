/*
 * @Author: Shirtiny
 * @Date: 2021-09-29 18:17:03
 * @LastEditTime: 2021-10-20 15:40:06
 * @Description:
 */
import { date, dev, math, lang } from "./main";

date.formatUnixTime(date.unix()); /* ? */

dev.set("k", "asd");
dev.set("a", { a: "a" });
dev.get("k", "123456"); /* ? */
dev.get("a", "123456"); /* ? */

/^\d{1,4}(-)(1[0-2]|0[1-9])\1(0[1-9]|[1-2]\d|30|31) (?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(
  "2021-01-01 12:06:03",
); /* ? */

math.restrict(11, 0, 10); /* ? */

const a = lang.isNullOrUndefined(1);
a;
