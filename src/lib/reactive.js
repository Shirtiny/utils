/*
 * @Author: Shirtiny
 * @Date: 2021-09-29 18:22:29
 * @LastEditTime: 2021-09-29 18:23:43
 * @Description:
 */
import { switchMap, timer, from, takeWhile } from "rxjs";
import logger from "utils/logger";

const TaskMap = new Map([
  [
    "ExampleTaskName",
    { name: "ExampleTaskName", start: () => {}, stop: () => {} },
  ],
]);

const createTimerTask = ({
  name = "",
  sec = 5,
  delay = 0,
  request = async (index) => {},
  stopWhile = (res) => {},
}) => {
  const oldTask = TaskMap.get(name);
  if (oldTask) {
    oldTask.stop();
    TaskMap.delete(name);
  }
  const source = timer(delay * 1000, sec * 1000).pipe(
    switchMap((index) => from(request(index))),
    takeWhile((res) => !stopWhile(res)),
  );

  const newTask = {
    name,
    start() {
      const subscription = source.subscribe({
        next: (data) => {
          logger.interval(name, data);
        },
        error: (e) => console.error(e, "定时任务出错"),
        complete: () => {
          logger.interval(`${name} 完成`);
        },
      });

      this.stop = () => {
        subscription.unsubscribe();
      };
    },
    stop() {},
  };
  TaskMap.set(name, newTask);
  return newTask;
};

const reactive = {
  createTimerTask,
};

export default reactive;
