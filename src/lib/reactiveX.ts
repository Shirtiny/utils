/*
 * @Author: Shirtiny
 * @Date: 2021-09-29 18:22:29
 * @LastEditTime: 2021-10-15 10:45:40
 * @Description:
 */
import { switchMap, timer, from, takeWhile } from "rxjs";
import dev from "./dev";

export interface ITask {
  name: string;
  start(): void;
  stop(): void;
}

const TaskMap = new Map<string, ITask>([
  [
    "ExampleTaskName",
    { name: "ExampleTaskName", start: () => {}, stop: () => {} },
  ],
]);

dev.set("taskMap", TaskMap);

interface ITaskOption {
  name: string;
  sec: number;
  delay?: number;
  request(index: number): Promise<any>;
  stopWhile(requestResult: any): boolean | undefined;
}

const createTimerTask = (option: ITaskOption): ITask => {
  const {
    name = "",
    sec = 5,
    delay = 0,
    request = async (_index: any) => {},
    stopWhile = (_res: any): any => {},
  } = option;

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

const reactiveX = {
  createTimerTask,
};

export default reactiveX;