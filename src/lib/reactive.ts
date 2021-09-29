/*
 * @Author: Shirtiny
 * @Date: 2021-09-29 18:22:29
 * @LastEditTime: 2021-09-29 20:36:30
 * @Description:
 */
import { switchMap, timer, from, takeWhile } from "rxjs";

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
  request = async (_index: any) => {},
  stopWhile = (_res: any): any => {},
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
        next: () => {},
        error: (e) => console.error(e, "定时任务出错"),
        complete: () => {},
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
