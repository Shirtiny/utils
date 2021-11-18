/*
 * @Author: Shirtiny
 * @Date: 2021-09-29 18:22:29
 * @LastEditTime: 2021-11-18 16:04:35
 * @Description:
 */
import { timer, from, fromEvent } from "rxjs";
import {
  switchMap,
  takeWhile,
  tap,
  takeUntil,
  retryWhen,
  delayWhen,
} from "rxjs/operators";
import logger from "src/utils/logger";

import dev from "./dev";

const LibName = "reactiveX";

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

// 时间任务
interface ITimerTaskOption {
  name: string;
  sec: number;
  delay?: number;
  request(index: number): Promise<any>;
  stopWhile(requestResult: any): boolean | undefined;
}

const createTimerTask = (option: ITimerTaskOption): ITask => {
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
    logger.warn(
      LibName,
      "createTimerTask",
      `repeat task name: ${name} , has been overwrite`,
    );
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

// 重试任务
interface IRetryTaskOption {
  name: string;
  request(): Promise<any>;
  count?: number;
  delay?: number;
}

// TODO:未完成
const createRetryTask = (option: IRetryTaskOption): ITask => {
  const { name = "", count = 0, delay = 0, request = async () => {} } = option;
  const run = async () => {
    await request();
  };
  console.log(count);

  let curCount = 0;
  const task: ITask = {
    name,
    start() {
      const source = from(run()).pipe(
        retryWhen((errors) => {
          return errors.pipe(
            // 输出错误信息
            tap((e) => {
              console.log(e);
              curCount++;
              console.log(`第${curCount}次重试`);
            }),
            delayWhen(() => timer(delay * 1000)),
            // takeWhile(() => curCount > count),
          );
        }),
      );
      const subscription = source.subscribe();
      this.stop = () => {
        subscription.unsubscribe();
      };
    },
    stop() {},
  };
  return task;
};

// 鼠标悬停
interface IMouseHoveringOption {
  target: HTMLElement | null;
  wait: number;
  onDisplay?(target: HTMLElement): void;
  onHidden?(target: HTMLElement): void;
}

const mouseHovering = (options: IMouseHoveringOption): void => {
  const { target, wait, onDisplay, onHidden } = options;
  if (!target) return;

  const display = () => {
    onDisplay && onDisplay(target);
  };

  const hidden = () => {
    onHidden && onHidden(target);
  };

  const leaveSource = fromEvent(target, "mouseleave").pipe(
    tap(() => {
      hidden();
    }),
  );

  const moveSource = fromEvent(target, "mousemove").pipe(
    tap(() => {
      display();
    }),
    switchMap(() =>
      timer(wait).pipe(
        tap(() => {
          wait && hidden();
        }),
        takeUntil(leaveSource),
      ),
    ),
  );

  leaveSource.subscribe();
  moveSource.subscribe();
};

const reactiveX = {
  createTimerTask,
  createRetryTask,
  mouseHovering,
};

export default reactiveX;
