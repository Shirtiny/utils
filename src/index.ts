/*
 * @Author: Shirtiny
 * @Date: 2021-09-29 18:17:03
 * @LastEditTime: 2021-09-30 09:48:00
 * @Description:
 */
import { add, reactive } from "./main";

console.log("hello world", add(1, 0), "dsdd");

const task = reactive.createTimerTask({
  name: "test",
  delay: 1,
  sec: 3,
  request: async (d) => {
    console.log("request");
  },
  stopWhile: () => {
    return false;
  },
});

task.start();

setTimeout(() => {
  task.stop();
}, 20000);
