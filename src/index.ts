/*
 * @Author: Shirtiny
 * @Date: 2021-09-29 18:17:03
 * @LastEditTime: 2021-10-09 12:10:37
 * @Description:
 */
import { date } from "./main";

const unixTime = date.unix(date.fromUnixTime(1632996383));/* ? */

unixTime; /* ? */

date.formatUnixTime(1632996383);/* ? */

console.log("hello world", date.unix());
