/*
 * @Author: Shirtiny
 * @Date: 2021-09-29 18:17:03
 * @LastEditTime: 2021-11-03 09:28:46
 * @Description:
 */
import { date, dev, math } from "./main";
import "./index.scss";
import { reactiveX } from "./lib";

date.formatTime(date.unix()); /* ? */

dev.set("k", "asd");
dev.set("a", { a: "a" });
dev.get("k", "123456"); /* ? */
dev.get("a", "123456"); /* ? */

/^\d{1,4}(-)(1[0-2]|0[1-9])\1(0[1-9]|[1-2]\d|30|31) (?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(
  "2021-01-01 12:06:03",
); /* ? */

math.restrict(11, 0, 10); /* ? */

date.isSame(new Date(), new Date().getTime() + 1000 * 1, "second"); /* ? */

date
  .getIntervalDates(new Date(), { months: 1, days: -1 }, "days")
  .map((d) => date.formatTime(d)); /* ? */

const div = document.createElement("div");
div.classList.add("mouse-hover-container");
const span = document.createElement("span");
span.textContent = "标题";
span.classList.add("mouse-hover-title");
div.appendChild(span);

document.body.appendChild(div);

reactiveX.mouseHovering({
  target: div,
  wait: 1000,
  onDisplay: (el) => {
    el.classList.add("display-title");
  },
  onHidden: (el) => {
    el.classList.remove("display-title");
  },
});
